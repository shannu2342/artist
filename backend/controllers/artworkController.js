import Artwork from '../models/Artwork.js';
import { deleteFile, uploadBuffer } from '../utils/gridfs.js';

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
    const images = await Promise.all(
      req.files.map(file => uploadBuffer({
        buffer: file.buffer,
        filename: file.originalname,
        contentType: file.mimetype
      }))
    );
    const imageUrls = images.map(id => `/api/files/${id}`);

    const artwork = await Artwork.create({
      title,
      description,
      images: imageUrls,
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
      const ids = await Promise.all(
        req.files.map(file => uploadBuffer({
          buffer: file.buffer,
          filename: file.originalname,
          contentType: file.mimetype
        }))
      );
      const newImages = ids.map(id => `/api/files/${id}`);
      artwork.images = [...artwork.images, ...newImages];
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
    for (const imagePath of artwork.images || []) {
      const match = imagePath.match(/\/api\/files\/(.+)$/);
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
