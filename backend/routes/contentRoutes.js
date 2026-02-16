import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getContent, updateContent, updateHeroImages, updateArtistProfile, deleteHeroImage } from '../controllers/contentController.js';
import upload from '../config/multer.js';

const router = Router();

router.get('/', getContent);
router.put('/', auth, updateContent);
router.post('/hero-images', auth, upload.array('images', 10), updateHeroImages);
router.delete('/hero-images', auth, deleteHeroImage);
router.post('/artist-profile', auth, upload.single('image'), updateArtistProfile);

export default router;
