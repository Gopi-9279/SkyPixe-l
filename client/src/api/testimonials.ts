import api from './client.js';
import { Testimonial } from '../types/index.js';

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get('/testimonials');
  return res.data.data;
};
