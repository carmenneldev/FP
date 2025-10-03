export const environment = {
  production: false,
  apiUrl: '/api',
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
