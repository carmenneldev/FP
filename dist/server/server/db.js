"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.initializeAzureSQL = exports.azureSqlAdapter = exports.dbConfig = exports.db = exports.pool = void 0;
const tslib_1 = require("tslib");
const serverless_1 = require("@neondatabase/serverless");
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const ws_1 = tslib_1.__importDefault(require("ws"));
const schema = tslib_1.__importStar(require("../shared/schema"));
const azure_sql_adapter_1 = require("./azure-sql-adapter");
const getDatabaseConfig = () => {
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
exports.dbConfig = dbConfig;
console.log(`🗄️  Database configuration: ${dbConfig.type} (${process.env['NODE_ENV'] || 'development'})`);
// Database connection setup
let db;
let pool;
let azureSqlAdapter = null;
exports.azureSqlAdapter = azureSqlAdapter;
if (dbConfig.type === 'azure-sql') {
    // Azure SQL Server configuration for production
    console.log('🔄 Configuring Azure SQL Server database connection...');
    // Validate Azure SQL environment variables
    const requiredAzureVars = ['AZURE_SQL_SERVER', 'AZURE_SQL_DATABASE', 'AZURE_SQL_USER', 'AZURE_SQL_PASSWORD'];
    const missingVars = requiredAzureVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.warn(`⚠️  Azure SQL configuration incomplete. Missing: ${missingVars.join(', ')}`);
        console.log('🔄 Falling back to PostgreSQL configuration...');
    }
    else {
        try {
            // Create Azure SQL adapter instance
            exports.azureSqlAdapter = azureSqlAdapter = new azure_sql_adapter_1.AzureSQLAdapter({
                server: process.env['AZURE_SQL_SERVER'],
                database: process.env['AZURE_SQL_DATABASE'],
                user: process.env['AZURE_SQL_USER'],
                password: process.env['AZURE_SQL_PASSWORD'],
                port: 1433,
                connectionTimeout: dbConfig.connectionTimeout,
                requestTimeout: dbConfig.requestTimeout
            });
            // Initialize connection with proper async handling
            // Note: Connection will be established before serving requests in production
            console.log('⏳ Azure SQL adapter created, will connect during server startup');
            // Set db to the adapter for consistent interface
            exports.db = db = azureSqlAdapter;
            console.log('✅ Azure SQL database configured with custom adapter');
        }
        catch (error) {
            console.error('❌ Azure SQL setup failed:', error);
            throw error;
        }
    }
}
// PostgreSQL configuration (default for development and current production)
if (!db) {
    console.log('🔄 Configuring PostgreSQL database connection...');
    serverless_1.neonConfig.webSocketConstructor = ws_1.default;
    if (!process.env['DATABASE_URL']) {
        throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    exports.pool = pool = new serverless_1.Pool({
        connectionString: process.env['DATABASE_URL'],
        connectionTimeoutMillis: dbConfig.connectionTimeout
    });
    exports.db = db = (0, neon_serverless_1.drizzle)({ client: pool, schema });
    console.log('✅ PostgreSQL database connection configured');
}
// Initialize Azure SQL connection for production
const initializeAzureSQL = async () => {
    if (azureSqlAdapter && dbConfig.type === 'azure-sql') {
        console.log('🔄 Connecting to Azure SQL Database...');
        await azureSqlAdapter.connect();
        console.log('✅ Azure SQL Database connected successfully');
    }
};
exports.initializeAzureSQL = initializeAzureSQL;
// Database health check function
const checkDatabaseHealth = async () => {
    try {
        if (azureSqlAdapter) {
            // Use Azure SQL adapter health check
            const result = await azureSqlAdapter.healthCheck();
            return { type: dbConfig.type, ...result };
        }
        else {
            // Use PostgreSQL pool health check
            const result = await pool.query('SELECT 1 as health');
            return { status: 'healthy', type: dbConfig.type, timestamp: new Date().toISOString() };
        }
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return { status: 'unhealthy', type: dbConfig.type, error: error.message, timestamp: new Date().toISOString() };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
