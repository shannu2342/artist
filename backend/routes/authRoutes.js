import { Router } from 'express';
import { login, updateCredentials } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.put('/credentials', auth, updateCredentials);

export default router;
