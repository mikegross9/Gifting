import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { giftRecommendationService } from './giftRecommendationService';
import { cardWritingService } from './cardWritingService';
import { giftOrderingService } from './giftOrderingService';

const prisma = new PrismaClient();

export class SchedulingService {
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log('Scheduling service is already running');
      return;
    }

    console.log('Starting gift scheduling service...');
    this.isRunning = true;

    // Run daily at 9 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('[SCHEDULER] Running daily gift check...');
      await this.checkUpcomingEvents();
      await this.processApprovalDeadlines();
    });

    // Also run immediately on startup
    this.checkUpcomingEvents();
    this.processApprovalDeadlines();
  }

  async checkUpcomingEvents() {
    try {
      // Get all events in the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const upcomingEvents = await prisma.event.findMany({
        where: {
          date: {
            gte: new Date(),
            lte: thirtyDaysFromNow
          }
        },
        include: {
          contact: {
            include: {
              user: {
                include: {
                  settings: true
                }
              }
            }
          },
          gifts: {
            where: {
              status: {
                in: ['PENDING_RECOMMENDATION', 'PENDING_APPROVAL', 'APPROVED']
              }
            }
          }
        }
      });

      for (const event of upcomingEvents) {
        const settings = event.contact.user.settings;
        if (!settings) continue;

        const daysUntilEvent = Math.ceil(
          (event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if we need to create gift recommendations
        const approvalWindowDays = settings.approvalWindowDays;
        const needsGiftRecommendation = daysUntilEvent <= approvalWindowDays && event.gifts.length === 0;

        if (needsGiftRecommendation) {
          console.log(`[SCHEDULER] Creating gift recommendations for ${event.contact.name} - ${event.name}`);
          await this.createGiftRecommendations(event.id);
        }
      }
    } catch (error) {
      console.error('[SCHEDULER] Error checking upcoming events:', error);
    }
  }

  async createGiftRecommendations(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        contact: {
          include: {
            user: {
              include: {
                settings: true
              }
            },
            gifts: {
              where: {
                status: 'DELIVERED'
              },
              orderBy: {
                deliveredAt: 'desc'
              },
              take: 5
            }
          }
        }
      }
    });

    if (!event) return;

    const contact = event.contact;
    const settings = contact.user.settings;

    if (!settings) return;

    // Get gift recommendations
    const recommendations = await giftRecommendationService.recommendGifts({
      recipientName: contact.name,
      relationship: contact.relationship,
      occasion: event.name,
      preferences: contact.preferences || undefined,
      budgetMin: contact.budgetMin || settings.defaultBudgetMin,
      budgetMax: contact.budgetMax || settings.defaultBudgetMax,
      previousGifts: contact.gifts.map(g => g.name)
    });

    // Create gift record with the top recommendation
    const topRecommendation = recommendations[0];

    if (!topRecommendation) return;

    // Generate card message
    const cardMessage = await cardWritingService.generateCardMessage({
      recipientName: contact.name,
      relationship: contact.relationship,
      occasion: event.name,
      giftDescription: topRecommendation.name,
      senderName: contact.user.name
    });

    // Calculate approval deadline
    const approvalDeadline = new Date(event.date);
    approvalDeadline.setDate(approvalDeadline.getDate() - 7); // 7 days before event for shipping

    const gift = await prisma.gift.create({
      data: {
        userId: contact.userId,
        contactId: contact.id,
        eventId: event.id,
        name: topRecommendation.name,
        description: topRecommendation.description,
        price: topRecommendation.price,
        url: topRecommendation.url,
        imageUrl: topRecommendation.imageUrl,
        cardMessage: cardMessage,
        status: 'PENDING_APPROVAL',
        approvalDeadline: approvalDeadline
      }
    });

    console.log(`[SCHEDULER] Created gift recommendation: ${gift.name} for ${contact.name}`);
  }

  async processApprovalDeadlines() {
    try {
      // Find all gifts with past approval deadlines that are still pending approval
      const expiredApprovals = await prisma.gift.findMany({
        where: {
          status: 'PENDING_APPROVAL',
          approvalDeadline: {
            lte: new Date()
          }
        },
        include: {
          contact: {
            include: {
              user: {
                include: {
                  settings: true
                }
              }
            }
          }
        }
      });

      for (const gift of expiredApprovals) {
        const settings = gift.contact.user.settings;

        if (settings?.autoSendEnabled) {
          console.log(`[SCHEDULER] Auto-approving and ordering gift: ${gift.name} for ${gift.contact.name}`);

          // Auto-approve the gift
          await prisma.gift.update({
            where: { id: gift.id },
            data: {
              status: 'APPROVED',
              approvedAt: new Date()
            }
          });

          // Order the gift
          await giftOrderingService.orderGift(gift.id);
        } else {
          // Mark as expired but don't order
          console.log(`[SCHEDULER] Approval expired for gift: ${gift.name} (auto-send disabled)`);
          await prisma.gift.update({
            where: { id: gift.id },
            data: {
              status: 'CANCELLED'
            }
          });
        }
      }
    } catch (error) {
      console.error('[SCHEDULER] Error processing approval deadlines:', error);
    }
  }
}

export const schedulingService = new SchedulingService();
