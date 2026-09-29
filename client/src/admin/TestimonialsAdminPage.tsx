import React, { useEffect, useState } from 'react';
import { fetchTestimonials } from '../api/testimonials.js';
import { Testimonial } from '../types/index.js';
import { Star, MessageSquareQuote } from 'lucide-react';
import api from '../api/client.js';

export const TestimonialsAdminPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Client Testimonials</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Curated reviews and star ratings featured on your home and testimonials page.
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--brand-coral)' }}>Loading reviews...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', color: '#f59e0b' }}>
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '16px' }}>
                  "{t.quote}"
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{t.clientName}</div>
                <div style={{ fontSize: '12px', color: 'var(--brand-coral)' }}>{t.eventType}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
