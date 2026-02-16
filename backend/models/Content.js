import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    about: { type: String, default: '' },
    services: {
      type: [
        {
          id: Number,
          name: String,
          description: String
        }
      ],
      default: []
    },
    terms: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    heroImages: { type: [String], default: [] },
    artistProfile: {
      name: { type: String, default: 'Aurexon' },
      bio: { type: String, default: '' },
      image: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Content', contentSchema);
