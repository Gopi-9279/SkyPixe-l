import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{
        duration: 0.45,
        ease: [0.65, 0, 0.35, 1] as const, // --ease-page
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};
