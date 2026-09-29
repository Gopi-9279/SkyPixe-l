import api from './client.js';

export const loginAdmin = async (credentials: { email: string; password: string }) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const fetchCurrentAdmin = async () => {
  const res = await api.get('/auth/me');
  return res.data.user;
};

export const logoutAdmin = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const fetchDashboardStats = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data.data;
};
