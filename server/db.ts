import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { AzureSQLAdapter } from './azure-sql-adapter';

// Environment-specific database configuration
interface DatabaseConfig {
  type: 'postgresql' | 'azure-sql';
  ssl: boolean;
  connectionTimeout: number;
  requestTimeout: number;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const environment = process.env['NODE_ENV'] || 'development';
  const dbType = process.env['DB_TYPE'] || 'postgresql';
  
  // Allow Azure SQL mode when explicitly requested via DB_TYPE
  if (dbType === 'azure-sql') {
    return {
      type: 'azure-sql',
      ssl: true,
      connectionTimeout: 30000,
      requestTimeout: 30000
    };
  }
  
  return {
    type: 'postgresql',
    ssl: true,
    connectionTimeout: 15000,
    requestTimeout: 15000
  };
};

const dbConfig = getDatabaseConfig();
console.log(`🗄️  Database configuration: ${dbConfig.type} (${process.env['NODE_ENV'] || 'development'})`);

// Database connection setup
let db: any;
let pool: any;
let azureSqlAdapter: AzureSQLAdapter | null = null;

if (dbConfig.type === 'azure-sql') {
  // Azure SQL Server configuration for production
  console.log('🔄 Configuring Azure SQL Server database connection...');
  
  // Validate Azure SQL environment variables
  const requiredAzureVars = ['AZURE_SQL_SERVER', 'AZURE_SQL_DATABASE', 'AZURE_SQL_USER', 'AZURE_SQL_PASSWORD'];
  const missingVars = requiredAzureVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Azure SQL configuration incomplete. Missing: ${missingVars.join(', ')}`);
    console.log('🔄 Falling back to PostgreSQL configuration...');
  } else {
    try {
      // Create Azure SQL adapter instance
      azureSqlAdapter = new AzureSQLAdapter({
        server: process.env['AZURE_SQL_SERVER']!,
        database: process.env['AZURE_SQL_DATABASE']!,
        user: process.env['AZURE_SQL_USER']!,
        password: process.env['AZURE_SQL_PASSWORD']!,
        port: 1433,
        connectionTimeout: dbConfig.connectionTimeout,
        requestTimeout: dbConfig.requestTimeout
      });
      
      // Initialize connection with proper async handling
      // Note: Connection will be established before serving requests in production
      console.log('⏳ Azure SQL adapter created, will connect during server startup');
      
      // Set db to the adapter for consistent interface
      db = azureSqlAdapter;
      console.log('✅ Azure SQL database configured with custom adapter');
      
    } catch (error) {
      console.error('❌ Azure SQL setup failed:', error);
      throw error;
    }
  }
}

// PostgreSQL configuration (default for development and current production)
if (!db) {
  console.log('🔄 Configuring PostgreSQL database connection...');
  
  neonConfig.webSocketConstructor = ws;
  
  if (!process.env['DATABASE_URL']) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
  
  pool = new Pool({ 
    connectionString: process.env['DATABASE_URL'],
    connectionTimeoutMillis: dbConfig.connectionTimeout
  });
  
  db = drizzle({ client: pool, schema });
  
  console.log('✅ PostgreSQL database connection configured');
}

export { pool, db, dbConfig, azureSqlAdapter };

// Initialize Azure SQL connection for production
export const initializeAzureSQL = async () => {
  if (azureSqlAdapter && dbConfig.type === 'azure-sql') {
    console.log('🔄 Connecting to Azure SQL Database...');
    await azureSqlAdapter.connect();
    console.log('✅ Azure SQL Database connected successfully');
  }
};

// Database health check function
export const checkDatabaseHealth = async () => {
  try {
    if (azureSqlAdapter) {
      // Use Azure SQL adapter health check
      const result = await azureSqlAdapter.healthCheck();
      return { type: dbConfig.type, ...result };
    } else {
      // Use PostgreSQL pool health check
      const result = await pool.query('SELECT 1 as health');
      return { status: 'healthy', type: dbConfig.type, timestamp: new Date().toISOString() };
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', type: dbConfig.type, error: (error as Error).message, timestamp: new Date().toISOString() };
  }
};