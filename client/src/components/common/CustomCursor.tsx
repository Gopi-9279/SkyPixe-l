import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device has coarse pointer (touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const mediaCard = target.closest('.media-card, .lightbox-trigger');
      const isVideo = target.closest('.video-play-overlay, [data-cursor="play"]');
      const isInteractive = target.closest('button, a, input, select, textarea, .btn');

      if (isVideo) {
        setIsPointer(true);
        setCursorText('PLAY');
      } else if (mediaCard) {
        setIsPointer(true);
        setCursorText('VIEW');
      } else if (isInteractive) {
        setIsPointer(true);
        setCursorText('');
      } else {
        setIsPointer(false);
        setCursorText('');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
      animate={{
        x: position.x - (cursorText ? 32 : isPointer ? 16 : 8),
        y: position.y - (cursorText ? 32 : isPointer ? 16 : 8),
        width: cursorText ? 64 : isPointer ? 32 : 16,
        height: cursorText ? 64 : isPointer ? 32 : 16,
        backgroundColor: cursorText ? 'rgba(212, 162, 78, 0.2)' : isPointer ? 'rgba(212, 162, 78, 0.15)' : 'rgba(212, 162, 78, 0.4)',
        borderColor: 'rgba(212, 162, 78, 0.8)',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
        mass: 0.1,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '1px solid rgba(212, 162, 78, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(212, 162, 78, 0.3)',
        }}
      >
        {cursorText && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: 'var(--brand-champagne)',
              textTransform: 'uppercase',
            }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </motion.div>
  );
};
