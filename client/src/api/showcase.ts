import api from './client.js';

export interface ShowcaseItem {
  _id: string;
  url: string;
  cloudinaryPublicId: string;
  order: number;
  createdAt: string;
}

export const fetchShowcase = async (): Promise<ShowcaseItem[]> => {
  const { data } = await api.get('/showcase');
  return data.data;
};

export const getShowcaseUploadParams = async () => {
  const { data } = await api.get('/showcase/upload-params');
  return data.data;
};

export const addShowcaseImage = async (payload: Partial<ShowcaseItem>): Promise<ShowcaseItem> => {
  const { data } = await api.post('/showcase', payload);
  return data.data;
};

export const deleteShowcaseImage = async (id: string): Promise<void> => {
  await api.delete(`/showcase/${id}`);
};
