import Artwork from '../models/Artwork.js';
import { deleteFile } from '../utils/gridfs.js';
import { uploadImageWithVariants } from '../utils/imageVariants.js';

export const listArtworks = async (req, res) => {
  const artworks = await Artwork.find().sort({ order: 1, createdAt: -1 });
  return res.json(artworks);
};

export const createArtwork = async (req, res) => {
  try {
    const { title, description, category = 'general', price = '', featured, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Create image paths from uploaded files
    const variants = await Promise.all(
      req.files.map(async (file) => {
        return uploadImageWithVariants(file.buffer, file.originalname);
      })
    );
    const imageUrls = variants.map(item => item.default);

    const artwork = await Artwork.create({
      title,
      description,
      images: imageUrls,
      imageVariants: variants,
      category,
      price,
      featured: featured === true || featured === 'true',
      order: order ? Number(order) : Date.now()
    });
    return res.status(201).json(artwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, featured, order } = req.body;

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Update basic fields
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    if (category) artwork.category = category;
    if (price) artwork.price = price;
    if (featured !== undefined) {
      artwork.featured = featured === true || featured === 'true';
    }
    if (order !== undefined) {
      artwork.order = Number(order);
    }

    // If new images were uploaded, add them to the images array
    if (req.files && req.files.length > 0) {
      const newVariantEntries = await Promise.all(
        req.files.map(async (file) => {
          return uploadImageWithVariants(file.buffer, file.originalname);
        })
      );
      const newImages = newVariantEntries.map(item => item.default);
      artwork.images = [...artwork.images, ...newImages];
      artwork.imageVariants = [...(artwork.imageVariants || []), ...newVariantEntries];
    }

    await artwork.save();
    return res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artwork = await Artwork.findByIdAndDelete(id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Delete uploaded images from GridFS
    const imagePaths = new Set(artwork.images || []);
    for (const variants of artwork.imageVariants || []) {
      if (variants?.default) imagePaths.add(variants.default);
      if (variants?.sm) imagePaths.add(variants.sm);
      if (variants?.md) imagePaths.add(variants.md);
      if (variants?.lg) imagePaths.add(variants.lg);
    }

    for (const imagePath of imagePaths) {
      const match = String(imagePath).match(/\/api\/files\/(.+)$/);
      if (match && match[1]) {
        try {
          await deleteFile(match[1]);
        } catch (err) {
          console.error('Error deleting file from GridFS:', err.message);
        }
      }
    }

    return res.json({ message: 'Artwork deleted' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
