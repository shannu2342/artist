import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], required: true },
    imageVariants: {
      type: [
        {
          default: { type: String, default: '' },
          sm: { type: String, default: '' },
          md: { type: String, default: '' },
          lg: { type: String, default: '' }
        }
      ],
      default: []
    },
    category: { type: String, default: 'general', trim: true },
    price: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Artwork', artworkSchema);
