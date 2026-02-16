import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

const resetAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.deleteMany({ email: { $ne: normalizedEmail } });
  const updated = await Admin.findOneAndUpdate(
    { email: normalizedEmail },
    { email: normalizedEmail, passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin reset for ${updated.email}`);
};

const run = async () => {
  try {
    await connectDB();
    await resetAdmin();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
