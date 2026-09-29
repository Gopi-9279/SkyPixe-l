import mongoose, { Document, Schema, Types } from 'mongoose';

export type MediaType = 'image' | 'video';

export interface IMedia extends Document {
  albumId: Types.ObjectId;
  type: MediaType;
  cloudinaryPublicId: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true, index: true },
    type: { type: String, required: true, enum: ['image', 'video'], default: 'image' },
    cloudinaryPublicId: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    width: { type: Number },
    height: { type: Number },
    duration: { type: Number },
    order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MediaSchema.index({ albumId: 1, order: 1 });

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
