import Content from '../models/Content.js';
import { uploadBuffer } from '../utils/gridfs.js';

const getOrCreateContent = async () => {
  let content = await Content.findOne();
  if (!content) {
    content = await Content.create({});
  }
  return content;
};

export const getContent = async (req, res) => {
  const content = await getOrCreateContent();
  return res.json(content);
};

export const updateContent = async (req, res) => {
  const updates = req.body || {};
  const content = await getOrCreateContent();

  Object.assign(content, updates);
  await content.save();

  return res.json(content);
};

export const updateHeroImages = async (req, res) => {
  const content = await getOrCreateContent();

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  const ids = await Promise.all(
    req.files.map(file => uploadBuffer({
      buffer: file.buffer,
      filename: file.originalname,
      contentType: file.mimetype
    }))
  );
  const images = ids.map(id => `/api/files/${id}`);
  content.heroImages = images;
  await content.save();

  return res.json(content);
};

export const deleteHeroImage = async (req, res) => {
  const content = await getOrCreateContent();
  const { image } = req.body || {};

  if (!image) {
    return res.status(400).json({ message: 'Image path required' });
  }

  content.heroImages = (content.heroImages || []).filter(img => img !== image);
  await content.save();

  return res.json(content);
};

export const updateArtistProfile = async (req, res) => {
  const content = await getOrCreateContent();
  const { name, bio } = req.body || {};

  if (name !== undefined) content.artistProfile.name = name;
  if (bio !== undefined) content.artistProfile.bio = bio;

  if (req.file) {
    const id = await uploadBuffer({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    content.artistProfile.image = `/api/files/${id}`;
  }

  await content.save();
  return res.json(content);
};
