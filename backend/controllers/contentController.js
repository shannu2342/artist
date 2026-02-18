import Content from '../models/Content.js';
import fs from 'fs';
import { uploadImageWithVariants } from '../utils/imageVariants.js';

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

const sanitizeContentForResponse = (contentDoc) => {
  const content = typeof contentDoc.toObject === 'function' ? contentDoc.toObject() : { ...contentDoc };
  const heroVariants = (content.heroImageVariants || []).map(normalizeVariant);
  const artistVariant = normalizeVariant(content.artistProfile?.imageVariants || {});

  return {
    ...content,
    heroImageVariants: heroVariants,
    heroImages: heroVariants.map(v => v.medium || v.default).filter(Boolean),
    artistProfile: {
      ...(content.artistProfile || {}),
      image: artistVariant.medium || artistVariant.default || '',
      imageVariants: artistVariant
    }
  };
};

const getOrCreateContent = async () => {
  let content = await Content.findOne();
  if (!content) {
    content = await Content.create({});
  }
  return content;
};

export const getContent = async (req, res) => {
  const content = await getOrCreateContent();
  return res.json(sanitizeContentForResponse(content));
};

export const updateContent = async (req, res) => {
  const updates = req.body || {};
  const content = await getOrCreateContent();

  Object.assign(content, updates);
  await content.save();

  return res.json(sanitizeContentForResponse(content));
};

export const updateHeroImages = async (req, res) => {
  const content = await getOrCreateContent();

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  const variants = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadImageWithVariants(file.path, file.originalname);
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result;
    })
  );
  const images = variants.map(item => item.medium || item.default);
  content.heroImages = images;
  content.heroImageVariants = variants;
  await content.save();

  return res.json(sanitizeContentForResponse(content));
};

export const deleteHeroImage = async (req, res) => {
  const content = await getOrCreateContent();
  const { image } = req.body || {};

  if (!image) {
    return res.status(400).json({ message: 'Image path required' });
  }

  const currentHeroImages = [...(content.heroImages || [])];
  const currentHeroVariants = [...(content.heroImageVariants || [])];
  const removeIndex = currentHeroImages.findIndex(img => img === image);

  if (removeIndex >= 0) {
    currentHeroImages.splice(removeIndex, 1);
    currentHeroVariants.splice(removeIndex, 1);
    content.heroImages = currentHeroImages;
    content.heroImageVariants = currentHeroVariants;
  } else {
    const filteredVariants = currentHeroVariants.filter((variant) => (
      variant?.default !== image &&
      variant?.sm !== image &&
      variant?.md !== image &&
      variant?.lg !== image
    ));
    content.heroImageVariants = filteredVariants;
    content.heroImages = filteredVariants.map(variant => variant.default).filter(Boolean);
  }
  await content.save();

  return res.json(sanitizeContentForResponse(content));
};

export const updateArtistProfile = async (req, res) => {
  const content = await getOrCreateContent();
  const { name, bio } = req.body || {};

  if (name !== undefined) content.artistProfile.name = name;
  if (bio !== undefined) content.artistProfile.bio = bio;

  if (req.file) {
    const variants = await uploadImageWithVariants(req.file.path, req.file.originalname);
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    content.artistProfile.image = variants.medium || variants.default;
    content.artistProfile.imageVariants = variants;
  }

  await content.save();
  return res.json(sanitizeContentForResponse(content));
};
