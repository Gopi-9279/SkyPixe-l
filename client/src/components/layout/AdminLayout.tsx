import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  LayoutDashboard,
  Images,
  Inbox,
  Users,
  MessageSquareQuote,
  ExternalLink,
  LogOut,
  Settings,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--brand-coral)', fontSize: '18px' }}>Loading Skypixel Studio Manager...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Albums & Media', path: '/admin/albums', icon: <Images size={18} /> },
    { name: 'Showcase Grid', path: '/admin/showcase', icon: <Images size={18} /> },
    { name: 'Inquiries Inbox', path: '/admin/inquiries', icon: <Inbox size={18} /> },
    { name: 'Team Profiles', path: '/admin/team', icon: <Users size={18} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquareQuote size={18} /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#07090e' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0a0d15',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo-badge.png"
              alt="Skypixel Logo"
              style={{ width: '38px', height: '38px', borderRadius: '50%' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.04em' }}>
                SKY<span style={{ color: 'var(--brand-coral)' }}>PIXEL</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                ADMIN DASHBOARD
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: isActive ? 'rgba(238, 82, 61, 0.12)' : 'transparent',
                  color: isActive ? 'var(--brand-coral)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(238, 82, 61, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              padding: '8px 12px',
              borderRadius: '6px',
              marginBottom: '8px',
            }}
          >
            <ExternalLink size={15} /> Public Site
          </Link>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#f87171',
              padding: '10px 12px',
              background: 'rgba(248, 113, 113, 0.08)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} /> Sign Out ({user?.email?.split('@')[0]})
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#0a0d15',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Studio Control Center — Skypixel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              System Online
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{user?.email}</span>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
