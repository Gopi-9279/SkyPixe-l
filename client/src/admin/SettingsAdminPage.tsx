import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../api/settings.js';
import { Settings } from 'lucide-react';

export const SettingsAdminPage: React.FC = () => {
  const [heroUrl, setHeroUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings().then(data => {
      if (data && data.heroImageUrl) {
        setHeroUrl(data.heroImageUrl);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({ heroImageUrl: heroUrl });
      alert('Settings updated successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={28} color="var(--brand-gold)" />
          Site Settings
        </h1>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '24px' }}>Homepage Hero Section</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Cover Image URL (Hero Background)</label>
            <input 
              type="url"
              className="form-input"
              value={heroUrl}
              onChange={(e) => setHeroUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              This image covers the entire first section of the homepage. A high-resolution horizontal image is recommended.
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};