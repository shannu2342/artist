import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const FULL_MAX_EDGE = Number(process.env.IMAGE_MAX_EDGE || 2200);
const SMALL_WIDTH = Number(process.env.IMAGE_SM_WIDTH || 480);
const MEDIUM_WIDTH = Number(process.env.IMAGE_MD_WIDTH || 960);
const FULL_WIDTH = Number(process.env.IMAGE_LG_WIDTH || 1800);
const IMAGE_QUALITY = Number(process.env.AVIF_QUALITY || 52);
const IMAGE_EFFORT = Number(process.env.AVIF_EFFORT || 2);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultUploadsBaseDir = path.join(__dirname, '..', 'public', 'uploads');
const uploadsBaseDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : defaultUploadsBaseDir;
const smallDir = path.join(uploadsBaseDir, 'small');
const mediumDir = path.join(uploadsBaseDir, 'medium');
const fullDir = path.join(uploadsBaseDir, 'full');

for (const dir of [smallDir, mediumDir, fullDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const safeBaseName = (originalName = 'image') => {
  const extless = path.parse(originalName).name || 'image';
  const normalized = extless.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${normalized}`;
};

const writeVariant = async ({ inputSource, width, outputPath }) => {
  await sharp(inputSource, { failOn: 'none' })
    .rotate()
    .resize({
      width,
      height: width,
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({
      quality: IMAGE_QUALITY,
      effort: IMAGE_EFFORT,
      chromaSubsampling: '4:2:0'
    })
    .toFile(outputPath);
};

export const uploadImageWithVariants = async (inputSource, originalName) => {
  const baseName = safeBaseName(originalName);

  const smallFile = `${baseName}-small.avif`;
  const mediumFile = `${baseName}-medium.avif`;
  const fullFile = `${baseName}-full.avif`;

  const smallOutput = path.join(smallDir, smallFile);
  const mediumOutput = path.join(mediumDir, mediumFile);
  const fullOutput = path.join(fullDir, fullFile);

  await Promise.all([
    writeVariant({ inputSource, width: SMALL_WIDTH, outputPath: smallOutput }),
    writeVariant({ inputSource, width: MEDIUM_WIDTH, outputPath: mediumOutput }),
    writeVariant({ inputSource, width: FULL_WIDTH > FULL_MAX_EDGE ? FULL_MAX_EDGE : FULL_WIDTH, outputPath: fullOutput })
  ]);

  return {
    default: `/uploads/medium/${mediumFile}`,
    small: `/uploads/small/${smallFile}`,
    medium: `/uploads/medium/${mediumFile}`,
    full: `/uploads/full/${fullFile}`,
    sm: `/uploads/small/${smallFile}`,
    md: `/uploads/medium/${mediumFile}`,
    lg: `/uploads/full/${fullFile}`
  };
};

export const deleteImageVariants = async (variants = {}) => {
  const uniquePaths = new Set(
    [
      variants.default,
      variants.small,
      variants.medium,
      variants.full,
      variants.sm,
      variants.md,
      variants.lg
    ].filter(Boolean)
  );

  for (const relativePath of uniquePaths) {
    if (!relativePath.startsWith('/uploads/')) continue;
    const suffix = relativePath.replace(/^\/uploads\/?/, '');
    const filePath = path.join(uploadsBaseDir, suffix);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting image variant:', error.message);
      }
    }
  }
};
