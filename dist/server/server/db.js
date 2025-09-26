"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.initializeAzureSQL = exports.azureSqlAdapter = exports.dbConfig = exports.db = void 0;
const azure_sql_adapter_1 = require("./azure-sql-adapter");
const getDatabaseConfig = () => {
    return {
        type: 'azure-sql',
        ssl: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    };
};
const dbConfig = getDatabaseConfig();
exports.dbConfig = dbConfig;
console.log(`🗄️  Database configuration: ${dbConfig.type} (${process.env['NODE_ENV'] || 'development'})`);
// Azure SQL Database connection setup
let db;
let azureSqlAdapter = null;
exports.azureSqlAdapter = azureSqlAdapter;
// Azure SQL Server configuration (only database supported)
console.log('🔄 Configuring Azure SQL Server database connection...');
// Validate Azure SQL environment variables
const requiredAzureVars = ['AZURE_SQL_SERVER', 'AZURE_SQL_DATABASE', 'AZURE_SQL_USER', 'AZURE_SQL_PASSWORD'];
const missingVars = requiredAzureVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error(`❌ Azure SQL configuration incomplete. Missing: ${missingVars.join(', ')}`);
    console.error('💡 Please set these environment variables in your Azure App Service:');
    missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    throw new Error(`Missing required Azure SQL environment variables: ${missingVars.join(', ')}`);
}
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
    console.log('⏳ Azure SQL adapter created, will connect during server startup');
    // Set db to the adapter for consistent interface
    exports.db = db = azureSqlAdapter;
    console.log('✅ Azure SQL database configured with custom adapter');
}
catch (error) {
    console.error('❌ Azure SQL setup failed:', error);
    throw error;
}
// Initialize Azure SQL connection
const initializeAzureSQL = async () => {
    if (azureSqlAdapter) {
        console.log('🔄 Connecting to Azure SQL Database...');
        await azureSqlAdapter.connect();
        console.log('✅ Azure SQL Database connected successfully');
    }
};
exports.initializeAzureSQL = initializeAzureSQL;
// Database health check function (Azure SQL only)
const checkDatabaseHealth = async () => {
    try {
        if (!azureSqlAdapter) {
            throw new Error('Azure SQL adapter not initialized');
        }
        // Use Azure SQL adapter health check
        const result = await azureSqlAdapter.healthCheck();
        return { type: dbConfig.type, ...result };
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return { status: 'unhealthy', type: dbConfig.type, error: error.message, timestamp: new Date().toISOString() };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
