import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockStore.js';

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDbConnected) {
      const testimonials = await Testimonial.find().sort({ order: 1 });
      res.json({ success: true, count: testimonials.length, data: testimonials });
      return;
    }
    res.json({ success: true, count: memoryStore.testimonials.length, data: memoryStore.testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientName, eventType, quote, rating, order } = req.body;

    if (isDbConnected) {
      const testimonial = await Testimonial.create({
        clientName,
        eventType,
        quote,
        rating: rating || 5,
        order: order || 0,
      });
      res.status(201).json({ success: true, message: 'Testimonial added', data: testimonial });
      return;
    }

    const newTestimonial = {
      _id: `tst-${Date.now()}`,
      clientName,
      eventType,
      quote,
      rating: rating || 5,
      order: order || memoryStore.testimonials.length + 1,
    };
    memoryStore.testimonials.push(newTestimonial);
    res.status(201).json({ success: true, message: 'Testimonial added', data: newTestimonial });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Testimonial not found' });
        return;
      }
      res.json({ success: true, message: 'Testimonial updated', data: updated });
      return;
    }

    const index = memoryStore.testimonials.findIndex((t) => t._id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    memoryStore.testimonials[index] = { ...memoryStore.testimonials[index], ...req.body };
    res.json({ success: true, message: 'Testimonial updated', data: memoryStore.testimonials[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      await Testimonial.findByIdAndDelete(id);
      res.json({ success: true, message: 'Testimonial deleted' });
      return;
    }

    memoryStore.testimonials = memoryStore.testimonials.filter((t) => t._id !== id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
