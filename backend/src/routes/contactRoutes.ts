import { Router } from 'express';
import { contactController } from '../controllers/contactController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => contactController.getContacts(req, res));
router.get('/:id', (req, res) => contactController.getContact(req, res));
router.post('/', (req, res) => contactController.createContact(req, res));
router.put('/:id', (req, res) => contactController.updateContact(req, res));
router.delete('/:id', (req, res) => contactController.deleteContact(req, res));

export default router;
