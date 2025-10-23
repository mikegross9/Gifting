import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { giftOrderingService } from '../services/giftOrderingService';
import { giftRecommendationService } from '../services/giftRecommendationService';
import { cardWritingService } from '../services/cardWritingService';

const prisma = new PrismaClient();

export class GiftController {
  async getGifts(req: AuthRequest, res: Response) {
    try {
      const gifts = await prisma.gift.findMany({
        where: { userId: req.userId! },
        include: {
          contact: true,
          event: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(gifts);
    } catch (error) {
      console.error('Get gifts error:', error);
      res.status(500).json({ error: 'Failed to fetch gifts' });
    }
  }

  async getPendingApprovals(req: AuthRequest, res: Response) {
    try {
      const pendingGifts = await prisma.gift.findMany({
        where: {
          userId: req.userId!,
          status: 'PENDING_APPROVAL'
        },
        include: {
          contact: true,
          event: true
        },
        orderBy: { approvalDeadline: 'asc' }
      });

      res.json(pendingGifts);
    } catch (error) {
      console.error('Get pending approvals error:', error);
      res.status(500).json({ error: 'Failed to fetch pending approvals' });
    }
  }

  async approveGift(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const gift = await prisma.gift.findFirst({
        where: {
          id,
          userId: req.userId!
        }
      });

      if (!gift) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      if (gift.status !== 'PENDING_APPROVAL') {
        return res.status(400).json({ error: 'Gift is not pending approval' });
      }

      // Update gift status
      const updatedGift = await prisma.gift.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date()
        }
      });

      // Order the gift
      const orderResult = await giftOrderingService.orderGift(id);

      res.json({ gift: updatedGift, order: orderResult });
    } catch (error) {
      console.error('Approve gift error:', error);
      res.status(500).json({ error: 'Failed to approve gift' });
    }
  }

  async modifyGift(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, url, imageUrl, cardMessage } = req.body;

      const gift = await prisma.gift.findFirst({
        where: {
          id,
          userId: req.userId!
        }
      });

      if (!gift) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      if (gift.status !== 'PENDING_APPROVAL') {
        return res.status(400).json({ error: 'Can only modify gifts pending approval' });
      }

      const updatedGift = await prisma.gift.update({
        where: { id },
        data: {
          name: name || gift.name,
          description: description !== undefined ? description : gift.description,
          price: price || gift.price,
          url: url !== undefined ? url : gift.url,
          imageUrl: imageUrl !== undefined ? imageUrl : gift.imageUrl,
          cardMessage: cardMessage !== undefined ? cardMessage : gift.cardMessage,
          status: 'MODIFIED'
        }
      });

      res.json(updatedGift);
    } catch (error) {
      console.error('Modify gift error:', error);
      res.status(500).json({ error: 'Failed to modify gift' });
    }
  }

  async rejectGift(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const gift = await prisma.gift.findFirst({
        where: {
          id,
          userId: req.userId!
        }
      });

      if (!gift) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      const updatedGift = await prisma.gift.update({
        where: { id },
        data: {
          status: 'REJECTED'
        }
      });

      res.json(updatedGift);
    } catch (error) {
      console.error('Reject gift error:', error);
      res.status(500).json({ error: 'Failed to reject gift' });
    }
  }

  async getRecommendations(req: AuthRequest, res: Response) {
    try {
      const { contactId, occasion } = req.query;

      if (!contactId || !occasion) {
        return res.status(400).json({ error: 'contactId and occasion are required' });
      }

      const contact = await prisma.contact.findFirst({
        where: {
          id: contactId as string,
          userId: req.userId!
        },
        include: {
          user: {
            include: {
              settings: true
            }
          },
          gifts: {
            where: { status: 'DELIVERED' },
            orderBy: { deliveredAt: 'desc' },
            take: 5
          }
        }
      });

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const settings = contact.user.settings;
      const recommendations = await giftRecommendationService.recommendGifts({
        recipientName: contact.name,
        relationship: contact.relationship,
        occasion: occasion as string,
        preferences: contact.preferences || undefined,
        budgetMin: contact.budgetMin || settings?.defaultBudgetMin || 25,
        budgetMax: contact.budgetMax || settings?.defaultBudgetMax || 100,
        previousGifts: contact.gifts.map(g => g.name)
      });

      res.json(recommendations);
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get gift recommendations' });
    }
  }
}

export const giftController = new GiftController();
