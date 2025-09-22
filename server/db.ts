import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMssql } from 'drizzle-orm/node-postgres';
import * as sql from 'mssql';
import ws from "ws";
import * as schema from "../shared/schema";

// Environment-specific database configuration
interface DatabaseConfig {
  type: 'postgresql' | 'azure-sql';
  ssl: boolean;
  connectionTimeout: number;
  requestTimeout: number;
}

const getDatabaseConfig = (): DatabaseConfig => {
  const environment = process.env.NODE_ENV || 'development';
  const dbType = process.env.DB_TYPE || 'postgresql';
  
  if (environment === 'production' && dbType === 'azure-sql') {
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
console.log(`🗄️  Database configuration: ${dbConfig.type} (${process.env.NODE_ENV || 'development'})`);

// Database connection setup
let db: any;
let pool: any;

if (dbConfig.type === 'azure-sql' && process.env.NODE_ENV === 'production') {
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
      // Configure Azure SQL connection
      const azureConfig: sql.config = {
        server: process.env.AZURE_SQL_SERVER!,
        database: process.env.AZURE_SQL_DATABASE!,
        user: process.env.AZURE_SQL_USER!,
        password: process.env.AZURE_SQL_PASSWORD!,
        port: 1433,
        options: {
          encrypt: true, // Required for Azure SQL
          trustServerCertificate: false,
          enableArithAbort: true,
          requestTimeout: dbConfig.requestTimeout,
          connectionTimeout: dbConfig.connectionTimeout
        },
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        }
      };
      
      // Create connection pool
      pool = new sql.ConnectionPool(azureConfig);
      
      // Initialize connection
      pool.connect().then(() => {
        console.log('✅ Azure SQL Server database connection established');
      }).catch((err) => {
        console.error('❌ Azure SQL connection failed:', err);
        throw err;
      });
      
      // Note: For now, we'll continue using the PostgreSQL schema
      // In a full migration, you'd need to update the schema for SQL Server types
      console.log('⚠️  Using PostgreSQL schema with Azure SQL - schema migration needed for full compatibility');
      
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
  
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?"
    );
  }
  
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: dbConfig.connectionTimeout
  });
  
  db = drizzle({ client: pool, schema });
  
  console.log('✅ PostgreSQL database connection configured');
}

export { pool, db, dbConfig };

// Database health check function
export const checkDatabaseHealth = async () => {
  try {
    const result = await pool.query('SELECT 1 as health');
    return { status: 'healthy', type: dbConfig.type, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', type: dbConfig.type, error: error.message, timestamp: new Date().toISOString() };
  }
};