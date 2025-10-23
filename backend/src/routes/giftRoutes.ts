import { Router } from 'express';
import { giftController } from '../controllers/giftController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => giftController.getGifts(req, res));
router.get('/pending', (req, res) => giftController.getPendingApprovals(req, res));
router.get('/recommendations', (req, res) => giftController.getRecommendations(req, res));
router.post('/:id/approve', (req, res) => giftController.approveGift(req, res));
router.post('/:id/modify', (req, res) => giftController.modifyGift(req, res));
router.post('/:id/reject', (req, res) => giftController.rejectGift(req, res));

export default router;
