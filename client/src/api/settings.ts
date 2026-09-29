import api from './client.js';

export const fetchSettings = async () => {
  const res = await api.get('/settings');
  return res.data.data;
};

export const updateSettings = async (data: { heroImageUrl: string }) => {
  const res = await api.put('/settings', data);
  return res.data.data;
};