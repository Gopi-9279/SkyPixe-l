import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import { Album } from '../models/Album.js';
import { Media } from '../models/Media.js';
import { Inquiry } from '../models/Inquiry.js';
import { memoryStore } from '../config/mockStore.js';

const router = Router();

router.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isDbConnected) {
      const [albumCount, mediaCount, inquiryCount, newInquiryCount, recentInquiries] = await Promise.all([
        Album.countDocuments(),
        Media.countDocuments(),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: 'new' }),
        Inquiry.find().sort({ createdAt: -1 }).limit(5),
      ]);

      res.json({
        success: true,
        data: {
          albumCount,
          mediaCount,
          inquiryCount,
          newInquiryCount,
          recentInquiries,
        },
      });
      return;
    }

    // Memory Store
    res.json({
      success: true,
      data: {
        albumCount: memoryStore.albums.length,
        mediaCount: memoryStore.media.length,
        inquiryCount: memoryStore.inquiries.length,
        newInquiryCount: memoryStore.inquiries.filter((i) => i.status === 'new').length,
        recentInquiries: memoryStore.inquiries.slice(0, 5),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
