import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Artwork from './models/Artwork.js';
import Content from './models/Content.js';
import connectDB from './config/db.js';
import { findFileById, openDownloadStream } from './utils/gridfs.js';
import { uploadImageWithVariants } from './utils/imageVariants.js';

dotenv.config();

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks)));
});

const extractFileId = (filePath = '') => {
  const match = filePath.match(/\/api\/files\/(.+)$/);
  return match?.[1] || null;
};

const fallbackVariant = (filePath = '') => ({
  default: filePath,
  sm: '',
  md: '',
  lg: filePath
});

const migrate = async () => {
  const convertedMap = new Map();
  let convertedFiles = 0;
  let updatedArtworks = 0;
  let updatedContentDocs = 0;

  const convertFilePathToVariants = async (filePath) => {
    const fileId = extractFileId(filePath);
    if (!fileId) return fallbackVariant(filePath);
    if (convertedMap.has(fileId)) return convertedMap.get(fileId);

    const file = await findFileById(fileId);
    if (!file) {
      const fallback = fallbackVariant(filePath);
      convertedMap.set(fileId, fallback);
      return fallback;
    }

    const stream = openDownloadStream(fileId);
    const sourceBuffer = await streamToBuffer(stream);
    const variants = await uploadImageWithVariants(sourceBuffer, file.filename || 'image');

    convertedMap.set(fileId, variants);
    convertedFiles += 1;
    return variants;
  };

  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected');

    const artworks = await Artwork.find();
    for (const artwork of artworks) {
      const oldImages = artwork.images || [];
      const nextImages = [];
      const nextVariants = [];
      let changed = false;

      for (let index = 0; index < oldImages.length; index += 1) {
        const imagePath = oldImages[index];
        const existingVariant = artwork.imageVariants?.[index];
        const migratedVariant = await convertFilePathToVariants(imagePath);

        nextImages.push(migratedVariant.default);
        nextVariants.push(migratedVariant);

        if (
          migratedVariant.default !== imagePath ||
          !existingVariant?.sm ||
          !existingVariant?.md ||
          !existingVariant?.lg
        ) {
          changed = true;
        }
      }

      if (changed) {
        artwork.images = nextImages;
        artwork.imageVariants = nextVariants;
        await artwork.save();
        updatedArtworks += 1;
      }
    }

    const contentDocs = await Content.find();
    for (const content of contentDocs) {
      let changed = false;

      const heroImages = [];
      const heroImageVariants = [];
      for (let index = 0; index < (content.heroImages || []).length; index += 1) {
        const imgPath = content.heroImages[index];
        const existingVariant = content.heroImageVariants?.[index];
        const migratedVariant = await convertFilePathToVariants(imgPath);
        heroImages.push(migratedVariant.default);
        heroImageVariants.push(migratedVariant);
        if (
          migratedVariant.default !== imgPath ||
          !existingVariant?.sm ||
          !existingVariant?.md ||
          !existingVariant?.lg
        ) {
          changed = true;
        }
      }
      content.heroImages = heroImages;
      content.heroImageVariants = heroImageVariants;

      const artistImage = content.artistProfile?.image || '';
      if (artistImage) {
        const existingArtistVariant = content.artistProfile?.imageVariants;
        const migratedArtistVariant = await convertFilePathToVariants(artistImage);
        if (migratedArtistVariant.default !== artistImage) {
          content.artistProfile.image = migratedArtistVariant.default;
          changed = true;
        }
        if (!existingArtistVariant?.sm || !existingArtistVariant?.md || !existingArtistVariant?.lg) {
          changed = true;
        }
        content.artistProfile.imageVariants = migratedArtistVariant;
      }

      if (changed) {
        await content.save();
        updatedContentDocs += 1;
      }
    }

    console.log(`Converted files: ${convertedFiles}`);
    console.log(`Updated artworks: ${updatedArtworks}`);
    console.log(`Updated content docs: ${updatedContentDocs}`);
  } catch (error) {
    console.error('AVIF migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

migrate();
