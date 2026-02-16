import path from 'path';
import sharp from 'sharp';

const DEFAULT_MAX_EDGE = Number(process.env.IMAGE_MAX_EDGE || 2200);
const DEFAULT_AVIF_QUALITY = Number(process.env.AVIF_QUALITY || 62);
const DEFAULT_AVIF_EFFORT = Number(process.env.AVIF_EFFORT || 6);
const DEFAULT_SM_WIDTH = Number(process.env.IMAGE_SM_WIDTH || 640);
const DEFAULT_MD_WIDTH = Number(process.env.IMAGE_MD_WIDTH || 1080);
const DEFAULT_LG_WIDTH = Number(process.env.IMAGE_LG_WIDTH || 1600);

const toAvifFilename = (originalName = 'upload', suffix = '') => {
  const parsed = path.parse(originalName);
  const safeBase = (parsed.name || 'upload').replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${safeBase}${suffix ? `_${suffix}` : ''}.avif`;
};

const encodeAvifBuffer = async (pipeline) => pipeline
  .avif({
    quality: DEFAULT_AVIF_QUALITY,
    effort: DEFAULT_AVIF_EFFORT,
    chromaSubsampling: '4:4:4'
  })
  .toBuffer();

const createVariant = async (basePipeline, originalName, width, label) => {
  const variantBuffer = await encodeAvifBuffer(
    basePipeline.clone().resize({
      width,
      height: width,
      fit: 'inside',
      withoutEnlargement: true
    })
  );

  return {
    label,
    width,
    buffer: variantBuffer,
    filename: toAvifFilename(originalName, label),
    contentType: 'image/avif'
  };
};

export const optimizeImageVariantsToAvif = async (buffer, originalName) => {
  const pipeline = sharp(buffer, { failOn: 'none' }).rotate();
  const metadata = await pipeline.metadata();
  const width = metadata.width || DEFAULT_LG_WIDTH;
  const height = metadata.height || DEFAULT_LG_WIDTH;

  let base = pipeline;
  if (width > DEFAULT_MAX_EDGE || height > DEFAULT_MAX_EDGE) {
    base = pipeline.resize({
      width: DEFAULT_MAX_EDGE,
      height: DEFAULT_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  const sm = await createVariant(base, originalName, DEFAULT_SM_WIDTH, 'sm');
  const md = await createVariant(base, originalName, DEFAULT_MD_WIDTH, 'md');
  const lg = await createVariant(base, originalName, DEFAULT_LG_WIDTH, 'lg');

  return { sm, md, lg };
};

export const optimizeImageToAvif = async (buffer, originalName) => {
  const { lg } = await optimizeImageVariantsToAvif(buffer, originalName);
  return {
    buffer: lg.buffer,
    filename: toAvifFilename(originalName),
    contentType: 'image/avif'
  };
};
