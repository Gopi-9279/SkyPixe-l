import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { submitInquiry } from '../api/inquiries.js';
import { Phone, Mail, MapPin, Send, Instagram, MessageCircle, Sparkles } from 'lucide-react';
import { TextReveal } from '../components/common/TextReveal.js';
import { MagneticButton } from '../components/common/MagneticButton.js';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get('eventType') || 'wedding';
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: preselectedType,
    eventDate: '',
    venue: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('eventType')) {
      setFormData((prev) => ({ ...prev, eventType: searchParams.get('eventType')! }));
    }
  }, [searchParams]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
      else if (value.trim().length > 60) error = 'Name cannot exceed 60 characters';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Please enter a valid email address';
    } else if (name === 'phone') {
      if (!value.trim()) error = 'Phone number is required';
      else if (value.trim().length < 7) error = 'Phone number must be at least 7 digits';
    } else if (name === 'message') {
      if (!value.trim()) error = 'Message is required';
      else if (value.trim().length < 10) error = 'Please provide at least 10 characters';
      else if (value.trim().length > 1000) error = 'Message cannot exceed 1000 characters';
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Instant validation on input
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const newErrors: Record<string, string> = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      message: validateField('message', formData.message),
    };

    const hasErrors = Object.values(newErrors).some((err) => !!err);
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry(formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'wedding',
        eventDate: '',
        venue: '',
        message: '',
      });
      setErrors({});
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp?.errors) {
        setErrors(resp.errors);
      } else {
        setServerError(resp?.message || 'Failed to submit inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '130px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container">
        {/* Page Header with Kinetic Typography */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(212, 162, 78, 0.08)',
              border: '1px solid rgba(212, 162, 78, 0.25)',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={13} color="var(--brand-gold)" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--brand-gold-bright)',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
              }}
            >
              Start A Conversation
            </span>
          </motion.div>

          <TextReveal
            text="Commission Your Visual Story"
            as="h1"
            className="hero-text"
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              marginTop: '8px',
              marginBottom: '18px',
              fontFamily: 'var(--font-display)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}
          >
            Tell us about your celebration, venue, and visual goals. Our studio director replies within 24 hours with custom packages, date reservations, and production notes.
          </motion.p>
        </div>

        {/* Form & Contact Info Two-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Inquiry Form */}
          <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              padding: '44px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 162, 78, 0.15)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                {/* Animated SVG checkmark path draw-in */}
                <div style={{ display: 'inline-flex', marginBottom: '24px' }}>
                  <svg width="84" height="84" viewBox="0 0 52 52" style={{ overflow: 'visible' }}>
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="24"
                      fill="none"
                      stroke="var(--brand-gold)"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ filter: 'drop-shadow(0 0 12px rgba(212, 162, 78, 0.4))' }}
                    />
                    <motion.path
                      fill="none"
                      stroke="var(--brand-gold-bright)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.5,
                        delay: shouldReduceMotion ? 0 : 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </svg>
                </div>

                <h2 style={{ fontSize: '28px', marginBottom: '12px', fontFamily: 'var(--font-display)', color: 'var(--brand-champagne)' }}>
                  Inquiry Received
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                  Thank you for considering Skypixel. We have received your event parameters and will cross-reference our shooting calendar and respond promptly.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="btn btn-outline"
                  style={{ borderColor: 'rgba(212, 162, 78, 0.4)', color: 'var(--brand-gold)' }}
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    Event Inquiry Form
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>* Required fields</span>
                </div>

                {serverError && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '20px',
                      fontSize: '14px',
                    }}
                  >
                    {serverError}
                  </div>
                )}

                {/* Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="inq-name">Your Full Name *</label>
                  <input
                    id="inq-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Rohan & Ayesha"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                {/* Email & Phone Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-email">Email Address *</label>
                    <input
                      id="inq-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-phone">Phone / WhatsApp *</label>
                    <input
                      id="inq-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 77799 45787"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Event Type & Date Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-eventType">Event Category *</label>
                    <select
                      id="inq-eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="engagement">Engagement</option>
                      <option value="prewedding">Prewedding</option>
                      <option value="wedding">Wedding</option>
                      <option value="postwedding">Postwedding</option>
                      <option value="anniversery">Anniversery</option>
                      <option value="birthday">Birthday</option>
                      <option value="maternity_baby_shoot">Maternity / Baby Shoot</option>
                      <option value="brand_promotion">Brand Promotion</option>
                      <option value="conference_shoot">Conference shoot</option>
                      <option value="model_portfolio">Model Portfolio</option>
                      <option value="music_video_shoot">Music Video Shoot</option>
                      <option value="event_drone_coverage">Event Shoot/Drone coverage</option>
                      <option value="restaurant_shoot">Restaurant Shoot</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="inq-eventDate">Event Date (Optional)</label>
                    <input
                      id="inq-eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Venue / Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="inq-venue">Venue / Destination City (Optional)</label>
                  <input
                    id="inq-venue"
                    name="venue"
                    type="text"
                    placeholder="e.g. The Leela Palace, Udaipur"
                    value={formData.venue}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label" htmlFor="inq-message">Your Vision & Requirements *</label>
                  <textarea
                    id="inq-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about the schedule, expected guest count, special drone aerial requirements, or aesthetic preferences..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                {/* Submit button with Magnetic attraction */}
                <div style={{ marginTop: '10px' }}>
                  <MagneticButton maxOffset={10}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                    >
                      {isSubmitting ? (
                        'Transmitting Inquiry...'
                      ) : (
                        <>
                          Submit Inquiry <Send size={16} />
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </div>
              </form>
            )}
          </motion.div>

          {/* Direct Studio Contact Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Direct Channels */}
            <div
              className="glass-panel"
              style={{
                padding: '36px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(212, 162, 78, 0.15)',
              }}
            >
              <h3 style={{ fontSize: '20px', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
                Direct Inquiries
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(37, 211, 102, 0.12)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    color: '#4ade80',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'transform var(--duration-fast) var(--ease-hover)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <MessageCircle size={20} />
                  <span>Chat on WhatsApp (+91 77799 45787)</span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(212, 162, 78, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Phone size={17} color="var(--brand-gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Studio Line</div>
                    <a href="tel:+919876543210" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>+91 77799 45787</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '15px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(212, 162, 78, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mail size={17} color="var(--brand-gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Direct Concierge</div>
                    <a href="mailto:sky.pixel.view@gmail.com" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>sky.pixel.view@gmail.com</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '15px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(212, 162, 78, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <MapPin size={17} color="var(--brand-gold)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hubs</div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Pan-India & Global: Goa · Mumbai · Udaipur · Bengaluru · Dubai
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Turnaround Guarantee Badge */}
            <div
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(212, 162, 78, 0.2)',
                background: 'linear-gradient(135deg, rgba(212, 162, 78, 0.06), rgba(18, 14, 10, 0.8))',
              }}
            >
              <h4 style={{ fontSize: '15px', color: 'var(--brand-gold-bright)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--brand-gold)" />
                <span>24-Hour Calendar Confirmation</span>
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                We understand destination wedding venues and luxury launch dates fill quickly. Our lead cinematographers review and confirm calendar feasibility within 24 hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
