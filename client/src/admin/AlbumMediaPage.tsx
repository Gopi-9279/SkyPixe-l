import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlbums } from '../api/albums.js';
import { addMedia, deleteMedia, setAlbumCover, getUploadParams } from '../api/media.js';
import { Album, MediaItem } from '../types/index.js';
import { ArrowLeft, Plus, Trash2, CheckCircle, Play, Film, Image as ImageIcon, X } from 'lucide-react';
import api from '../api/client.js';

export const AlbumMediaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add media form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadAlbumAndMedia = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Find album
      const all = await fetchAlbums('all');
      const found = all.find((a) => a._id === id);
      if (found) {
        setAlbum(found);
        // Fetch album detail with media
        const detailRes = await api.get(`/albums/${found.slug}`);
        setMediaList(detailRes.data.data.media || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbumAndMedia();
  }, [id]);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!mediaUrl && !selectedFile) {
      alert("Please provide a file or URL");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalUrl = mediaUrl;
      let finalPublicId = `skypixel/manual/${Date.now()}`;

      if (selectedFile) {
        setIsUploading(true);
        const params = await getUploadParams(id);
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('api_key', params.apiKey);
        formData.append('timestamp', params.timestamp.toString());
        formData.append('signature', params.signature);
        formData.append('folder', params.folder);
        
        const resourceType = mediaType === 'video' ? 'video' : 'image';
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${params.cloudName}/${resourceType}/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error?.message || 'Failed to upload file');
        }
        
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.secure_url;
        finalPublicId = uploadData.public_id;
      }

      let finalThumbnailUrl = thumbnailUrl;

      if (selectedThumbnailFile) {
        setIsUploading(true);
        const params = await getUploadParams(id);
        
        const formData = new FormData();
        formData.append('file', selectedThumbnailFile);
        formData.append('api_key', params.apiKey);
        formData.append('timestamp', params.timestamp.toString());
        formData.append('signature', params.signature);
        formData.append('folder', params.folder);
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error?.message || 'Failed to upload thumbnail');
        }
        
        const uploadData = await uploadRes.json();
        finalThumbnailUrl = uploadData.secure_url;
      }

      await addMedia({
        albumId: id,
        type: mediaType,
        cloudinaryPublicId: finalPublicId,
        url: finalUrl,
        thumbnailUrl: finalThumbnailUrl || (mediaType === 'image' ? finalUrl : undefined),
        order: mediaList.length + 1,
      });

      setShowAddModal(false);
      setMediaUrl('');
      setSelectedFile(null);
      setThumbnailUrl('');
      setSelectedThumbnailFile(null);
      loadAlbumAndMedia();
    } catch (err: any) {
      alert(err.message || err.response?.data?.message || 'Failed to add media');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (confirm('Are you sure you want to remove this media item?')) {
      try {
        await deleteMedia(mediaId);
        loadAlbumAndMedia();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete media');
      }
    }
  };

  const handleSetCover = async (mediaId: string) => {
    if (!id) return;
    try {
      await setAlbumCover(id, mediaId);
      alert('Cover image updated successfully!');
      loadAlbumAndMedia();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to set cover image');
    }
  };

  const applyPreset = (type: 'wedding-drone' | 'resort-interior' | 'sample-image') => {
    if (type === 'wedding-drone') {
      setMediaType('video');
      setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setThumbnailUrl('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop');
      setSelectedThumbnailFile(null);
    } else if (type === 'resort-interior') {
      setMediaType('video');
      setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
      setThumbnailUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop');
      setSelectedThumbnailFile(null);
    } else {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop');
      setThumbnailUrl('');
    }
  };

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/admin/albums"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={15} /> Back to Albums
        </Link>
      </div>

      {/* Album Header */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--brand-coral)',
              letterSpacing: '0.1em',
            }}
          >
            Managing Album Media
          </span>
          <h1 style={{ fontSize: '24px', margin: '4px 0' }}>{album?.title || 'Album Media'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Category: <strong style={{ textTransform: 'capitalize' }}>{album?.category}</strong> • {mediaList.length} Media Files Attached
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Photo or Video
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading album media assets...</div>
      ) : mediaList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <Film size={48} color="var(--brand-coral)" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No media attached to this album</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Upload photographs or video reels to populate this album for public visitors.
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Upload First Media Item
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {mediaList.map((item, index) => {
            const isCover = album?.coverUrl === item.url || (album?.coverMediaId as any)?._id === item._id;
            return (
              <div
                key={item._id}
                className="media-card"
                style={{
                  border: isCover ? '2px solid var(--brand-coral)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                }}
              >
                {/* Media Image / Thumbnail */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={`Media item ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div className="media-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {item.type === 'video' ? <Film size={12} /> : <ImageIcon size={12} />}
                    {item.type}
                  </div>

                  {isCover && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'var(--brand-coral)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Album Cover
                    </div>
                  )}

                  {item.type === 'video' && (
                    <div className="video-play-overlay">
                      <div className="play-button-icon" style={{ width: '42px', height: '42px' }}>
                        <Play size={18} color="#ffffff" fill="#ffffff" style={{ marginLeft: '2px' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions bottom bar */}
                <div
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    background: '#0a0d15',
                  }}
                >
                  <button
                    onClick={() => handleSetCover(item._id)}
                    disabled={isCover}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isCover ? 'var(--brand-coral)' : 'var(--text-secondary)',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: isCover ? 'default' : 'pointer',
                    }}
                  >
                    <CheckCircle size={15} />
                    {isCover ? 'Current Cover' : 'Set as Cover'}
                  </button>

                  <button
                    onClick={() => handleDeleteMedia(item._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    aria-label="Delete media item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="lightbox-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '22px', marginBottom: '18px' }}>Attach Media to Album</h2>

            {/* Quick Demo Presets */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Quick Demo Presets:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('wedding-drone')}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  + Wedding 4K Drone Reel
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('resort-interior')}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  + Resort FPV Drone Reel
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('sample-image')}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  + High-Res Editorial Photo
                </button>
              </div>
            </div>

            <form onSubmit={handleAddMedia}>
              <div className="form-group">
                <label className="form-label">Media Type</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                  className="form-select"
                >
                  <option value="image">Still Photography (Image)</option>
                  <option value="video">Cinematic Video Clip / Reel</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Upload {mediaType === 'video' ? 'Video' : 'Image'} File
                </label>
                <input
                  type="file"
                  accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setMediaUrl('');
                    }
                  }}
                  className="form-input"
                  style={{ padding: '8px' }}
                />
              </div>

              <div style={{ textAlign: 'center', margin: '10px 0', color: 'var(--text-secondary)' }}>OR</div>

              <div className="form-group">
                <label className="form-label">
                  {mediaType === 'video' ? 'Video Stream URL (MP4 / Cloudinary)' : 'Image URL'}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    if (e.target.value) setSelectedFile(null);
                  }}
                  className="form-input"
                />
              </div>

              {mediaType === 'video' && (
                <div style={{ marginTop: '20px', padding: '16px', border: '1px dashed var(--border-gold)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--brand-gold)' }}>Optional: Custom Video Thumbnail</h4>
                  
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Upload Thumbnail Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedThumbnailFile(e.target.files[0]);
                          setThumbnailUrl('');
                        }
                      }}
                      className="form-input"
                      style={{ padding: '8px' }}
                    />
                  </div>
                  
                  <div style={{ textAlign: 'center', margin: '8px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>OR</div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>Thumbnail Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={thumbnailUrl}
                      onChange={(e) => {
                        setThumbnailUrl(e.target.value);
                        if (e.target.value) setSelectedThumbnailFile(null);
                      }}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || isUploading} className="btn btn-primary">
                  {isUploading ? 'Uploading to Cloudinary...' : isSubmitting ? 'Saving...' : 'Save Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
