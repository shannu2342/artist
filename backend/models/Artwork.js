import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], required: true },
    category: { type: String, default: 'general', trim: true },
    price: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Artwork', artworkSchema);
