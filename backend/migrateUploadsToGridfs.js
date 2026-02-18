import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import Artwork from './models/Artwork.js';
import connectDB from './config/db.js';
import { uploadImageWithVariants } from './utils/imageVariants.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');

    const artworks = await Artwork.find();
    console.log(`Found ${artworks.length} artworks`);

    let updatedCount = 0;

    for (const artwork of artworks) {
      const newImages = [];
      const newImageVariants = [];
      let changed = false;

      const existingVariants = artwork.imageVariants || [];
      for (let index = 0; index < (artwork.images || []).length; index += 1) {
        const imagePath = artwork.images[index];
        if (typeof imagePath !== 'string' || imagePath.startsWith('/api/')) {
          continue;
        }

        const diskPath = imagePath.startsWith('/uploads/')
          ? path.join(__dirname, 'public', imagePath.replace(/^\/+/, ''))
          : path.join(__dirname, 'public', 'uploads', imagePath);

        if (!fs.existsSync(diskPath)) {
          console.log(`Missing file for ${artwork._id}: ${imagePath}`);
          continue;
        }

        const buffer = fs.readFileSync(diskPath);
        const variants = await uploadImageWithVariants(buffer, path.basename(diskPath));
        newImages.push(variants.default);
        newImageVariants.push(variants);
        changed = true;
      }

      if (changed || (artwork.images || []).length !== (artwork.imageVariants || []).length) {
        artwork.images = newImages;
        artwork.imageVariants = newImageVariants;
        await artwork.save();
        updatedCount += 1;
      }
    }

    console.log(`Updated ${updatedCount} artworks`);
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

migrate();
