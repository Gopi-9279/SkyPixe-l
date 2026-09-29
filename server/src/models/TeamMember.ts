import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    photoUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ order: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
