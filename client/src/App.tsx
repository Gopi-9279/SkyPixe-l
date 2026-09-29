import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';

// Public Components & Pages
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { PortfolioPage } from './pages/PortfolioPage.js';
import { AlbumDetailPage } from './pages/AlbumDetailPage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { TeamPage } from './pages/TeamPage.js';
import { TestimonialsPage } from './pages/TestimonialsPage.js';
import { ContactPage } from './pages/ContactPage.js';

// Motion & FX Utilities
import { CustomCursor } from './components/common/CustomCursor.js';
import { RouteTransition } from './components/common/RouteTransition.js';

// Admin Components & Pages
import { AdminLayout } from './components/layout/AdminLayout.js';
import { LoginPage } from './admin/LoginPage.js';
import { DashboardPage } from './admin/DashboardPage.js';
import { AlbumsPage } from './admin/AlbumsPage.js';
import { AlbumMediaPage } from './admin/AlbumMediaPage.js';
import { InquiriesPage } from './admin/InquiriesPage.js';
import { SettingsAdminPage } from './admin/SettingsAdminPage.js';
import { TeamAdminPage } from './admin/TeamAdminPage.js';
import { TestimonialsAdminPage } from './admin/TestimonialsAdminPage.js';
import { ShowcaseAdminPage } from './admin/ShowcaseAdminPage.js';

// Public Shell Layout with Custom Cursor and Smooth Page Transition
const PublicLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomCursor />
      <Navbar />
      <main style={{ flex: 1 }}>
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/album/:slug" element={<AlbumDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login Route (Stand-alone Page) */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Management Interface (Isolated Shell - free of cinematic effects) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="albums/:id/media" element={<AlbumMediaPage />} />
            <Route path="showcase" element={<ShowcaseAdminPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
            <Route path="team" element={<TeamAdminPage />} />
            <Route path="testimonials" element={<TestimonialsAdminPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
