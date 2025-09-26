#!/usr/bin/env node
"use strict";
/**
 * Azure SQL Schema Debug Tool
 *
 * This script helps debug Azure SQL schema issues by:
 * 1. Testing database connection
 * 2. Checking if required tables exist
 * 3. Verifying table schema matches expectations
 * 4. Providing detailed error information
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugAzureSchema = debugAzureSchema;
const azure_sql_adapter_1 = require("./azure-sql-adapter");
async function debugAzureSchema() {
    console.log('🔍 Azure SQL Schema Debug Tool Starting...\n');
    // Check environment variables
    const requiredEnvVars = ['AZURE_SQL_SERVER', 'AZURE_SQL_DATABASE', 'AZURE_SQL_USER', 'AZURE_SQL_PASSWORD'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars);
        console.log('\n📝 Please set these environment variables in your Azure App Service:');
        missingVars.forEach(varName => {
            console.log(`   - ${varName}`);
        });
        return;
    }
    // Create database config
    const dbConfig = {
        server: process.env.AZURE_SQL_SERVER,
        database: process.env.AZURE_SQL_DATABASE,
        user: process.env.AZURE_SQL_USER,
        password: process.env.AZURE_SQL_PASSWORD,
        port: process.env.AZURE_SQL_PORT ? parseInt(process.env.AZURE_SQL_PORT) : 1433
    };
    console.log('🔗 Database Configuration:');
    console.log(`   Server: ${dbConfig.server}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Port: ${dbConfig.port}\n`);
    const adapter = new azure_sql_adapter_1.AzureSQLAdapter(dbConfig);
    try {
        // Test connection
        console.log('🔄 Testing database connection...');
        await adapter.connect();
        console.log('✅ Database connection successful\n');
        // Test health check
        console.log('🔄 Testing health check...');
        const health = await adapter.healthCheck();
        console.log('✅ Health check successful:', health);
        // Check if financialAdvisors table exists
        console.log('\n🔄 Checking financialAdvisors table...');
        try {
            const advisors = await adapter.getFinancialAdvisors();
            console.log(`✅ financialAdvisors table exists (${advisors.length} records found)`);
        }
        catch (error) {
            console.error('❌ financialAdvisors table issue:', error.message);
        }
        // Check if provinces table exists and has data
        console.log('\n🔄 Checking provinces table...');
        try {
            const provinces = await adapter.getProvinces();
            console.log(`✅ provinces table exists (${provinces.length} records found)`);
            if (provinces.length === 0) {
                console.warn('⚠️  provinces table is empty - this may cause foreign key constraint errors');
            }
        }
        catch (error) {
            console.error('❌ provinces table issue:', error.message);
        }
        // Test creating a sample advisor
        console.log('\n🔄 Testing advisor creation...');
        try {
            const testAdvisor = {
                firstName: 'Debug',
                surname: 'Test',
                identityNumber: '9999999999999',
                mobileNumber: '0999999999',
                emailAddress: 'debug@test.com',
                physicalAddress1: 'Debug Street',
                physicalAddress2: null,
                provinceID: 1,
                postalCode: '0000',
                fsca_Number: null
            };
            const result = await adapter.createFinancialAdvisor(testAdvisor);
            console.log('✅ Test advisor creation successful:', result.id);
            // Clean up test data
            await adapter.query('DELETE FROM financialAdvisors WHERE id = @id', { id: result.id });
            console.log('✅ Test data cleaned up');
        }
        catch (error) {
            console.error('❌ Test advisor creation failed:', error.message);
            console.error('Stack trace:', error.stack);
        }
    }
    catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
    finally {
        await adapter.disconnect();
    }
    console.log('\n🏁 Debug session completed');
}
// Run the debug script
if (require.main === module) {
    debugAzureSchema().catch(console.error);
}
