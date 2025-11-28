import { Response } from 'express';
import { AuthRequest } from '../types';
import { authService } from '../services/authService';

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      console.log('=== REGISTRATION REQUEST ===');
      console.log('Body:', JSON.stringify(req.body));

      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        console.log('Missing required fields - email:', !!email, 'password:', !!password, 'name:', !!name);
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      console.log('Attempting to register user:', email);
      const result = await authService.register({ email, password, name });
      console.log('Registration successful for:', email);

      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login({ email, password });

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getUser(req.userId!);
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(404).json({ error: (error as Error).message });
    }
  }
}

export const authController = new AuthController();
