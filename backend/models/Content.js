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
    heroImageVariants: {
      type: [
        {
          default: { type: String, default: '' },
          small: { type: String, default: '' },
          medium: { type: String, default: '' },
          full: { type: String, default: '' },
          sm: { type: String, default: '' },
          md: { type: String, default: '' },
          lg: { type: String, default: '' }
        }
      ],
      default: []
    },
    artistProfile: {
      name: { type: String, default: 'Aurexon' },
      bio: { type: String, default: '' },
      image: { type: String, default: '' },
      imageVariants: {
        default: { type: String, default: '' },
        small: { type: String, default: '' },
        medium: { type: String, default: '' },
        full: { type: String, default: '' },
        sm: { type: String, default: '' },
        md: { type: String, default: '' },
        lg: { type: String, default: '' }
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Content', contentSchema);
