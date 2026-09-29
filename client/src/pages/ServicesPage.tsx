import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Video, Camera, Sparkles, Compass } from 'lucide-react';
import { TextReveal } from '../components/common/TextReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';

interface TiltCardProps {
  children: React.ReactNode;
  popular?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, popular }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    // max 4 degrees tilt as specified in §4.4
    const rotateX = -(y / (height / 2)) * 4;
    const rotateY = (x / (width / 2)) * 4;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      style={{ perspective: '1000px', height: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: rotation.x, rotateY: rotation.y }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '38px 34px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          height: '100%',
          border: popular ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
          boxShadow: popular ? '0 12px 36px var(--brand-amber-glow)' : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const ServicesPage: React.FC = () => {
  const servicePackages = [
    {
      category: 'wedding',
      title: 'Weddings',
      tagline: 'Comprehensive multi-day heirloom coverage with cinematic drone flights.',
      highlights: [
        'Multi-camera coverage (Lead photographer, secondary shooter, aerial pilot)',
        'Cinematic 4K drone coverage of venues, guest processions & pheras',
        'Same-day 60-second Instagram highlight reel for guests',
        '5–8 minute cinematic feature film with custom music licensing',
        '800+ bespoke color-graded high-resolution photos in private digital gallery',
        'Pre-wedding sunset couple portrait session included',
      ],
      popular: true,
    },
    {
      category: 'hotel',
      title: 'Hotels, Resorts & Architecture',
      tagline: 'Visual branding designed to accelerate bookings and prestige.',
      highlights: [
        'FPV drone fly-throughs transitioning from exterior horizon to presidential suites',
        'Architectural photography tuned for dusk and golden hour ambient lighting',
        'Culinary and Michelin-standard dining staging & lifestyle capture',
        'High-resolution commercial licensing for international print & digital campaigns',
        'Short-form vertical video reels for social advertising channels',
        'Full delivery within 10 business days',
      ],
      popular: false,
    },
    {
      category: 'birthday',
      title: 'Milestone Birthdays & Galas',
      tagline: 'Capturing candid joy, bespoke themes, and high-energy nightlife.',
      highlights: [
        'Full coverage of theme decor, balloon art, and cake-cutting moments',
        'High-energy evening party lighting for rooftop DJ and dancefloors',
        'Interactive family portraits and candid guest micro-moments',
        'Next-day 30-second teaser video for social sharing',
        'Color-graded photo delivery within 7 days',
        'Drone aerials for outdoor private estate venues',
      ],
      popular: false,
    },
    {
      category: 'corporate',
      title: 'Corporate Summits & Keynotes',
      tagline: 'Polished media production for global enterprises and multi-day conferences.',
      highlights: [
        'Multi-stage audio & multi-camera 4K video recording',
        'Executive keynote speaker portraits and crowd interaction captures',
        'Daily recap highlight videos edited on-site within 12 hours',
        'Full digital media kit delivered for immediate PR & press distribution',
        'Drone perspectives for massive convention centers and outdoor team bonding',
        'NDAs and corporate compliance protocols honored',
      ],
      popular: false,
    },
  ];

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
            Studio Offerings
          </span>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <TextReveal
              text="Tailored Production Packages"
              as="h1"
              style={{
                fontSize: 'clamp(36px, 5vw, 54px)',
                justifyContent: 'center',
              }}
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Every production is custom-calibrated to your timeline, venue requirements, and visual ambitions. No cookie-cutter templates.
          </p>
        </div>

        {/* Packages Grid with 3D Card Tilt (§4.4) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            marginBottom: '70px',
          }}
        >
          {servicePackages.map((pkg) => (
            <TiltCard key={pkg.category} popular={pkg.popular}>
              {pkg.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)',
                    color: '#0a0806',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '4px 14px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 10px var(--brand-amber-glow)',
                  }}
                >
                  Signature Offering
                </div>
              )}

              <div>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--brand-gold)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {pkg.category}
                </span>
                <h3 style={{ fontSize: '24px', margin: '6px 0 10px 0', color: '#ffffff' }}>{pkg.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                  {pkg.tagline}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                  {pkg.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px' }}>
                      <Check size={16} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <MagneticButton style={{ width: '100%' }}>
                <Link
                  to={`/contact?eventType=${pkg.category}`}
                  className={pkg.popular ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ width: '100%', padding: '14px 20px' }}
                >
                  Inquire For Package <ArrowRight size={15} />
                </Link>
              </MagneticButton>
            </TiltCard>
          ))}
        </div>

        {/* Studio Equipment & Standard */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '50px 40px',
            border: '1px solid var(--border-gold)',
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 162, 78, 0.08) 0%, rgba(20, 16, 12, 0.95) 75%)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px auto' }}>
            <span style={{ fontSize: '11px', color: 'var(--brand-gold)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Hardware Benchmark
            </span>
            <h2 style={{ fontSize: '28px', marginTop: '6px', marginBottom: '10px' }}>The Technical Benchmark</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Equipment is merely our pen; our vision is the poem. Here is what we bring to every shoot:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ padding: '24px', background: 'rgba(255, 246, 230, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <Compass size={32} color="var(--brand-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>DJI Inspire & FPV Fleet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Capable of 4K 120fps and 5.1K Apple ProRes cinema recording with triple obstacle sensing.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(255, 246, 230, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <Camera size={32} color="var(--brand-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>Sony Cinema & Prime Glass</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Full-frame FX & Alpha line sensors with ultra-fast f/1.2 & f/1.4 G-Master prime glass for unmatched bokeh.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(255, 246, 230, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <Video size={32} color="var(--brand-gold)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>Dual-Redundant Backup</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                On-location immediate dual NVMe SSD replication so your once-in-a-lifetime memories are 100% secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
