import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';
import { TextReveal } from '../components/common/TextReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '130px', minHeight: '100vh', paddingBottom: '90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px auto' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            Behind The Lens
          </span>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <TextReveal
              text="Our Story & Philosophy"
              as="h1"
              style={{
                fontSize: 'clamp(36px, 5vw, 54px)',
                justifyContent: 'center',
              }}
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
            Founded on the belief that perspective changes everything. What began as a passionate pursuit of aerial geometry has grown into a full-service visual production team.
          </p>
        </div>

        {/* Narrative & Image Block */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '50px',
            alignItems: 'center',
            marginBottom: '80px',
          }}
        >
          <ImageMaskReveal>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1000&auto=format&fit=crop"
                alt="Skypixel camera crew in action"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
              {/* Logo Watermark Badge with Breathing Backlight Glow (§4.4) */}
              <div
                className="logo-crest-glow"
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(10, 8, 6, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <img src="/logo-badge.png" alt="Skypixel" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-champagne)' }}>
                  Est. 2018
                </span>
              </div>
            </div>
          </ImageMaskReveal>

          <div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: '18px', lineHeight: 1.2 }}>
              Why "Every View — A New Flight"?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
              To us, a flight is not just about altitude. It is about rising above the mundane, shedding cliché poses, and documenting events as living, breathing cinematic tapestries.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, marginBottom: '32px' }}>
              When you look back at your wedding film, your hotel resort campaign, or your milestone anniversary photos twenty years from today, you should feel the exact temperature of the room, the roar of the applause, and the gentle catch of a breath before the vows.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <MagneticButton>
                <Link to="/team" className="btn btn-primary">
                  Meet Our Team <ArrowRight size={16} />
                </Link>
              </MagneticButton>
              <Link to="/portfolio" className="btn btn-outline">
                View Curated Archive
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Craft */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '70px',
          }}
        >
          <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <Compass size={28} color="var(--brand-gold)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Aerial Innovation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              DGCA-certified pilots equipped with dynamic FPV and heavy-lift cinema drones navigating complex architectures with finesse.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <Eye size={28} color="var(--brand-gold)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Documentary Honesty</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              We favor unscripted vulnerability over stiff orchestrations. True laughter, quiet tears, and raw celebratory electric moments.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <ShieldCheck size={28} color="var(--brand-gold)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Air-Tight Reliability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Multi-card simultaneous recording, redundant audio feeds, and instant onsite backup guarantees complete peace of mind.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <HeartHandshake size={28} color="var(--brand-gold)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Bespoke Post-Production</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              Custom musical soundscapes, professional sound design, and color grading tailored to the emotional tone of each film.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
