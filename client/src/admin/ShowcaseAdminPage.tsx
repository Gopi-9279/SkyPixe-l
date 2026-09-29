import React, { useEffect, useState } from 'react';
import { fetchShowcase, addShowcaseImage, deleteShowcaseImage, getShowcaseUploadParams, ShowcaseItem } from '../api/showcase.js';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

export const ShowcaseAdminPage: React.FC = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchShowcase();
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl && !selectedFile) {
      alert('Please provide a file or URL');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalUrl = mediaUrl;
      let finalPublicId = `skypixel/showcase/${Date.now()}`;

      if (selectedFile) {
        const params = await getShowcaseUploadParams();
        const formData = new FormData();
        formData.append('file', selectedFile);
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
            throw new Error(err.error?.message || 'Failed to upload file');
        }
        
        const uploadData = await uploadRes.json();
        finalUrl = uploadData.secure_url;
        finalPublicId = uploadData.public_id;
      }

      await addShowcaseImage({
        url: finalUrl,
        cloudinaryPublicId: finalPublicId,
        order: items.length + 1
      });

      setShowAddModal(false);
      setMediaUrl('');
      setSelectedFile(null);
      loadItems();
    } catch (err: any) {
      alert(err.message || 'Failed to add image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this showcase image?')) {
      try {
        await deleteShowcaseImage(id);
        loadItems();
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Showcase Grid</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Manage the image grid that appears at the bottom of the home page.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading showcase images...</div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '8px' }}>
          <ImageIcon size={48} color="var(--brand-coral)" style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '18px' }}>No showcase images yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Upload some high quality photos to showcase on the home page.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {items.map((item) => (
            <div key={item._id} className="media-card" style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '200px' }}>
                <img src={item.url} alt="Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '12px', background: '#0a0d15', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="lightbox-backdrop" onClick={() => !isSubmitting && setShowAddModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '8px', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>Add Showcase Image</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Upload File</label>
                <input
                  type="file"
                  accept="image/*"
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
                <label className="form-label">Image URL</label>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost" disabled={isSubmitting}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Uploading...' : 'Save Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
