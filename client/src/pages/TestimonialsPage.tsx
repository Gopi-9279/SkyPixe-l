import React, { useEffect, useState } from 'react';
import { fetchTestimonials } from '../api/testimonials.js';
import { Testimonial } from '../types/index.js';
import { Star, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TextReveal } from '../components/common/TextReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';

export const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: '130px', minHeight: '100vh', paddingBottom: '90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            Client Reviews
          </span>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <TextReveal
              text="Stories of Trust & Delight"
              as="h1"
              style={{
                fontSize: 'clamp(36px, 5vw, 54px)',
                justifyContent: 'center',
              }}
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Hear directly from couples, resort owners, and event producers who entrusted their most critical moments to Skypixel.
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--brand-gold)', padding: '60px 0' }}>
            Loading client stories...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '30px',
              marginBottom: '70px',
            }}
          >
            {testimonials.map((t, idx) => (
              <ImageMaskReveal key={t._id} delay={idx * 0.08}>
                <div
                  className="glass-panel"
                  style={{
                    padding: '38px 34px',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-subtle)',
                    height: '100%',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: 'var(--brand-gold)' }}>
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} size={17} fill="var(--brand-gold)" />
                      ))}
                    </div>
                    <MessageSquareQuote size={28} color="var(--brand-gold)" style={{ opacity: 0.6, marginBottom: '14px' }} />
                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.8,
                        color: 'var(--text-primary)',
                        fontStyle: 'italic',
                        marginBottom: '24px',
                      }}
                    >
                      "{t.quote}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>{t.clientName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--brand-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                      {t.eventType}
                    </div>
                  </div>
                </div>
              </ImageMaskReveal>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="glass-panel"
          style={{
            padding: '54px 40px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            border: '1px solid var(--border-gold)',
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 162, 78, 0.1) 0%, rgba(20, 16, 12, 0.95) 75%)',
          }}
        >
          <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Ready To Be Our Next Success Story?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 28px auto', fontSize: '15px' }}>
            Reach out with your dates and event plans to receive a custom quote and schedule a consultation.
          </p>
          <MagneticButton>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '15px 36px' }}>
              Book an Inquiry <ArrowRight size={16} />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
