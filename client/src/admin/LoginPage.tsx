import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Lock, Mail, ArrowRight, ShieldAlert, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@skypixel.com');
  const [password, setPassword] = useState('Skypixel2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07090e',
        padding: '24px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 36px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/logo-badge.png"
            alt="Skypixel Logo"
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              margin: '0 auto 16px auto',
              border: '2px solid rgba(238, 82, 61, 0.5)',
              boxShadow: '0 0 24px rgba(238, 82, 61, 0.3)',
            }}
          />
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
            SKY<span style={{ color: 'var(--brand-coral)' }}>PIXEL</span>
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Studio Admin Management Portal
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '16px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '14px', top: '16px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '12px', fontSize: '15px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
