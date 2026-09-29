import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchInquiries, updateInquiryStatus } from '../api/inquiries.js';
import { Inquiry } from '../types/index.js';
import { Inbox, Mail, Phone, Calendar, MapPin, CheckCircle, Archive, Clock, X, MessageSquare } from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries(currentStatus);
      setInquiries(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [currentStatus]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const updated = await updateInquiryStatus(id, newStatus);
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(updated);
      }
      loadInquiries();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'new', label: 'New / Unread' },
    { id: 'responded', label: 'Responded' },
    { id: 'archived', label: 'Archived' },
  ];

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Client Inquiries Inbox</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Review prospective bookings submitted through your website contact forms.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'all') {
                  searchParams.delete('status');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ status: tab.id });
                }
              }}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: isActive ? '1px solid var(--brand-coral)' : '1px solid var(--border-subtle)',
                background: isActive ? 'rgba(238, 82, 61, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? 'var(--brand-coral)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Inquiries Table */}
      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading client inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <Inbox size={48} color="var(--brand-coral)" style={{ marginBottom: '14px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No inquiries found in this view</h3>
          <p style={{ color: 'var(--text-secondary)' }}>All caught up! New inquiries will appear here automatically.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '14px 18px' }}>Client</th>
                  <th style={{ padding: '14px' }}>Event</th>
                  <th style={{ padding: '14px' }}>Venue / Date</th>
                  <th style={{ padding: '14px' }}>Message Preview</th>
                  <th style={{ padding: '14px' }}>Status</th>
                  <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    onClick={() => setSelectedInquiry(inq)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      background: inq.status === 'new' ? 'rgba(238, 82, 61, 0.03)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{inq.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inq.email}</div>
                    </td>
                    <td style={{ padding: '14px', textTransform: 'capitalize' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {inq.eventType}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div>{inq.venue || 'Venue Not Set'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : 'Date TBD'}
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '13px',
                        }}
                      >
                        {inq.message}
                      </div>
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
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                        }}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal / Drawer */}
      {selectedInquiry && (
        <div className="lightbox-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedInquiry(null)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(238, 82, 61, 0.15)',
                  color: 'var(--brand-coral)',
                }}
              >
                {selectedInquiry.eventType}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Received {new Date(selectedInquiry.createdAt).toLocaleString()}
              </span>
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>{selectedInquiry.name}</h2>

            {/* Quick Contact Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--brand-coral)" />
                <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--text-primary)' }}>
                  {selectedInquiry.email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="var(--brand-coral)" />
                <a href={`tel:${selectedInquiry.phone}`} style={{ color: 'var(--text-primary)' }}>
                  {selectedInquiry.phone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={15} color="var(--brand-coral)" />
                <span>
                  {selectedInquiry.eventDate
                    ? new Date(selectedInquiry.eventDate).toLocaleDateString()
                    : 'Date Not Specified'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="var(--brand-coral)" />
                <span>{selectedInquiry.venue || 'Venue Not Specified'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Client Message / Vision:
              </div>
              <div
                style={{
                  background: 'rgba(7, 9, 14, 0.8)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedInquiry.status !== 'responded' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedInquiry._id, 'responded')}
                    className="btn btn-outline"
                    style={{ padding: '8px 14px', fontSize: '12px', borderColor: '#34d399', color: '#34d399' }}
                  >
                    <CheckCircle size={14} /> Mark Responded
                  </button>
                )}

                {selectedInquiry.status !== 'archived' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedInquiry._id, 'archived')}
                    className="btn btn-ghost"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    <Archive size={14} /> Archive
                  </button>
                )}

                {selectedInquiry.status !== 'new' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedInquiry._id, 'new')}
                    className="btn btn-ghost"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                  >
                    <Clock size={14} /> Mark as New
                  </button>
                )}
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Regarding your Skypixel inquiry for ${selectedInquiry.eventType.toUpperCase()}`}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                <Mail size={14} /> Reply Directly
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
