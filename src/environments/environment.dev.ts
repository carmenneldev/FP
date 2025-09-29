export const environment = {
  production: false,
  apiUrl: 'https://4c78b2fc-0624-450f-87fa-d68904955935-00-13oubrciiekpk.worf.replit.dev:3001/api', // Direct backend connection
  appName: 'Flight Plan',
  database: {
    type: 'postgresql', // Neon PostgreSQL for development
    ssl: true,
    connectionTimeout: 15000,
    requestTimeout: 15000
  },
  azure: {
    appService: false,
    region: 'development'
  },
  features: {
    fileUpload: true,
    aiAnalysis: true,
    realTimeUpdates: true
  }
};