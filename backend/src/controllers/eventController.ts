import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export class EventController {
  async getUpcomingEvents(req: AuthRequest, res: Response) {
    try {
      const { days = '30' } = req.query;
      const daysAhead = parseInt(days as string, 10);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const events = await prisma.event.findMany({
        where: {
          contact: {
            userId: req.userId!
          },
          date: {
            gte: new Date(),
            lte: futureDate
          }
        },
        include: {
          contact: true,
          gifts: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { date: 'asc' }
      });

      res.json(events);
    } catch (error) {
      console.error('Get upcoming events error:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming events' });
    }
  }

  async createEvent(req: AuthRequest, res: Response) {
    try {
      const { contactId, type, name, date, recurring } = req.body;

      if (!contactId || !type || !name || !date) {
        return res.status(400).json({ error: 'contactId, type, name, and date are required' });
      }

      // Verify contact belongs to user
      const contact = await prisma.contact.findFirst({
        where: {
          id: contactId,
          userId: req.userId!
        }
      });

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const event = await prisma.event.create({
        data: {
          contactId,
          type,
          name,
          date: new Date(date),
          recurring: recurring || false
        }
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  async deleteEvent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const event = await prisma.event.findFirst({
        where: {
          id,
          contact: {
            userId: req.userId!
          }
        }
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      await prisma.event.delete({
        where: { id }
      });

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  }
}

export const eventController = new EventController();
