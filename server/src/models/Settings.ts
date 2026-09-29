import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  heroImageUrl: string;
}

const SettingsSchema = new Schema<ISettings>({
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop' },
});

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);