import Artwork from '../models/Artwork.js';
import fs from 'fs';
import { deleteImageVariants, uploadImageWithVariants } from '../utils/imageVariants.js';

const normalizeVariant = (variant = {}) => ({
  ...variant,
  default: variant.medium || variant.md || variant.default || '',
  small: variant.small || variant.sm || '',
  medium: variant.medium || variant.md || variant.default || '',
  full: variant.full || variant.lg || variant.default || '',
  sm: variant.small || variant.sm || '',
  md: variant.medium || variant.md || variant.default || '',
  lg: variant.full || variant.lg || variant.default || ''
});

const sanitizeArtworkForResponse = (artworkDoc) => {
  const artwork = typeof artworkDoc.toObject === 'function' ? artworkDoc.toObject() : { ...artworkDoc };
  const variants = (artwork.imageVariants || []).map(normalizeVariant);
  const images = variants.length > 0
    ? variants.map(v => v.medium || v.default).filter(Boolean)
    : (artwork.images || []).filter((img) => typeof img === 'string' && img.startsWith('/uploads/'));

  return {
    ...artwork,
    images,
    imageVariants: variants
  };
};

export const listArtworks = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 0), 50);

  if (page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Artwork.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      Artwork.countDocuments()
    ]);
    return res.json({
      items: items.map(sanitizeArtworkForResponse),
      page,
      limit,
      total,
      hasMore: skip + items.length < total
    });
  }

  const artworks = await Artwork.find().sort({ order: 1, createdAt: -1 });
  return res.json(artworks.map(sanitizeArtworkForResponse));
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
        const result = await uploadImageWithVariants(file.path, file.originalname);
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return result;
      })
    );
    const imageUrls = variants.map(item => item.medium || item.default);

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
    return res.status(201).json(sanitizeArtworkForResponse(artwork));
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
          const result = await uploadImageWithVariants(file.path, file.originalname);
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          return result;
        })
      );
      const newImages = newVariantEntries.map(item => item.medium || item.default);
      artwork.images = [...artwork.images, ...newImages];
      artwork.imageVariants = [...(artwork.imageVariants || []), ...newVariantEntries];
    }

    await artwork.save();
    return res.json(sanitizeArtworkForResponse(artwork));
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

    // Delete uploaded images from disk storage
    for (const variants of artwork.imageVariants || []) {
      await deleteImageVariants(variants);
    }

    return res.json({ message: 'Artwork deleted' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
