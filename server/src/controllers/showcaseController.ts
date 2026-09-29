import { Request, Response } from 'express';
import { Showcase } from '../models/Showcase.js';
import { isDbConnected } from '../config/db.js';
import { deleteCloudinaryMedia, generateUploadSignature } from '../services/cloudinary.js';

// Memory store fallback
export const mockShowcase: any[] = [];

export const getShowcase = async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDbConnected) {
      const items = await Showcase.find().sort({ order: 1, createdAt: -1 });
      res.json({ success: true, data: items });
      return;
    }
    res.json({ success: true, data: mockShowcase });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUploadParams = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = generateUploadSignature(`skypixel/showcase`);
    res.json({ success: true, data: params });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addShowcaseImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, cloudinaryPublicId, order } = req.body;

    if (!cloudinaryPublicId.startsWith('skypixel/')) {
      res.status(400).json({ success: false, message: 'Invalid Cloudinary public ID' });
      return;
    }

    if (isDbConnected) {
      const item = await Showcase.create({ url, cloudinaryPublicId, order: order || 0 });
      res.status(201).json({ success: true, message: 'Added successfully', data: item });
      return;
    }

    const newItem = {
      _id: `showcase-${Date.now()}`,
      url,
      cloudinaryPublicId,
      order: order || mockShowcase.length + 1,
      createdAt: new Date().toISOString(),
    };
    mockShowcase.push(newItem);
    res.status(201).json({ success: true, message: 'Added successfully', data: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteShowcaseImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const item = await Showcase.findById(id);
      if (!item) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }
      await deleteCloudinaryMedia(item.cloudinaryPublicId, 'image');
      await Showcase.findByIdAndDelete(id);
      res.json({ success: true, message: 'Deleted successfully' });
      return;
    }

    const idx = mockShowcase.findIndex((m) => m._id === id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Not found' });
      return;
    }
    mockShowcase.splice(idx, 1);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
