import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockStore.js';
import { sendInquiryNotification } from '../services/email.js';

export const submitInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, eventType, eventDate, venue, message } = req.body;

    if (isDbConnected) {
      const inquiry = await Inquiry.create({
        name,
        email,
        phone,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        venue,
        message,
        status: 'new',
      });

      // Send email in background
      sendInquiryNotification({ name, email, phone, eventType, eventDate, venue, message }).catch(console.error);

      res.status(201).json({
        success: true,
        message: 'Thank you! Your inquiry has been received. The Skypixel team will contact you shortly.',
        data: inquiry,
      });
      return;
    }

    // Memory Store
    const inquiry = {
      _id: `inq-${Date.now()}`,
      name,
      email,
      phone,
      eventType,
      eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
      venue: venue || '',
      message,
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };
    memoryStore.inquiries.unshift(inquiry);

    sendInquiryNotification({ name, email, phone, eventType, eventDate, venue, message }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been received. The Skypixel team will contact you shortly.',
      data: inquiry,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, eventType } = req.query;

    if (isDbConnected) {
      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (eventType && eventType !== 'all') query.eventType = eventType;

      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      const newCount = await Inquiry.countDocuments({ status: 'new' });

      res.json({ success: true, count: inquiries.length, newCount, data: inquiries });
      return;
    }

    // Memory Store
    let filtered = [...memoryStore.inquiries];
    if (status && status !== 'all') {
      filtered = filtered.filter((i) => i.status === status);
    }
    if (eventType && eventType !== 'all') {
      filtered = filtered.filter((i) => i.eventType === eventType);
    }

    const newCount = memoryStore.inquiries.filter((i) => i.status === 'new').length;
    res.json({ success: true, count: filtered.length, newCount, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'responded', 'archived'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    if (isDbConnected) {
      const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!inquiry) {
        res.status(404).json({ success: false, message: 'Inquiry not found' });
        return;
      }
      res.json({ success: true, message: 'Status updated', data: inquiry });
      return;
    }

    // Memory Store
    const item = memoryStore.inquiries.find((i) => i._id === id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Inquiry not found' });
      return;
    }
    item.status = status;
    res.json({ success: true, message: 'Status updated', data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
