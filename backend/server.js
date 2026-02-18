import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import path from 'path';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173'
];

const envAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'), false);
  }
}));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Serve static files from public folder
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '365d',
  immutable: true
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/files', fileRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const start = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
      const existingAdmin = await Admin.findOne();
      if (!existingAdmin) {
        const normalizedEmail = email.toLowerCase().trim();
        const passwordHash = await bcrypt.hash(password, 10);
        await Admin.create({ email: normalizedEmail, passwordHash });
        console.log(`Admin user created from env: ${normalizedEmail}`);
      }
    }
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
