import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAlbums, createAlbum, updateAlbum, deleteAlbum } from '../api/albums.js';
import { Album, EventCategory } from '../types/index.js';
import { Plus, Images, Edit2, Trash2, Star, Check, X, Film } from 'lucide-react';

export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'wedding' as EventCategory,
    description: '',
    eventDate: '',
    location: '',
    featured: false,
    order: 0,
  });

  const loadAlbums = async () => {
    setLoading(true);
    try {
      const data = await fetchAlbums('all');
      setAlbums(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const openCreateModal = () => {
    setEditingAlbum(null);
    setFormData({
      title: '',
      category: 'wedding',
      description: '',
      eventDate: '',
      location: '',
      featured: false,
      order: albums.length + 1,
    });
    setShowCreateModal(true);
  };

  const openEditModal = (alb: Album) => {
    setEditingAlbum(alb);
    setFormData({
      title: alb.title,
      category: alb.category,
      description: alb.description || '',
      eventDate: alb.eventDate ? alb.eventDate.split('T')[0] : '',
      location: alb.location || '',
      featured: alb.featured,
      order: alb.order || 0,
    });
    setShowCreateModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAlbum) {
        await updateAlbum(editingAlbum._id, formData);
      } else {
        await createAlbum(formData);
      }
      setShowCreateModal(false);
      loadAlbums();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save album');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete album "${title}" and all its media files?`)) {
      try {
        await deleteAlbum(id);
        loadAlbums();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete album');
      }
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Albums & Work Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Create albums, curate cover shots, and upload high-res photos and video reels.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={16} /> Create New Album
        </button>
      </div>

      {/* Albums Table */}
      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading albums...</div>
      ) : albums.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>No albums created yet.</p>
          <button onClick={openCreateModal} className="btn btn-primary">
            Create Your First Album
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '14px 18px' }}>Cover & Title</th>
                  <th style={{ padding: '14px' }}>Category</th>
                  <th style={{ padding: '14px' }}>Location</th>
                  <th style={{ padding: '14px' }}>Featured</th>
                  <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {albums.map((alb) => (
                  <tr key={alb._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={alb.coverUrl || alb.coverMediaId?.thumbnailUrl || alb.coverMediaId?.url || '/logo-badge.png'}
                          alt={alb.title}
                          style={{ width: '54px', height: '54px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>{alb.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>slug: /{alb.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px', textTransform: 'capitalize' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(238, 82, 61, 0.12)',
                          color: 'var(--brand-coral)',
                          border: '1px solid rgba(238, 82, 61, 0.3)',
                        }}
                      >
                        {alb.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{alb.location || '—'}</td>
                    <td style={{ padding: '14px' }}>
                      {alb.featured ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>
                          <Star size={14} fill="#f59e0b" /> Home Page
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Normal</span>
                      )}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link
                          to={`/admin/albums/${alb._id}/media`}
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                        >
                          <Images size={14} /> Manage Media
                        </Link>
                        <button
                          onClick={() => openEditModal(alb)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          aria-label="Edit Album"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(alb._id, alb.title)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#f87171',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          aria-label="Delete Album"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create / Edit Album */}
      {showCreateModal && (
        <div className="lightbox-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowCreateModal(false)}
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

            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {editingAlbum ? 'Edit Album' : 'Create New Album'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding in Udaipur"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                    className="form-select"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="hotel">Hotels & Resorts</option>
                    <option value="birthday">Birthday Celebration</option>
                    <option value="corporate">Corporate Summit</option>
                    <option value="other">Aerial / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Goa, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Shoot Description / Story</label>
                <textarea
                  rows={3}
                  placeholder="Describe the occasion, cinematography notes, venue highlights..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--brand-coral)', cursor: 'pointer' }}
                />
                <label htmlFor="featured-toggle" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  Feature this album prominently on the Home Page
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAlbum ? 'Update Album' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
