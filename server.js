const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration for production
const cors = require('cors');
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.AZURE_APP_URL]
    : ['http://localhost:4200', 'http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:3001'],
  credentials: true
}));

// Security middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve Angular static files from dist directory with cache headers
app.use(express.static(path.join(__dirname, 'dist/flight-plan/browser'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  cacheControl: true,
  immutable: process.env.NODE_ENV === 'production'
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load and use API routes
async function loadServerModule() {
  try {
    // Import the compiled server code or fallback to TypeScript version
    let serverModule;
    try {
      serverModule = require('./dist/server/server/index.js');
    } catch (err) {
      console.log('Using TypeScript server for development...');
      require('tsx/cjs');
      serverModule = require('./server/index.ts');
    }
    
    // Wait for initialization to complete before mounting routes
    if (serverModule && serverModule.initializationPromise) {
      console.log('⏳ Waiting for server initialization to complete...');
      await serverModule.initializationPromise;
      console.log('✅ Server initialization completed successfully');
    }
    
    // If the server module exports routes, use them
    if (serverModule && serverModule.router) {
      // Mount the API router at root - routes already have /api prefix
      app.use('/', serverModule.router);
      console.log('✅ API routes loaded and mounted at root (routes have /api prefix)');
    } else {
      console.log('Server module loaded but no router found. API routes should be defined in server/index.ts');
    }
    
    return true;
  } catch (error) {
    console.error('Error loading server module:', error);
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Production deployment failed - API module could not be loaded');
      process.exit(1);
    }
    
    // Development fallback: serve a basic API status endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ERROR', 
        message: 'Server running but API routes not loaded',
        error: error.message,
        timestamp: new Date().toISOString() 
      });
    });
    
    return false;
  }
}

// Start server after initialization
async function startServer() {
  const success = await loadServerModule();
  
  if (!success && process.env.NODE_ENV === 'production') {
    process.exit(1);
  }

// Angular routing fallback - serve index.html for all non-API routes
// Use regex pattern to avoid path-to-regexp conflicts
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/flight-plan/browser/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 FlightPlan server running on port ${port}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist/flight-plan')}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`🔗 App URL: ${process.env.AZURE_APP_URL || 'Not set'}`);
    } else {
      console.log(`🔗 Local URL: http://localhost:${port}`);
    }
  });
}

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;