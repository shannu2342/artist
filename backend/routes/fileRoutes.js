import { Router } from 'express';
import { getFile, getFileByName } from '../controllers/fileController.js';

const router = Router();

router.get('/name/:filename', getFileByName);
router.get('/:id', getFile);

export default router;
