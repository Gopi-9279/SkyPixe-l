import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchAlbumBySlug } from '../api/albums.js';
import { Album, MediaItem } from '../types/index.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';
import { ArrowLeft, Play, Calendar, MapPin, ArrowRight } from 'lucide-react';

export const AlbumDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchAlbumBySlug(slug)
      .then((data) => setAlbum(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ paddingTop: '160px', textAlign: 'center', minHeight: '80vh', color: 'var(--brand-gold)' }}>
        Loading album story and media...
      </div>
    );
  }

  if (!album) {
    return (
      <div style={{ paddingTop: '160px', textAlign: 'center', minHeight: '80vh' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Album Not Found</h2>
        <Link to="/portfolio" className="btn btn-outline">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const mediaList = album.media || [];

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/portfolio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              transition: 'color var(--duration-fast)',
            }}
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>

        {/* Shared Element Hero Cover Banner (§4.3.5) */}
        {(album.coverUrl || album.coverMediaId?.url) && (
          <div
            style={{
              position: 'relative',
              height: '420px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '40px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#000000',
            }}
          >
            <motion.img
              layoutId={`album-cover-${album.slug}`}
              src={album.coverUrl || album.coverMediaId?.url}
              alt={album.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 8, 6, 0.95) 0%, rgba(10, 8, 6, 0.3) 60%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '32px',
                left: '32px',
                right: '32px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--brand-gold-bright)',
                  background: 'rgba(212, 162, 78, 0.15)',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-gold)',
                  display: 'inline-block',
                  marginBottom: '12px',
                }}
              >
                {album.category}
              </span>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#ffffff', marginBottom: '8px' }}>
                {album.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {album.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--brand-gold)" /> {album.location}
                  </div>
                )}
                {album.eventDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--brand-gold)" /> {new Date(album.eventDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Story Narrative Box */}
        <div
          className="glass-panel"
          style={{
            padding: '36px 40px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '54px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-gold)', marginBottom: '12px' }}>
            The Visual Story
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.8, maxWidth: '880px' }}>
            {album.description}
          </p>
        </div>

        {/* Media Grid with Mask Reveals */}
        <div style={{ marginBottom: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px' }}>
              Curated Media & Stills ({mediaList.length})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Click any photo or reel to open Theater Lightbox
            </span>
          </div>

          {mediaList.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Photographs and video clips are currently being processed for this album.</p>
            </div>
          ) : (
            <div className="masonry-columns">
              {mediaList.map((item, idx) => (
                <ImageMaskReveal key={item._id} delay={idx * 0.05}>
                  <div
                    className="masonry-item media-card"
                    onClick={() => handleMediaClick(idx)}
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={`${album.title} - ${idx + 1}`}
                      loading="lazy"
                    />

                    {item.type === 'video' && (
                      <div className="video-play-overlay">
                        <div className="play-button-icon">
                          <Play size={22} color="#0a0806" fill="#0a0806" style={{ marginLeft: '3px' }} />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            background: 'rgba(10, 8, 6, 0.85)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: 'var(--brand-champagne)',
                            fontWeight: 600,
                            border: '1px solid var(--border-gold)',
                          }}
                        >
                          {item.duration ? `${item.duration}s` : 'Video'}
                        </div>
                      </div>
                    )}
                  </div>
                </ImageMaskReveal>
              ))}
            </div>
          )}
        </div>

        {/* Inquire for Similar Shoot CTA Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '54px 40px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-gold)',
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 162, 78, 0.12) 0%, rgba(20, 16, 12, 0.95) 100%)',
          }}
        >
          <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>
            Planning a {album.category.toUpperCase()} event?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto', fontSize: '15px' }}>
            Our team brings this exact caliber of cinematography and editorial photography to your celebration.
          </p>
          <MagneticButton>
            <Link
              to={`/contact?eventType=${album.category}`}
              className="btn btn-primary"
              style={{ padding: '15px 36px' }}
            >
              Inquire About A Shoot Like This <ArrowRight size={16} />
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        items={mediaList}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};
