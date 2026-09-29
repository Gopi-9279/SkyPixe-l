import { Request, Response } from 'express';
import { Album } from '../models/Album.js';
import { Media } from '../models/Media.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockStore.js';
import { deleteCloudinaryMedia } from '../services/cloudinary.js';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;

    if (isDbConnected) {
      const query: any = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (featured === 'true') {
        query.featured = true;
      }

      const albums = await Album.find(query)
        .populate('coverMediaId')
        .sort({ order: 1, createdAt: -1 });

      res.json({ success: true, count: albums.length, data: albums });
      return;
    }

    // Memory Store
    let filtered = [...memoryStore.albums];
    if (category && category !== 'all') {
      filtered = filtered.filter((a) => a.category === category);
    }
    if (featured === 'true') {
      filtered = filtered.filter((a) => a.featured);
    }
    filtered.sort((a, b) => a.order - b.order);

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlbumBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (isDbConnected) {
      const album = await Album.findOne({ slug });
      if (!album) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      const media = await Media.find({ albumId: album._id }).sort({ order: 1, createdAt: 1 });
      res.json({ success: true, data: { ...album.toObject(), media } });
      return;
    }

    // Memory Store
    const album = memoryStore.albums.find((a) => a.slug === slug || a._id === slug);
    if (!album) {
      res.status(404).json({ success: false, message: 'Album not found' });
      return;
    }

    const media = memoryStore.media.filter((m) => m.albumId === album._id).sort((a, b) => a.order - b.order);
    res.json({ success: true, data: { ...album, media } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, description, eventDate, location, featured, order } = req.body;
    let slug = generateSlug(title);

    if (isDbConnected) {
      // Ensure unique slug
      let existing = await Album.findOne({ slug });
      let counter = 1;
      while (existing) {
        slug = `${generateSlug(title)}-${counter}`;
        existing = await Album.findOne({ slug });
        counter++;
      }

      const newAlbum = await Album.create({
        title,
        slug,
        category,
        description,
        eventDate,
        location,
        featured: !!featured,
        order: order || 0,
      });

      res.status(201).json({ success: true, message: 'Album created successfully', data: newAlbum });
      return;
    }

    // Memory Store
    const newAlbum = {
      _id: `alb-${Date.now()}`,
      title,
      slug,
      category,
      description: description || '',
      eventDate: eventDate || new Date().toISOString(),
      location: location || '',
      featured: !!featured,
      order: order || memoryStore.albums.length + 1,
      createdAt: new Date().toISOString(),
      coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    };
    memoryStore.albums.unshift(newAlbum);

    res.status(201).json({ success: true, message: 'Album created successfully', data: newAlbum });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const updated = await Album.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }
      res.json({ success: true, message: 'Album updated successfully', data: updated });
      return;
    }

    // Memory Store
    const index = memoryStore.albums.findIndex((a) => a._id === id || a.slug === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Album not found' });
      return;
    }
    memoryStore.albums[index] = { ...memoryStore.albums[index], ...req.body };
    res.json({ success: true, message: 'Album updated successfully', data: memoryStore.albums[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const album = await Album.findById(id);
      if (!album) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      // Find and delete media
      const mediaList = await Media.find({ albumId: id });
      for (const m of mediaList) {
        try {
          await deleteCloudinaryMedia(m.cloudinaryPublicId, m.type);
        } catch (e) {
          console.error(`Failed to delete Cloudinary media: ${m.cloudinaryPublicId}`);
        }
      }
      await Media.deleteMany({ albumId: id });
      await Album.findByIdAndDelete(id);

      res.json({ success: true, message: 'Album and all associated media deleted' });
      return;
    }

    // Memory Store
    memoryStore.albums = memoryStore.albums.filter((a) => a._id !== id);
    memoryStore.media = memoryStore.media.filter((m) => m.albumId !== id);
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
