import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/upcoming', (req, res) => eventController.getUpcomingEvents(req, res));
router.post('/', (req, res) => eventController.createEvent(req, res));
router.delete('/:id', (req, res) => eventController.deleteEvent(req, res));

export default router;
