import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Artwork from './models/Artwork.js';
import connectDB from './config/db.js';
import { uploadBuffer } from './utils/gridfs.js';

dotenv.config();

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
      let changed = false;

      for (const imagePath of artwork.images || []) {
        if (imagePath.startsWith('/api/files/')) {
          newImages.push(imagePath);
          continue;
        }

        const diskPath = imagePath.startsWith('/uploads/')
          ? path.join(process.cwd(), 'public', imagePath)
          : path.join(process.cwd(), 'public', 'uploads', imagePath);

        if (!fs.existsSync(diskPath)) {
          console.log(`Missing file for ${artwork._id}: ${imagePath}`);
          continue;
        }

        const buffer = fs.readFileSync(diskPath);
        const id = await uploadBuffer({
          buffer,
          filename: path.basename(diskPath),
          contentType: 'image/jpeg'
        });
        newImages.push(`/api/files/${id}`);
        changed = true;
      }

      if (changed) {
        artwork.images = newImages;
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
