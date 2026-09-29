import mongoose, { Document, Schema, Types } from 'mongoose';

export type AlbumCategory = 'wedding' | 'hotel' | 'birthday' | 'corporate' | 'other';

export interface IAlbum extends Document {
  title: string;
  slug: string;
  category: AlbumCategory;
  description?: string;
  eventDate?: Date;
  location?: string;
  coverMediaId?: Types.ObjectId;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['wedding', 'hotel', 'birthday', 'corporate', 'other'],
    },
    description: { type: String, default: '' },
    eventDate: { type: Date },
    location: { type: String, default: '' },
    coverMediaId: { type: Schema.Types.ObjectId, ref: 'Media' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AlbumSchema.index({ category: 1, order: 1 });
AlbumSchema.index({ featured: 1 });

export const Album = mongoose.model<IAlbum>('Album', AlbumSchema);
