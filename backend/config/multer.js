import multer from 'multer';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'tmp-uploads');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Create the upload instance
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, tempDir),
        filename: (req, file, cb) => {
            const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${safeName}${path.extname(file.originalname || '')}`);
        }
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit to keep memory and CPU stable
    }
});

export default upload;
