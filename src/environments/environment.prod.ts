export const environment = {
  production: true,
  apiUrl: '/api', // Relative URL for Azure App Service single-service deployment
  appName: 'Flight Plan',
  database: {
    type: 'azure-sql', // Azure SQL Database
    ssl: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    provider: 'mssql' // Microsoft SQL Server
  },
  azure: {
    appService: true,
    region: 'default'
  },
  features: {
    fileUpload: true,
    aiAnalysis: true,
    realTimeUpdates: false // Disable for initial deployment
  }
};