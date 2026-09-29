import api from './client.js';
import { Inquiry } from '../types/index.js';

export const submitInquiry = async (data: any) => {
  const res = await api.post('/inquiries', data);
  return res.data;
};

export const fetchInquiries = async (status?: string, eventType?: string) => {
  const params: any = {};
  if (status && status !== 'all') params.status = status;
  if (eventType && eventType !== 'all') params.eventType = eventType;

  const res = await api.get('/inquiries', { params });
  return res.data;
};

export const updateInquiryStatus = async (id: string, status: string): Promise<Inquiry> => {
  const res = await api.patch(`/inquiries/${id}/status`, { status });
  return res.data.data;
};
