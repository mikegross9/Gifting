import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Contact,
  Gift,
  Event
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data;
  }
};

// Contacts API
export const contactsApi = {
  getAll: async (): Promise<Contact[]> => {
    const { data } = await api.get('/contacts');
    return data;
  },

  getById: async (id: string): Promise<Contact> => {
    const { data } = await api.get(`/contacts/${id}`);
    return data;
  },

  create: async (contactData: Partial<Contact>): Promise<Contact> => {
    const { data } = await api.post('/contacts', contactData);
    return data;
  },

  update: async (id: string, contactData: Partial<Contact>): Promise<Contact> => {
    const { data } = await api.put(`/contacts/${id}`, contactData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  }
};

// Gifts API
export const giftsApi = {
  getAll: async (): Promise<Gift[]> => {
    const { data } = await api.get('/gifts');
    return data;
  },

  getPending: async (): Promise<Gift[]> => {
    const { data } = await api.get('/gifts/pending');
    return data;
  },

  approve: async (id: string): Promise<Gift> => {
    const { data } = await api.post(`/gifts/${id}/approve`);
    return data;
  },

  modify: async (id: string, updates: Partial<Gift>): Promise<Gift> => {
    const { data } = await api.post(`/gifts/${id}/modify`, updates);
    return data;
  },

  reject: async (id: string): Promise<Gift> => {
    const { data } = await api.post(`/gifts/${id}/reject`);
    return data;
  },

  getRecommendations: async (contactId: string, occasion: string): Promise<any[]> => {
    const { data } = await api.get('/gifts/recommendations', {
      params: { contactId, occasion }
    });
    return data;
  }
};

// Events API
export const eventsApi = {
  getUpcoming: async (days: number = 30): Promise<Event[]> => {
    const { data } = await api.get('/events/upcoming', { params: { days } });
    return data;
  },

  create: async (eventData: Partial<Event>): Promise<Event> => {
    const { data } = await api.post('/events', eventData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  }
};

export default api;
