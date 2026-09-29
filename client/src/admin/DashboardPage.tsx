import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../api/auth.js';
import {
  Images,
  Inbox,
  Film,
  AlertCircle,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--brand-coral)' }}>Loading dashboard analytics...</div>;
  }

  const statCards = [
    {
      title: 'Published Albums',
      value: stats?.albumCount ?? 0,
      icon: <Images size={24} color="var(--brand-coral)" />,
      link: '/admin/albums',
      linkLabel: 'Manage Albums',
    },
    {
      title: 'Total Photos & Reels',
      value: stats?.mediaCount ?? 0,
      icon: <Film size={24} color="#60a5fa" />,
      link: '/admin/albums',
      linkLabel: 'View Media Assets',
    },
    {
      title: 'Client Inquiries',
      value: stats?.inquiryCount ?? 0,
      icon: <Inbox size={24} color="#34d399" />,
      link: '/admin/inquiries',
      linkLabel: 'View All Inquiries',
    },
    {
      title: 'New Pending Leads',
      value: stats?.newInquiryCount ?? 0,
      icon: <AlertCircle size={24} color="#f59e0b" />,
      link: '/admin/inquiries?status=new',
      linkLabel: 'Review New Leads',
      highlight: stats?.newInquiryCount > 0,
    },
  ];

  return (
    <div>
      {/* Top Banner */}
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
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Studio Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Welcome back to Skypixel Studio Management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/albums" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
            <Plus size={16} /> Add New Album
          </Link>
          <Link to="/" target="_blank" className="btn btn-outline" style={{ padding: '10px 18px', fontSize: '13px' }}>
            <Eye size={16} /> View Live Site
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: card.highlight ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{card.title}</span>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>
              {card.value}
            </div>

            <Link
              to={card.link}
              style={{
                fontSize: '12px',
                color: 'var(--brand-coral)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              {card.linkLabel} <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Inquiries Section */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>Recent Inquiries</h2>
          <Link to="/admin/inquiries" style={{ fontSize: '13px', color: 'var(--brand-coral)', fontWeight: 600 }}>
            View All Inquiries →
          </Link>
        </div>

        {(!stats?.recentInquiries || stats.recentInquiries.length === 0) ? (
          <div style={{ color: 'var(--text-secondary)', padding: '20px 0', textAlign: 'center' }}>
            No inquiries recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 14px' }}>Client</th>
                  <th style={{ padding: '12px 14px' }}>Event Category</th>
                  <th style={{ padding: '12px 14px' }}>Venue</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInquiries.map((inq: any) => (
                  <tr key={inq._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#ffffff' }}>
                      {inq.name}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>{inq.email}</div>
                    </td>
                    <td style={{ padding: '14px', textTransform: 'capitalize' }}>{inq.eventType}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{inq.venue || '—'}</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background:
                            inq.status === 'new'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : inq.status === 'responded'
                              ? 'rgba(52, 211, 153, 0.15)'
                              : 'rgba(148, 163, 184, 0.15)',
                          color:
                            inq.status === 'new'
                              ? '#f59e0b'
                              : inq.status === 'responded'
                              ? '#34d399'
                              : '#94a3b8',
                        }}
                      >
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
