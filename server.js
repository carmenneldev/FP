// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;

// --- Health check first (configure App Service -> Health check -> /healthz) ---
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// --- Parsers ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- CORS (lenient in dev; explicit allowlist in prod) ---
const prodOrigins = [process.env.FRONTEND_URL, process.env.AZURE_APP_URL].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (process.env.NODE_ENV !== 'production') return cb(null, true);
    if (!origin || prodOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// --- Security headers ---
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// --- Static Angular app ---
const spaPath = path.join(__dirname, 'dist/flight-plan');
app.use(express.static(spaPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  cacheControl: true,
  immutable: process.env.NODE_ENV === 'production'
}));

// --- Uploaded files (optional) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Load compiled API routes if present (do NOT require tsx in prod) ---
let apiLoaded = false;
try {
  // Must exist if you've built your server code (e.g., tsc / tsup / esbuild)
  const serverModule = require('./dist/server/index.js');

  // Support various export styles: {router}, default router, or express app
  const router =
    (serverModule && serverModule.router) ||
    (serverModule && serverModule.default && serverModule.default.router) ||
    (serverModule && serverModule.default);

  if (router) {
    app.use('/', router);
    apiLoaded = true;
    console.log('✅ API routes loaded from dist/server/index.js');
  } else {
    console.warn('⚠️ dist/server/index.js loaded but no router exported.');
  }
} catch (e) {
  console.warn('⚠️ API build not found (dist/server/index.js). Serving SPA/static only.');
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'DEGRADED', api: false, reason: 'API build missing', time: new Date().toISOString() });
  });
}

// --- SPA fallback (after API/static) ---
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(path.join(spaPath, 'index.html'));
});

// --- Error handler ---
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start server on 0.0.0.0:8080 (Azure requires this) ---
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 FlightPlan server on ${port}`);
  console.log(`🌐 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 SPA dir: ${spaPath}`);
  if (!apiLoaded) console.log('ℹ️ API not loaded (dist/server missing).');
});

module.exports = app;
