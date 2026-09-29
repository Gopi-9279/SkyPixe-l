import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
