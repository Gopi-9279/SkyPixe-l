import { Request, Response } from 'express';
import { Media } from '../models/Media.js';
import { Album } from '../models/Album.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockStore.js';
import { generateUploadSignature, deleteCloudinaryMedia } from '../services/cloudinary.js';

export const getUploadParams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId } = req.query;
    if (!albumId || typeof albumId !== 'string') {
      res.status(400).json({ success: false, message: 'Album ID is required' });
      return;
    }

    const album = isDbConnected
      ? await Album.findById(albumId).select('_id')
      : memoryStore.albums.find((item) => item._id === albumId);

    if (!album) {
      res.status(404).json({ success: false, message: 'Album not found' });
      return;
    }

    const params = generateUploadSignature(`skypixel/albums/${albumId}`);
    res.json({ success: true, data: params });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId, type, cloudinaryPublicId, url, thumbnailUrl, width, height, duration, order } = req.body;

    if (!cloudinaryPublicId.startsWith('skypixel/')) {
      res.status(400).json({ success: false, message: 'Invalid Cloudinary public ID' });
      return;
    }

    if (isDbConnected) {
      const album = await Album.findById(albumId);
      if (!album) {
        res.status(404).json({ success: false, message: 'Album not found' });
        return;
      }

      const media = await Media.create({
        albumId,
        type,
        cloudinaryPublicId,
        url,
        thumbnailUrl: thumbnailUrl || (type === 'image' ? url : undefined),
        width,
        height,
        duration,
        order: order || 0,
      });

      // If album has no cover media, set this one
      if (!album.coverMediaId) {
        album.coverMediaId = media._id;
        await album.save();
      }

      res.status(201).json({ success: true, message: 'Media added successfully', data: media });
      return;
    }

    // Memory Store
    const album = memoryStore.albums.find((a) => a._id === albumId);
    if (!album) {
      res.status(404).json({ success: false, message: 'Album not found' });
      return;
    }

    const newMedia = {
      _id: `med-${Date.now()}`,
      albumId,
      type,
      cloudinaryPublicId: cloudinaryPublicId || `skypixel/${Date.now()}`,
      url,
      thumbnailUrl: thumbnailUrl || url,
      width: width || 1600,
      height: height || 1067,
      duration,
      order: order || memoryStore.media.length + 1,
      createdAt: new Date().toISOString(),
    };

    memoryStore.media.push(newMedia);

    if (!album.coverUrl) {
      album.coverUrl = newMedia.url;
    }

    res.status(201).json({ success: true, message: 'Media added successfully', data: newMedia });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const media = await Media.findById(id);
      if (!media) {
        res.status(404).json({ success: false, message: 'Media not found' });
        return;
      }

      await deleteCloudinaryMedia(media.cloudinaryPublicId, media.type);
      await Media.findByIdAndDelete(id);

      res.json({ success: true, message: 'Media deleted successfully' });
      return;
    }

    // Memory Store
    const item = memoryStore.media.find((m) => m._id === id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Media not found' });
      return;
    }
    memoryStore.media = memoryStore.media.filter((m) => m._id !== id);
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setAlbumCover = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId, mediaId } = req.body;

    if (isDbConnected) {
      const album = await Album.findById(albumId);
      const media = await Media.findById(mediaId);
      if (!album || !media || media.albumId.toString() !== album._id.toString()) {
        res.status(404).json({ success: false, message: 'Album or Media not found' });
        return;
      }
      album.coverMediaId = media._id;
      await album.save();
      res.json({ success: true, message: 'Album cover updated' });
      return;
    }

    // Memory Store
    const album = memoryStore.albums.find((a) => a._id === albumId);
    const media = memoryStore.media.find((m) => m._id === mediaId);
    if (!album || !media || media.albumId !== album._id) {
      res.status(404).json({ success: false, message: 'Album or Media not found' });
      return;
    }
    album.coverUrl = media.url;
    res.json({ success: true, message: 'Album cover updated', data: album });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
