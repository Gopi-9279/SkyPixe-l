import api from './client.js';
import { Album } from '../types/index.js';

export const fetchAlbums = async (category?: string, featured?: boolean): Promise<Album[]> => {
  const params: any = {};
  if (category && category !== 'all') params.category = category;
  if (featured) params.featured = 'true';

  const res = await api.get('/albums', { params });
  return res.data.data;
};

export const fetchAlbumBySlug = async (slug: string): Promise<Album> => {
  const res = await api.get(`/albums/${slug}`);
  return res.data.data;
};

export const createAlbum = async (data: Partial<Album>): Promise<Album> => {
  const res = await api.post('/albums', data);
  return res.data.data;
};

export const updateAlbum = async (id: string, data: Partial<Album>): Promise<Album> => {
  const res = await api.put(`/albums/${id}`, data);
  return res.data.data;
};

export const deleteAlbum = async (id: string): Promise<void> => {
  await api.delete(`/albums/${id}`);
};
