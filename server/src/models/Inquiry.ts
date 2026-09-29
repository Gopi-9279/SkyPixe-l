import mongoose, { Document, Schema } from 'mongoose';

export type InquiryStatus = 'new' | 'responded' | 'archived';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  eventType:
    | 'engagement'
    | 'prewedding'
    | 'wedding'
    | 'postwedding'
    | 'anniversery'
    | 'birthday'
    | 'maternity_baby_shoot'
    | 'brand_promotion'
    | 'conference_shoot'
    | 'model_portfolio'
    | 'music_video_shoot'
    | 'event_drone_coverage';
  eventDate?: Date;
  venue?: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        'engagement',
        'prewedding',
        'wedding',
        'postwedding',
        'anniversery',
        'birthday',
        'maternity_baby_shoot',
        'brand_promotion',
        'conference_shoot',
        'model_portfolio',
        'music_video_shoot',
        'event_drone_coverage',
      ],
    },
    eventDate: { type: Date },
    venue: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'responded', 'archived'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

InquirySchema.index({ createdAt: -1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
