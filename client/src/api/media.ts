import api from './client.js';
import { MediaItem } from '../types/index.js';

export const getUploadParams = async (albumId: string) => {
  const res = await api.get('/media/upload-params', { params: { albumId } });
  return res.data.data;
};

export const addMedia = async (data: Partial<MediaItem>): Promise<MediaItem> => {
  const res = await api.post('/media', data);
  return res.data.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  await api.delete(`/media/${id}`);
};

export const setAlbumCover = async (albumId: string, mediaId: string): Promise<void> => {
  await api.post('/media/set-cover', { albumId, mediaId });
};
