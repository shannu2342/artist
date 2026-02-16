import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  listArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork
} from '../controllers/artworkController.js';
import upload from '../config/multer.js';

const router = Router();

router.get('/', listArtworks);
router.post('/', auth, upload.array('images', 10), createArtwork);
router.put('/:id', auth, upload.array('images', 10), updateArtwork);
router.delete('/:id', auth, deleteArtwork);

export default router;
