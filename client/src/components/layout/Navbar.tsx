import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton.js';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all var(--duration-base) var(--ease-reveal)',
        backgroundColor: isScrolled ? 'rgba(10, 8, 6, 0.92)' : 'rgba(10, 8, 6, 0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        padding: isScrolled ? '12px 0' : '18px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo & Name */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo-badge.png"
            alt="Skypixel Logo"
            className="logo-crest-glow"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(212, 162, 78, 0.35)',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 800, letterSpacing: '0.08em' }}>
              <span style={{ color: '#ffffff' }}>SKY</span>
              <span style={{ color: 'var(--brand-gold)' }}>PIXEL</span>
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Every View — A New Flight
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--brand-gold-bright)' : 'var(--text-secondary)',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color var(--duration-fast)',
                }}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="navActiveIndicator"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--brand-gold)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px var(--brand-amber-glow)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-cta">
          <MagneticButton>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>
              Book a Shoot <ChevronRight size={15} />
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} color="var(--brand-gold)" /> : <Menu size={26} />}
        </button>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0a0806',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 999,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: '20px',
                fontFamily: 'var(--font-serif)',
                color: location.pathname === link.path ? 'var(--brand-gold)' : '#ffffff',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn btn-primary"
            style={{ marginTop: '16px', width: '100%', padding: '14px' }}
          >
            Book a Shoot Now
          </Link>
        </div>
      )}
    </>
  );
};

