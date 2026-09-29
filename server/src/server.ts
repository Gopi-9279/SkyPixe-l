import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { connectDB, isDbConnected } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import instagramRoutes from './routes/instagramRoutes.js';
import showcaseRoutes from './routes/showcaseRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Skypixel REST API',
    database: isDbConnected ? 'connected' : 'memory_fallback',
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/showcase', showcaseRoutes);
app.use('/api/settings', settingsRoutes);

// Serve frontend in production
if (ENV.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  const PORT = Number(ENV.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 Skypixel Server running on http://localhost:${PORT}`);
    console.log(`🌐 Allowed Client URL: ${ENV.CLIENT_URL}`);
    console.log(`📡 Database mode: ${isDbConnected ? 'MongoDB Live' : 'Memory Store & Mock Sync'}`);
    console.log(`==============================================\n`);
  });
};

startServer();

export default app;
