import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  eventType: string;
  quote: string;
  rating?: number;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ order: 1 });

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
