import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

import { fetchAlbums } from '../api/albums.js';
import { fetchShowcase, ShowcaseItem } from '../api/showcase.js';
import { fetchSettings } from '../api/settings.js';

import { Album, Testimonial, MediaItem } from '../types/index.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { TextReveal } from '../components/common/TextReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';
import {
  ArrowRight,
  Play,
  Camera,
  Compass,
  Star,
  Film,
  Sparkles,
  ChevronRight,
  Instagram,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';



export const HomePage: React.FC = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [showcaseImages, setShowcaseImages] = useState<ShowcaseItem[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState<string>('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const [activePillar, setActivePillar] = useState(0);

  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroBadgeY = useTransform(scrollY, [0, 700], [0, -30]);

  useEffect(() => {
    fetchAlbums('all', true).then(setFeaturedAlbums).catch(console.error);
    fetchShowcase().then(setShowcaseImages).catch(console.error);
    fetchSettings().then(data => { if (data && data.heroImageUrl) setHeroImageUrl(data.heroImageUrl); }).catch(console.error);
  }, []);

  const craftPillars = [
    {
      icon: <Compass size={36} color="var(--brand-gold)" />,
      title: 'Licensed Aerial Innovation',
      tagline: 'DGCA-certified pilots equipped with dynamic FPV & heavy-lift cinema drones.',
      desc: 'Mastering the skies at 4K 120fps and 5.1K Apple ProRes cinema recording. Triple obstacle sensing, licensed airspace clearances, and breathtaking cinematic descent paths over majestic architecture.',
      metric: '4K 120FPS',
      metricLabel: 'Cinema Grade',
    },
    {
      icon: <Film size={36} color="var(--brand-gold)" />,
      title: 'Filmic Color Science',
      tagline: 'DaVinci Resolve mastered heirloom color grading and golden skin tones.',
      desc: 'Our post-production color pipeline is calibrated to celebrate warm candlelight, gold embroidery, and dusk transitions with zero color banding. Every still and reel is color-timed for timeless legacy.',
      metric: '12-BIT RAW',
      metricLabel: 'Master Precision',
    },
    {
      icon: <Camera size={36} color="var(--brand-gold)" />,
      title: 'Multi-Camera Precision',
      tagline: 'Full cinema crew coordination ensuring zero missed micro-moments.',
      desc: 'Deploying Sony Cinema Line and RED Digital Cinema sensors paired with ultra-fast f/1.2 & f/1.4 prime lenses. Dual-redundant on-location NVMe SSD replication ensures your once-in-a-lifetime memories are 100% secure.',
      metric: '100% SECURE',
      metricLabel: 'Dual NVMe Backup',
    },
    {
      icon: <HeartHandshake size={36} color="var(--brand-gold)" />,
      title: 'Unobtrusive Narrative Flow',
      tagline: 'Documentary honesty and spontaneous, unscripted emotional depth.',
      desc: 'We move like shadows throughout the celebrations. No stiff posing, no intrusive equipment. True laughter, quiet tears, and raw celebratory electric energy captured in their most authentic cadence.',
      metric: 'SAME-DAY',
      metricLabel: 'Social Teaser Delivery',
    },
  ];



  const categories = [
    {
      id: 'wedding',
      name: 'Wedding',
      tag: 'Sacred Vows & Heritage Grandeur',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'brand_promotion',
      name: 'Brand Promotion',
      tag: 'Architectural Elegance & Hospitality',
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'birthday',
      name: 'Birthday',
      tag: 'Pastel Wonderlands & Electric Rooftops',
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'conference_shoot',
      name: 'Conference Shoot',
      tag: 'Dynamic Keynotes & High-Energy Galas',
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  const fallbackImages = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
  ];

  // Permanently use curated showcase images
  const curatedShowcase = fallbackImages.map((url) => ({
    url,
    permalink: 'https://www.instagram.com/skypixel_sp/',
    caption: 'Skypixel Creative Studio Portfolio',
    isVideo: false,
  }));

  const googleReviews = [
    {
      id: 1,
      author: "Aditi & Rohan",
      date: "2 months ago",
      text: "Skypixel captured our wedding perfectly. The drone shots of the venue were absolutely breathtaking and the team was so professional and unobtrusive. The cinematic video still makes us cry!",
      rating: 5,
    },
    {
      id: 2,
      author: "Taj Hotels Management",
      date: "5 months ago",
      text: "We hired Skypixel for our new property launch. Their cinematic approach to architectural videography is unmatched. The FPV drone fly-throughs were exactly what we needed. Highly recommended for luxury brands.",
      rating: 5,
    },
    {
      id: 3,
      author: "Karan S.",
      date: "8 months ago",
      text: "The best photography studio we have ever worked with. They delivered our cinematic film ahead of schedule and the color grading looked like a Hollywood movie. Worth every penny.",
      rating: 5,
    }
  ];

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 1. Cinematic Full-Bleed Parallax Hero Section (§4.3.2) */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '720px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0806',
        }}
      >
        {/* Parallax Background Layer (0.8x speed) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to bottom, rgba(10, 8, 6, 0.45) 0%, rgba(10, 8, 6, 0.75) 75%, #0a0806 100%), url('${heroImageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            filter: 'brightness(0.85)',
            y: shouldReduceMotion ? 0 : heroBgY,
          }}
        />

        {/* Breathing Gold Spotlight (§4.3.8) */}
        <motion.div
          animate={{
            opacity: [0.45, 0.75, 0.45],
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(212, 162, 78, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Hero Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '920px' }}>
          {/* Logo Badge in Hero with Rim-Light Glow */}
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 20px',
              borderRadius: '9999px',
              background: 'rgba(10, 8, 6, 0.75)',
              border: '1px solid var(--border-gold)',
              backdropFilter: 'blur(14px)',
              marginBottom: '26px',
              y: shouldReduceMotion ? 0 : heroBadgeY,
            }}
            className="logo-crest-glow"
          >
            <img src="/logo-badge.png" alt="Skypixel Badge" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--brand-champagne)' }}>
              Skypixel Creative Studio
            </span>
          </motion.div>

          {/* Kinetic Headline Reveal (§4.3.1) */}
          <div style={{ marginBottom: '20px' }}>
            <TextReveal
              text="Every View — A New Flight."
              as="h1"
              italicIndices={[4, 5]}
              style={{
                fontSize: 'clamp(38px, 6.5vw, 80px)',
                fontWeight: 700,
                lineHeight: 1.1,
                justifyContent: 'center',
                textShadow: '0 4px 32px rgba(0,0,0,0.85)',
              }}
            />
          </div>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 38px auto',
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            }}
          >
            Mastering the art of emotional storytelling through licensed aerial drone cinematography and timeless photography for luxury weddings, resorts, and premier events.
          </p>

          {/* Magnetic Primary Buttons (§4.3.4) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
            <MagneticButton>
              <Link to="/portfolio" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '15px' }}>
                Explore Portfolio <ArrowRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/contact" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '15px' }}>
                Inquire For Dates
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Ambient Pulsing Scroll Indicator (§4.3.8) */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll To Explore</span>
          <motion.div
            animate={{
              scaleY: [0.6, 1.2, 0.6],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: '2px',
              height: '24px',
              backgroundColor: 'var(--brand-gold)',
              borderRadius: '2px',
              boxShadow: '0 0 10px var(--brand-amber-glow)',
            }}
          />
        </div>
      </section>

      {/* 2. Category Portals Section with Curtain Reveals (§4.3.7) */}
      <section style={{ padding: '100px 0 70px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto 54px auto' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              Curated Specializations
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginTop: '8px', marginBottom: '14px' }}>
              Explore Work By Event Type
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Tailored cinematic vision calibrated specifically to the unique rhythm and emotion of each occasion.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {categories.map((cat, idx) => (
              <ImageMaskReveal key={cat.id} delay={idx * 0.1}>
                <Link
                  to={`/portfolio?category=${cat.id}`}
                  className="glass-panel"
                  style={{
                    position: 'relative',
                    height: '380px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '28px',
                    textDecoration: 'none',
                    transition: 'transform var(--duration-base) var(--ease-hover), border-color var(--duration-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Background Image */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `linear-gradient(to top, #0a0806 20%, rgba(10, 8, 6, 0.3) 100%), url('${cat.img}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.6s var(--ease-reveal)',
                      zIndex: 1,
                    }}
                  />

                  {/* Info Text */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--brand-gold-bright)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {cat.tag}
                    </span>
                    <h3 style={{ fontSize: '22px', color: '#ffffff', margin: '6px 0 10px 0' }}>{cat.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      View Gallery <ChevronRight size={14} color="var(--brand-gold)" />
                    </div>
                  </div>
                </Link>
              </ImageMaskReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Highlight Albums Showcase */}
      <section style={{ padding: '80px 0', backgroundColor: '#070503' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--brand-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                Selected Stories
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: '8px' }}>Featured Highlight Shoots</h2>
            </div>
            <Link to="/portfolio" className="btn btn-outline">
              View All Works <ArrowRight size={16} />
            </Link>
          </div>

          {featuredAlbums.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '30px',
              }}
            >
              {featuredAlbums.slice(0, 3).map((alb, idx) => (
                <ImageMaskReveal key={alb._id} delay={idx * 0.12}>
                  <div
                    className="media-card"
                    style={{ border: '1px solid var(--border-subtle)', maxWidth: '400px', margin: '0 auto', width: '100%' }}
                  >
                    <Link to={`/portfolio/album/${alb.slug}`}>
                      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#0a0d15' }}>
                        <motion.img
                          layoutId={`album-cover-${alb.slug}`}
                          src={alb.coverUrl || alb.coverMediaId?.url || '/logo-badge.png'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                        />
                        <div className="media-badge" style={{ textTransform: 'capitalize' }}>
                          {alb.category}
                        </div>
                      </div>
                      <div style={{ padding: '24px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--brand-gold)', marginBottom: '6px' }}>
                          {alb.location || 'Signature Event'}
                        </div>
                        <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffffff' }}>{alb.title}</h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {alb.description}
                        </p>
                        <div
                          style={{
                            marginTop: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--brand-champagne)',
                          }}
                        >
                          Explore Album & Reels <ChevronRight size={14} color="var(--brand-gold)" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </ImageMaskReveal>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                No featured works available. Once you create albums and mark them as "Featured" in the Admin Panel, they will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Scroll-Scrubbed "The Craft" Storytelling Section (§4.3.3) */}
      <section
        style={{
          padding: '100px 0',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              The Craft & Pillars
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginTop: '8px', marginBottom: '14px' }}>
              How We Capture Horizons
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Scroll through the four foundational pillars that define every aerial film and photographic legacy created by Skypixel.
            </p>
          </div>

          {/* Interactive Pinned Showcase Display */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left: Pillar Navigator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {craftPillars.map((pillar, index) => {
                const isActive = activePillar === index;
                return (
                  <div
                    key={index}
                    onClick={() => setActivePillar(index)}
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--bg-card-hover)' : 'rgba(20, 16, 12, 0.4)',
                      border: isActive ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                      boxShadow: isActive ? '0 8px 30px var(--brand-amber-glow)' : 'none',
                      cursor: 'pointer',
                      transition: 'all var(--duration-base) var(--ease-reveal)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {pillar.icon}
                        <h3 style={{ fontSize: '19px', color: isActive ? '#ffffff' : 'var(--text-secondary)' }}>
                          {pillar.title}
                        </h3>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-gold)' }}>
                        0{index + 1}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginLeft: '48px' }}>
                      {pillar.tagline}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Pillar Detail Card */}
            <motion.div
              key={activePillar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel"
              style={{
                padding: '48px 40px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-gold)',
                background: 'linear-gradient(145deg, rgba(28, 22, 16, 0.9) 0%, rgba(10, 8, 6, 0.95) 100%)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(212, 162, 78, 0.1)',
                  border: '1px solid var(--border-gold)',
                  marginBottom: '24px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {craftPillars[activePillar].metric}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  • {craftPillars[activePillar].metricLabel}
                </span>
              </div>

              <h3 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>
                {craftPillars[activePillar].title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
                {craftPillars[activePillar].desc}
              </p>

              <Link to="/about" className="btn btn-outline" style={{ padding: '12px 26px', fontSize: '13px' }}>
                Explore Studio Heritage <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 5. Client Testimonials Strip (Google Reviews) */}
      <section style={{ padding: '80px 0', backgroundColor: '#070503' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--brand-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Verified Google Reviews
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginTop: '8px' }}>What Our Clients Say</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {googleReviews.map((r) => (
              <div
                key={r.id}
                className="glass-panel"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#FBBC05' }}>
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#FBBC05" color="#FBBC05" />
                    ))}
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '20px' }}>
                    "{r.text}"
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{r.author}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.date}</div>
                  </div>
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.8 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a 
              href="https://google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-outline" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px' }}
            >
              Read More Reviews on Google <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 6. Live Instagram Feed — @skypixel_sp */}
      <section style={{ padding: '70px 0' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Instagram size={22} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', lineHeight: 1.2 }}>@skypixel_sp</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Curated Highlights
                </span>
              </div>
            </div>
            <a
              href="https://www.instagram.com/skypixel_sp/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ padding: '10px 22px', fontSize: '13px' }}
            >
              Follow on Instagram <ChevronRight size={14} />
            </a>
          </div>

          {/* Feed Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '30px',
            }}
          >
            {showcaseImages.slice(0, 6).map((item, i) => (
              <a
                key={i}
                href="https://www.instagram.com/skypixel_sp/"
                target="_blank"
                rel="noreferrer"
                className="media-card"
                style={{
                  border: '1px solid var(--border-subtle)',
                  maxWidth: '400px',
                  margin: '0 auto',
                  width: '100%',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#0a0d15' }}>
                  <img
                    src={item.url}
                    alt="Instagram Feed"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                  />
                  <div className="media-badge" style={{ textTransform: 'capitalize' }}>
                    Instagram
                  </div>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--brand-gold)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Instagram size={13} color="var(--brand-gold)" /> @skypixel_sp
                  </div>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#ffffff' }}>
                    SkyPixel Latest
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--brand-gold-bright)' }}>
                    View on Instagram <ChevronRight size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Lead Conversion CTA Banner */}
      <section style={{ padding: '80px 0 100px 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              padding: '60px 40px',
              textAlign: 'center',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              background: 'radial-gradient(circle at 50% 50%, rgba(212, 162, 78, 0.12) 0%, rgba(20, 16, 12, 0.92) 75%)',
            }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
              Let’s Create Something Unforgettable
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                margin: '0 auto 32px auto',
                lineHeight: 1.6,
              }}
            >
              Dates for 2026 wedding seasons and corporate summits fill up months in advance. Share your vision and secure your shoot dates today.
            </p>
            <MagneticButton>
              <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                Reserve Your Date Now <ArrowRight size={18} />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Lightbox for preview */}
      <Lightbox
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};
