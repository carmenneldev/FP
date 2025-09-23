const express = require('express');
const app = express();
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;

console.log('🔍 Debug: Starting minimal server...');
console.log('🔍 Debug: PORT =', port);
console.log('🔍 Debug: NODE_ENV =', process.env.NODE_ENV);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Debug server running on port ${port}`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
});