import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, ContactInput } from '../types';

const prisma = new PrismaClient();

export class ContactController {
  async getContacts(req: AuthRequest, res: Response) {
    try {
      const contacts = await prisma.contact.findMany({
        where: { userId: req.userId! },
        include: {
          events: true,
          gifts: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { name: 'asc' }
      });

      res.json(contacts);
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  async getContact(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findFirst({
        where: {
          id,
          userId: req.userId!
        },
        include: {
          events: true,
          gifts: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({ error: 'Failed to fetch contact' });
    }
  }

  async createContact(req: AuthRequest, res: Response) {
    try {
      const data: ContactInput = req.body;

      if (!data.name || !data.relationship) {
        return res.status(400).json({ error: 'Name and relationship are required' });
      }

      const contact = await prisma.contact.create({
        data: {
          userId: req.userId!,
          name: data.name,
          relationship: data.relationship,
          birthday: data.birthday ? new Date(data.birthday) : undefined,
          email: data.email,
          phone: data.phone,
          address: data.address,
          preferences: data.preferences,
          notes: data.notes,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax
        }
      });

      // If birthday is provided, create a birthday event
      if (contact.birthday) {
        await prisma.event.create({
          data: {
            contactId: contact.id,
            type: 'BIRTHDAY',
            name: `${contact.name}'s Birthday`,
            date: contact.birthday,
            recurring: true
          }
        });
      }

      res.status(201).json(contact);
    } catch (error) {
      console.error('Create contact error:', error);
      res.status(500).json({ error: 'Failed to create contact' });
    }
  }

  async updateContact(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data: ContactInput = req.body;

      const existingContact = await prisma.contact.findFirst({
        where: {
          id,
          userId: req.userId!
        }
      });

      if (!existingContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const contact = await prisma.contact.update({
        where: { id },
        data: {
          name: data.name,
          relationship: data.relationship,
          birthday: data.birthday ? new Date(data.birthday) : undefined,
          email: data.email,
          phone: data.phone,
          address: data.address,
          preferences: data.preferences,
          notes: data.notes,
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax
        }
      });

      res.json(contact);
    } catch (error) {
      console.error('Update contact error:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  }

  async deleteContact(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findFirst({
        where: {
          id,
          userId: req.userId!
        }
      });

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      await prisma.contact.delete({
        where: { id }
      });

      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  }
}

export const contactController = new ContactController();
