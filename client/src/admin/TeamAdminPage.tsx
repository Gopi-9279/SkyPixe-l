import React, { useEffect, useState } from 'react';
import { fetchTeam, createTeamMember, deleteTeamMember } from '../api/team.js';
import { TeamMember } from '../types/index.js';
import { Plus, Trash2, X } from 'lucide-react';

export const TeamAdminPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    order: 0,
  });

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await fetchTeam();
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTeamMember(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        role: '',
        bio: '',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        order: team.length + 1,
      });
      loadTeam();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add team member');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team roster?`)) {
      try {
        await deleteTeamMember(id);
        loadTeam();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete member');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Creative Team Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage the photographers, drone pilots, and editors showcased on the public website.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading team roster...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {team.map((member) => (
            <div
              key={member._id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--brand-coral)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {member.role}
                </div>
                <h3 style={{ fontSize: '18px', color: '#ffffff', margin: '4px 0 8px 0' }}>{member.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                  {member.bio}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="lightbox-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '480px', padding: '32px', borderRadius: 'var(--radius-lg)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px' }}>Add Team Member</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Aerial Cinematographer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Photo URL *</label>
                <input
                  type="url"
                  required
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
