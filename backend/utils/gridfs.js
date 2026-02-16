import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

const getBucket = () => {
  if (!mongoose.connection?.db) {
    throw new Error('MongoDB not connected');
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
};

export const uploadBuffer = ({ buffer, filename, contentType }) => new Promise((resolve, reject) => {
  const bucket = getBucket();
  const uploadStream = bucket.openUploadStream(filename, { contentType });

  uploadStream.on('error', reject);
  uploadStream.on('finish', () => {
    resolve(uploadStream.id.toString());
  });

  uploadStream.end(buffer);
});

export const deleteFile = async (id) => {
  const bucket = getBucket();
  await bucket.delete(new ObjectId(id));
};

export const openDownloadStream = (id) => {
  const bucket = getBucket();
  return bucket.openDownloadStream(new ObjectId(id));
};

export const findFileById = async (id) => {
  const bucket = getBucket();
  const files = await bucket.find({ _id: new ObjectId(id) }).toArray();
  return files[0];
};

export const findFileByName = async (filename) => {
  const bucket = getBucket();
  const files = await bucket.find({ filename }).toArray();
  return files[0];
};

export const openDownloadStreamByName = (filename) => {
  const bucket = getBucket();
  return bucket.openDownloadStreamByName(filename);
};
