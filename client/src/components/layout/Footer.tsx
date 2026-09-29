import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#080604',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '64px',
        paddingBottom: '36px',
        marginTop: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Studio Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <img
                src="/logo-badge.png"
                alt="Skypixel Badge"
                className="logo-crest-glow"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid rgba(212, 162, 78, 0.4)',
                }}
              />
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.06em' }}>
                  <span style={{ color: '#ffffff' }}>SKY</span>
                  <span style={{ color: 'var(--brand-gold)' }}>PIXEL</span>
                </div>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Photography & Videography Studio
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              Every view — a new flight. Dedicated to timeless wedding films, hospitality architecture, high-energy celebrations, and licensed aerial cinematography.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://www.instagram.com/skypixel_sp/"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 246, 230, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@mathslab9608"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 246, 230, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://wa.me/7779945787"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 246, 230, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--duration-fast)',
                }}
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Portfolio Links */}
          <div>
            <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', color: '#ffffff' }}>
              Portfolio Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li><Link to="/portfolio?category=engagement" style={{ transition: 'color var(--duration-fast)' }}>Engagement</Link></li>
              <li><Link to="/portfolio?category=wedding" style={{ transition: 'color var(--duration-fast)' }}>Weddings</Link></li>
              <li><Link to="/portfolio?category=maternity_baby_shoot" style={{ transition: 'color var(--duration-fast)' }}>Maternity / Baby Shoot</Link></li>
              <li><Link to="/portfolio?category=conference_shoot" style={{ transition: 'color var(--duration-fast)' }}>Conference Shoot</Link></li>
              <li><Link to="/portfolio?category=event_drone_coverage" style={{ transition: 'color var(--duration-fast)' }}>Event Shoot/Drone Coverage</Link></li>
            </ul>
          </div>

          {/* Studio Navigation */}
          <div>
            <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', color: '#ffffff' }}>
              Studio Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li><Link to="/about">Our Story & Craft</Link></li>
              <li><Link to="/team">Meet The Creative Team</Link></li>
              <li><Link to="/services">Packages & Offerings</Link></li>
              <li><Link to="/testimonials">Client Testimonials</Link></li>
              <li><Link to="/contact">Book an Inquiry</Link></li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div>
            <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px', color: '#ffffff' }}>
              Studio Contacts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--brand-gold)" />
                <a href="tel:+919876543210">+91 77799 45787</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--brand-gold)" />
                <a href="mailto:sky.pixel.view@gmail.com">sky.pixel.view@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--brand-gold)" style={{ marginTop: '3px' }} />
                <span>Available for Destination Shoots Pan-India & Worldwide</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    background: 'rgba(255, 246, 230, 0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <ShieldCheck size={14} /> Admin Access Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Skypixel Studio. All rights reserved. Every View — A New Flight.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Crafted for visual storytellers with <Heart size={14} color="var(--brand-gold)" fill="var(--brand-gold)" />
          </div>
        </div>
      </div>
    </footer>
  );
};

