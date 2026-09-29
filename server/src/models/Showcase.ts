import mongoose, { Document, Schema } from 'mongoose';

export interface IShowcase extends Document {
  url: string;
  cloudinaryPublicId: string;
  order: number;
  createdAt: Date;
}

const ShowcaseSchema = new Schema<IShowcase>(
  {
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Showcase = mongoose.model<IShowcase>('Showcase', ShowcaseSchema);
