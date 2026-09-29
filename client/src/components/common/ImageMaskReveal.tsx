import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ImageMaskRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export const ImageMaskReveal: React.FC<ImageMaskRevealProps> = ({
  children,
  className = '',
  style = {},
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      className={className}
      style={{
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
