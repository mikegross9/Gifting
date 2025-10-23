export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserSettings {
  id: string;
  approvalWindowDays: number;
  autoSendEnabled: boolean;
  notificationsEnabled: boolean;
  defaultBudgetMin: number;
  defaultBudgetMax: number;
}

export type RelationshipType = 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'OTHER';

export interface Contact {
  id: string;
  userId: string;
  name: string;
  relationship: RelationshipType;
  birthday?: string;
  email?: string;
  phone?: string;
  address?: string;
  preferences?: string;
  notes?: string;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
  updatedAt: string;
  events?: Event[];
  gifts?: Gift[];
}

export type EventType =
  | 'BIRTHDAY'
  | 'MOTHERS_DAY'
  | 'FATHERS_DAY'
  | 'VALENTINES_DAY'
  | 'CHRISTMAS'
  | 'ANNIVERSARY'
  | 'CUSTOM';

export interface Event {
  id: string;
  contactId: string;
  contact?: Contact;
  type: EventType;
  name: string;
  date: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
  gifts?: Gift[];
}

export type GiftStatus =
  | 'PENDING_RECOMMENDATION'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'MODIFIED'
  | 'REJECTED'
  | 'ORDERED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Gift {
  id: string;
  userId: string;
  contactId: string;
  contact?: Contact;
  eventId?: string;
  event?: Event;
  status: GiftStatus;
  name: string;
  description?: string;
  price: number;
  url?: string;
  imageUrl?: string;
  cardMessage?: string;
  recommendedAt: string;
  approvalDeadline?: string;
  approvedAt?: string;
  orderedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
