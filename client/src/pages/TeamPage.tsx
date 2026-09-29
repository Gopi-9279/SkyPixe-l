import React, { useEffect, useState } from 'react';
import { fetchTeam } from '../api/team.js';
import { TeamMember } from '../types/index.js';
import { Link } from 'react-router-dom';
import { TextReveal } from '../components/common/TextReveal.js';
import { ImageMaskReveal } from '../components/common/ImageMaskReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';
import { ArrowRight } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam()
      .then(setTeam)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: '130px', minHeight: '100vh', paddingBottom: '90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--brand-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            The Collective
          </span>
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <TextReveal
              text="Meet The Creative Team"
              as="h1"
              style={{
                fontSize: 'clamp(36px, 5vw, 54px)',
                justifyContent: 'center',
              }}
            />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Skypixel is not a solo freelancer. We are an ensemble of dedicated aerial directors, documentary photographers, and master colorists who move in sync.
          </p>
        </div>

        {/* Team Grid with Mask Reveals (§4.4) */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--brand-gold)', padding: '60px 0' }}>
            Loading team profiles...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '70px',
            }}
          >
            {team.map((member, idx) => (
              <ImageMaskReveal key={member._id} delay={idx * 0.1}>
                <div
                  className="media-card"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <div style={{ height: '360px', overflow: 'hidden' }}>
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--brand-gold)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '6px',
                      }}
                    >
                      {member.role}
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#ffffff' }}>
                      {member.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              </ImageMaskReveal>
            ))}
          </div>
        )}

        {/* Join our team or collaborate CTA */}
        <div
          className="glass-panel"
          style={{
            padding: '48px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            border: '1px solid var(--border-gold)',
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 162, 78, 0.08) 0%, rgba(20, 16, 12, 0.95) 75%)',
          }}
        >
          <h3 style={{ fontSize: '26px', marginBottom: '10px' }}>Want to collaborate with our crew?</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 24px auto', fontSize: '14px' }}>
            Whether you are planning a destination wedding in Goa or a luxury resort launch in Udaipur, our full team travels worldwide.
          </p>
          <MagneticButton>
            <Link to="/contact" className="btn btn-primary">
              Connect With Our Team <ArrowRight size={16} />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
