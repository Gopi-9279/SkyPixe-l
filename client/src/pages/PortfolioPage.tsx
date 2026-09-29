import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAlbums } from '../api/albums.js';
import { Album } from '../types/index.js';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { TextReveal } from '../components/common/TextReveal.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';

export const PortfolioPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Portfolios' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'hotel', label: 'Hotels & Resorts' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'other', label: 'Aerial & Commercial' },
  ];

  useEffect(() => {
    setLoading(true);
    fetchAlbums(activeCategory)
      .then((data) => {
        setAlbums(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div style={{ paddingTop: '130px', minHeight: '100vh', paddingBottom: '90px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px auto' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            The Visual Archive
          </span>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <TextReveal
              text="Portfolio & Stories"
              as="h1"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                justifyContent: 'center',
              }}
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Browse through our curated albums covering grand weddings, hospitality architecture, birthday celebrations, and dynamic commercial reels.
          </p>
        </div>

        {/* Filter Tab Pills with Shared Layout Transition (§4.4) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '54px',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  position: 'relative',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  background: 'transparent',
                  color: isActive ? '#0a0806' : 'var(--text-secondary)',
                  transition: 'color var(--duration-fast)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, var(--brand-gold) 0%, var(--brand-gold-deep) 100%)',
                      boxShadow: '0 4px 16px var(--brand-amber-glow)',
                      zIndex: 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 28,
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading skeleton or empty state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--brand-gold)' }}>
            Loading curated albums...
          </div>
        ) : albums.length === 0 ? (
          <div
            className="glass-panel"
            style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-md)' }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No albums found in this category</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Check back soon as our team regularly uploads new stories after shoots.
            </p>
            <button onClick={() => handleCategoryChange('all')} className="btn btn-outline">
              View All Works
            </button>
          </div>
        ) : (
          /* Album Grid with Staggered Entrance */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '32px',
            }}
          >
            {albums.map((alb, idx) => (
              <ImageMaskReveal key={alb._id} delay={idx * 0.08}>
                <Link to={`/portfolio/album/${alb.slug}`} style={{ display: 'block' }}>
                  <div className="flip-card-container media-card">
                    <div className="flip-card-inner">
                      {/* Front of Card */}
                      <div className="flip-card-front" style={{ backgroundColor: '#0a0d15' }}>
                        <motion.img
                          layoutId={`album-cover-${alb.slug}`}
                          src={alb.coverUrl || alb.coverMediaId?.url || '/logo-badge.png'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                          alt={alb.title}
                        />
                        <div className="media-badge" style={{ textTransform: 'capitalize' }}>
                          {alb.category}
                        </div>
                      </div>

                      {/* Back of Card */}
                      <div className="flip-card-back">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                          {alb.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} color="var(--brand-gold)" /> {alb.location}
                            </div>
                          )}
                          {alb.eventDate && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} color="var(--brand-gold)" /> {new Date(alb.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>

                        <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#ffffff' }}>
                          {alb.title}
                        </h3>

                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '20px',
                            flex: 1,
                          }}
                        >
                          {alb.description}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--brand-gold-bright)',
                            borderTop: '1px solid var(--border-subtle)',
                            paddingTop: '16px',
                            marginTop: 'auto',
                          }}
                        >
                          View Full Album <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ImageMaskReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
