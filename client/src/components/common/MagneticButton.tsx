import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  maxOffset?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  style = {},
  onClick,
  maxOffset = 12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) / (width / 2);
    const deltaY = (clientY - centerY) / (height / 2);

    setPosition({
      x: deltaX * maxOffset,
      y: deltaY * maxOffset,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
        mass: 0.2,
      }}
      className={className}
      style={{
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
