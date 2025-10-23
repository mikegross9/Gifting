import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ContactInput {
  name: string;
  relationship: 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';
  birthday?: string;
  email?: string;
  phone?: string;
  address?: string;
  preferences?: string;
  notes?: string;
  budgetMin?: number;
  budgetMax?: number;
}

export interface GiftRecommendation {
  name: string;
  description: string;
  price: number;
  url?: string;
  imageUrl?: string;
  reasoning: string;
}

export interface CardMessage {
  message: string;
  tone: 'formal' | 'casual' | 'heartfelt' | 'funny';
}
