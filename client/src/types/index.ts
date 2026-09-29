export type EventCategory = 'wedding' | 'hotel' | 'birthday' | 'corporate' | 'other';

export interface MediaItem {
  _id: string;
  albumId: string;
  type: 'image' | 'video';
  cloudinaryPublicId: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  createdAt: string;
}

export interface Album {
  _id: string;
  title: string;
  slug: string;
  category: EventCategory;
  description?: string;
  eventDate?: string;
  location?: string;
  coverMediaId?: MediaItem;
  coverUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  media?: MediaItem[];
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  eventType: string;
  quote: string;
  rating: number;
  order: number;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: EventCategory;
  eventDate?: string;
  venue?: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}
