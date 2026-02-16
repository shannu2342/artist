import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Artwork from './models/Artwork.js';
import connectDB from './config/db.js';
import { uploadBuffer } from './utils/gridfs.js';

dotenv.config();

// Function to read and upload images
const uploadImages = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected to database');

        // Path to images folder
        const imagesFolder = path.join(process.cwd(), '../images');

        // Check if images folder exists
        if (!fs.existsSync(imagesFolder)) {
            console.error(`Images folder not found at: ${imagesFolder}`);
            return;
        }

        // Get all image files from the folder
        const files = fs.readdirSync(imagesFolder);
        const imageFiles = files.filter(file =>
            file.match(/\.(jpeg|jpg|png|gif|webp)$/i)
        );

        console.log(`Found ${imageFiles.length} images to upload`);

        // Create artwork records for each image
        const artworks = [];
        for (let i = 0; i < imageFiles.length; i++) {
            const fileName = imageFiles[i];
            const titleBase = path.basename(fileName, path.extname(fileName));
            const exists = await Artwork.findOne({ title: titleBase }).lean();
            if (exists) {
                console.log(`Skipping (already in DB): ${fileName}`);
                continue;
            }

            // Create a simple title from the filename
            let title = path.basename(fileName, path.extname(fileName));
            title = title.replace(/WhatsApp Image \d+-\d+-\d+ at /, '');
            title = title.replace(/ PM| AM/g, '');
            title = title.replace(/\(|\)|-/g, ' ');
            title = title.trim().replace(/\s+/g, ' ');
            title = title.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            // Create artwork object
            const buffer = fs.readFileSync(path.join(imagesFolder, fileName));
            const fileId = await uploadBuffer({
                buffer,
                filename: fileName,
                contentType: 'image/jpeg'
            });

            const artwork = {
                title: title || `Untitled Artwork ${i + 1}`,
                description: 'Beautiful artwork created by Aurexon',
                images: [`/api/files/${fileId}`],
                category: 'digital',
                price: ''
            };

            artworks.push(artwork);
        }

        if (artworks.length > 0) {
            console.log('Creating artwork records...');
            await Artwork.insertMany(artworks);
            console.log(`Successfully uploaded ${artworks.length} artworks`);
        } else {
            console.log('No new artworks to insert');
        }

        console.log('Images uploaded to MongoDB GridFS');

    } catch (error) {
        console.error('Error uploading images:', error);
    } finally {
        console.log('Disconnecting from database...');
        await mongoose.connection.close();
    }
};

uploadImages();
