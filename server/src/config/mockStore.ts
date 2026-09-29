export interface MockMedia {
  _id: string;
  albumId: string;
  type: 'image' | 'video';
  cloudinaryPublicId: string;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  duration?: number;
  order: number;
  createdAt: string;
}

export interface MockAlbum {
  _id: string;
  title: string;
  slug: string;
  category: 'wedding' | 'hotel' | 'birthday' | 'corporate' | 'other';
  description: string;
  eventDate: string;
  location: string;
  coverMediaId?: string;
  coverUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  media?: MockMedia[];
}

export interface MockTeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order: number;
}

export interface MockTestimonial {
  _id: string;
  clientName: string;
  eventType: string;
  quote: string;
  rating: number;
  order: number;
}

export interface MockInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: 'wedding' | 'hotel' | 'birthday' | 'corporate' | 'other';
  eventDate?: string;
  venue?: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  createdAt: string;
}

export const initialAlbums: MockAlbum[] = [];

export const initialMedia: MockMedia[] = [];

export const initialTeamMembers: MockTeamMember[] = [];

export const initialTestimonials: MockTestimonial[] = [];

export const initialInquiries: MockInquiry[] = [];

// Memory store state that lives for the server session when MongoDB is in memory mode
export const memoryStore = {
  albums: [...initialAlbums],
  media: [...initialMedia],
  team: [...initialTeamMembers],
  testimonials: [...initialTestimonials],
  inquiries: [...initialInquiries],
  settings: { heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop' } as { heroImageUrl?: string },
};
