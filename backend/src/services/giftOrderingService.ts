import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GiftOrderingService {
  async orderGift(giftId: string): Promise<{
    success: boolean;
    orderId?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
  }> {
    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      include: {
        contact: true,
        event: true
      }
    });

    if (!gift) {
      throw new Error('Gift not found');
    }

    if (!gift.contact.address) {
      throw new Error('Contact address is required for gift ordering');
    }

    // In production, this would integrate with actual e-commerce APIs
    // For now, we'll simulate the ordering process
    console.log(`[MOCK ORDER] Ordering gift: ${gift.name} for ${gift.contact.name}`);
    console.log(`[MOCK ORDER] Delivery address: ${gift.contact.address}`);
    console.log(`[MOCK ORDER] Price: $${gift.price}`);

    // Simulate order processing
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const trackingNumber = `TRACK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Estimated delivery in 3-5 days
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 3);

    // Update gift status
    await prisma.gift.update({
      where: { id: giftId },
      data: {
        status: 'ORDERED',
        orderedAt: new Date()
      }
    });

    // Simulate shipping after 1 day (in production, this would be webhook-based)
    setTimeout(async () => {
      await this.updateShippingStatus(giftId, trackingNumber);
    }, 24 * 60 * 60 * 1000); // 1 day

    return {
      success: true,
      orderId,
      trackingNumber,
      estimatedDelivery
    };
  }

  async updateShippingStatus(giftId: string, trackingNumber: string): Promise<void> {
    console.log(`[MOCK SHIPPING] Gift ${giftId} has been shipped. Tracking: ${trackingNumber}`);

    await prisma.gift.update({
      where: { id: giftId },
      data: {
        status: 'SHIPPED',
        shippedAt: new Date()
      }
    });

    // Simulate delivery after 3 days
    setTimeout(async () => {
      await this.updateDeliveryStatus(giftId);
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
  }

  async updateDeliveryStatus(giftId: string): Promise<void> {
    console.log(`[MOCK DELIVERY] Gift ${giftId} has been delivered`);

    await prisma.gift.update({
      where: { id: giftId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date()
      }
    });
  }

  async cancelOrder(giftId: string): Promise<boolean> {
    const gift = await prisma.gift.findUnique({
      where: { id: giftId }
    });

    if (!gift) {
      throw new Error('Gift not found');
    }

    if (gift.status === 'SHIPPED' || gift.status === 'DELIVERED') {
      throw new Error('Cannot cancel gift that has already been shipped');
    }

    await prisma.gift.update({
      where: { id: giftId },
      data: {
        status: 'CANCELLED'
      }
    });

    console.log(`[MOCK CANCEL] Order cancelled for gift ${giftId}`);

    return true;
  }
}

export const giftOrderingService = new GiftOrderingService();
