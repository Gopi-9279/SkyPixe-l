import mongoose, { Document, Schema } from 'mongoose';

export type InquiryStatus = 'new' | 'responded' | 'archived';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  eventType: 'wedding' | 'hotel' | 'birthday' | 'corporate' | 'other';
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
      enum: ['wedding', 'hotel', 'birthday', 'corporate', 'other'],
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
