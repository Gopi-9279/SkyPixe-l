import api from './client.js';

export interface InstaPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export const fetchInstagramFeed = async (limit = 12): Promise<InstaPost[]> => {
  try {
    const { data } = await api.get(`/instagram/feed?limit=${limit}`);
    return data.data || [];
  } catch {
    return [];
  }
};
