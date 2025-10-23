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

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start scheduling service
  schedulingService.start();
});

export default app;
