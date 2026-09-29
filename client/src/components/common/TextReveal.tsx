import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  staggerDelay?: number;
  italicIndices?: number[]; // indices of words to render in italic accent
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  as = 'h2',
  className = '',
  style = {},
  staggerDelay = 0.04,
  italicIndices = [],
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
      filter: shouldReduceMotion ? 'none' : 'blur(6px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // --ease-reveal
      },
    },
  };

  const Component = motion[as] as any;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: '0.28em',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const isItalic = italicIndices.includes(i);
        return (
          <motion.span
            key={i}
            variants={wordVariants}
            style={{
              display: 'inline-block',
              fontStyle: isItalic ? 'italic' : undefined,
              color: isItalic ? 'var(--brand-champagne)' : undefined,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};
