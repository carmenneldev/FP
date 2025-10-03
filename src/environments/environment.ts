export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  appName: 'Flight Plan',
  database: {
    type: 'postgresql',
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
