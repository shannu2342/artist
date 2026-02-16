import { uploadBuffer } from './gridfs.js';
import { optimizeImageVariantsToAvif } from './imageProcessor.js';

const buildFilePath = (id) => `/api/files/${id}`;

export const uploadImageWithVariants = async (buffer, originalName) => {
  const optimized = await optimizeImageVariantsToAvif(buffer, originalName);

  const [smId, mdId, lgId] = await Promise.all([
    uploadBuffer(optimized.sm),
    uploadBuffer(optimized.md),
    uploadBuffer(optimized.lg)
  ]);

  return {
    default: buildFilePath(lgId),
    sm: buildFilePath(smId),
    md: buildFilePath(mdId),
    lg: buildFilePath(lgId)
  };
};

export const srcSetFromVariants = (variants = {}) => {
  const parts = [];
  if (variants.sm) parts.push(`${variants.sm} 640w`);
  if (variants.md) parts.push(`${variants.md} 1080w`);
  if (variants.lg) parts.push(`${variants.lg} 1600w`);
  return parts.join(', ');
};
