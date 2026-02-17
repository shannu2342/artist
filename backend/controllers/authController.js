import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token });
};

export const updateCredentials = async (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body || {};

  if (!currentPassword || !newEmail || !newPassword) {
    return res.status(400).json({ message: 'Current password, new email, and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  const currentAdmin = await Admin.findById(req.admin?.id);
  if (!currentAdmin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const validCurrentPassword = await bcrypt.compare(currentPassword, currentAdmin.passwordHash);
  if (!validCurrentPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const normalizedEmail = String(newEmail).toLowerCase().trim();
  const existingWithEmail = await Admin.findOne({ email: normalizedEmail, _id: { $ne: currentAdmin._id } });
  if (existingWithEmail) {
    return res.status(409).json({ message: 'Email is already in use' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await Admin.updateOne(
    { _id: currentAdmin._id },
    { $set: { email: normalizedEmail, passwordHash } }
  );
  await Admin.deleteMany({ _id: { $ne: currentAdmin._id } });

  const token = jwt.sign(
    { id: currentAdmin._id, email: normalizedEmail },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token, email: normalizedEmail, message: 'Admin credentials updated' });
};
