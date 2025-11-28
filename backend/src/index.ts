import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import giftRoutes from './routes/giftRoutes';
import eventRoutes from './routes/eventRoutes';
import { errorHandler } from './middleware/errorHandler';
import { schedulingService } from './services/schedulingService';

// Load environment variables
dotenv.config();

// Log environment status
console.log('==== Backend Server Starting ====');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('PORT:', process.env.PORT || '3001 (default)');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ NOT SET');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
console.log('=================================');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/events', eventRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API ready at http://localhost:${PORT}`);
  console.log('=================================');

  // Start scheduling service
  schedulingService.start();
});

export default app;
