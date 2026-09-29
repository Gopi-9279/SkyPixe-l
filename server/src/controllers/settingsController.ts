import { Request, Response } from 'express';
import { Settings } from '../models/Settings.js';
import { memoryStore } from '../config/mockStore.js';
import { isDbConnected } from '../config/db.js';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbConnected) {
      res.json({ success: true, data: { heroImageUrl: memoryStore.settings?.heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop' } });
      return;
    }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { heroImageUrl } = req.body;
    if (!isDbConnected) {
      if (!memoryStore.settings) memoryStore.settings = {};
      if (heroImageUrl) memoryStore.settings.heroImageUrl = heroImageUrl;
      res.json({ success: true, data: memoryStore.settings });
      return;
    }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ heroImageUrl });
    } else {
      if (heroImageUrl) settings.heroImageUrl = heroImageUrl;
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};