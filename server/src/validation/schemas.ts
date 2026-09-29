import { z } from 'zod';

export const CategoryEnum = z.enum(['wedding', 'hotel', 'birthday', 'corporate', 'other']);

export const InquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters').trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(20, 'Phone number is too long').trim(),
  eventType: CategoryEnum,
  eventDate: z.string().optional().or(z.date().optional()),
  venue: z.string().max(100, 'Venue cannot exceed 100 characters').optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message cannot exceed 1000 characters').trim(),
});

export const LoginSchema = z.object({
  email: z.string().email('Please provide a valid email').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const CreateAlbumSchema = z.object({
  title: z.string().min(2, 'Title is required').trim(),
  category: CategoryEnum,
  description: z.string().optional().default(''),
  eventDate: z.string().optional(),
  location: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

export const UpdateAlbumSchema = CreateAlbumSchema.partial();

export const CreateMediaSchema = z.object({
  albumId: z.string().min(1, 'Album ID is required'),
  type: z.enum(['image', 'video']),
  cloudinaryPublicId: z.string().regex(/^skypixel\/[a-zA-Z0-9_/-]+$/, 'Invalid Cloudinary public ID'),
  url: z.string().url('Valid media URL is required').refine((value) => value.startsWith('https://'), 'Media URL must use HTTPS'),
  thumbnailUrl: z.string().url().refine((value) => value.startsWith('https://'), 'Thumbnail URL must use HTTPS').optional(),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  duration: z.number().positive().max(86400).optional(),
  order: z.number().int().nonnegative().max(100000).optional().default(0),
});

export const CreateTeamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required').trim(),
  role: z.string().min(2, 'Role is required').trim(),
  bio: z.string().max(500).optional().default(''),
  photoUrl: z.string().url('Photo URL is required'),
  order: z.number().optional().default(0),
});

export const CreateTestimonialSchema = z.object({
  clientName: z.string().min(2, 'Client name is required').trim(),
  eventType: z.string().min(2, 'Event type is required').trim(),
  quote: z.string().min(10, 'Quote must be at least 10 characters').trim(),
  rating: z.number().min(1).max(5).optional().default(5),
  order: z.number().optional().default(0),
});
