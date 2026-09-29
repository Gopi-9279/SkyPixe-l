import { Request, Response } from 'express';
import { ENV } from '../config/env.js';

/**
 * Instagram Feed Proxy Controller
 *
 * Fetches recent media from the Instagram Graph API using a long-lived
 * access token, caches the result in-memory for 15 minutes to avoid
 * rate-limit issues, and returns the posts to the client.
 *
 * If no token is configured the endpoint returns an empty array so
 * the frontend can fall back to curated placeholder images.
 */

interface InstaPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface CachedFeed {
  data: InstaPost[];
  fetchedAt: number;
}

// In-memory cache — survives across requests, cleared on server restart
let feedCache: CachedFeed | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const getInstagramFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = ENV.INSTAGRAM_ACCESS_TOKEN;

    // If no token is configured, return empty so frontend uses fallback
    if (!token) {
      res.json({ success: true, count: 0, data: [], source: 'no_token' });
      return;
    }

    // Return cached data if still fresh
    if (feedCache && Date.now() - feedCache.fetchedAt < CACHE_TTL_MS) {
      res.json({ success: true, count: feedCache.data.length, data: feedCache.data, source: 'cache' });
      return;
    }

    const limit = Math.min(Number(req.query.limit) || 12, 25);
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Instagram] API error:', response.status, errorBody);

      // Serve stale cache if available
      if (feedCache) {
        res.json({ success: true, count: feedCache.data.length, data: feedCache.data, source: 'stale_cache' });
        return;
      }

      res.json({ success: true, count: 0, data: [], source: 'api_error' });
      return;
    }

    const json = await response.json() as { data: InstaPost[] };
    const posts: InstaPost[] = (json.data || []).map((post) => ({
      id: post.id,
      caption: post.caption,
      media_type: post.media_type,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
    }));

    // Update cache
    feedCache = { data: posts, fetchedAt: Date.now() };

    res.json({ success: true, count: posts.length, data: posts, source: 'live' });
  } catch (error: any) {
    console.error('[Instagram] Fetch error:', error.message);

    // Serve stale cache on network errors
    if (feedCache) {
      res.json({ success: true, count: feedCache.data.length, data: feedCache.data, source: 'stale_cache' });
      return;
    }

    res.json({ success: true, count: 0, data: [], source: 'error' });
  }
};
