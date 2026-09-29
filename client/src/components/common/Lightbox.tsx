import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MediaItem } from '../../types/index.js';

interface LightboxProps {
  items: MediaItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || items.length === 0 || currentIndex < 0 || currentIndex >= items.length) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          cursor: 'pointer',
          zIndex: 10001,
          transition: 'all 0.2s ease',
        }}
        aria-label="Close Lightbox"
      >
        <X size={22} />
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          style={{
            position: 'absolute',
            left: '24px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            zIndex: 10001,
          }}
          aria-label="Previous Media"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      {/* Next button */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          style={{
            position: 'absolute',
            right: '24px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            zIndex: 10001,
          }}
          aria-label="Next Media"
        >
          <ChevronRight size={26} />
        </button>
      )}

      {/* Media Content */}
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeIn 0.3s ease' }}
      >
        {currentItem.type === 'video' ? (
          <video
            src={currentItem.url}
            controls
            autoPlay
            poster={currentItem.thumbnailUrl}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              borderRadius: '8px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            }}
          />
        ) : (
          <img
            src={currentItem.url}
            alt="Photography preview"
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        )}

        {/* Counter and info */}
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            background: 'rgba(10, 13, 20, 0.8)',
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span style={{ color: 'var(--brand-coral)', fontWeight: 600 }}>
            {currentIndex + 1}
          </span>{' '}
          / {items.length}
          {currentItem.type === 'video' && (
            <span
              style={{
                marginLeft: '8px',
                fontSize: '11px',
                background: 'rgba(238, 82, 61, 0.2)',
                color: 'var(--brand-coral)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              4K Video Reel
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
