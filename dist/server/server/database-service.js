"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
// Database service layer for Azure SQL only
const db_1 = require("./db");
class DatabaseService {
    // Helper to ensure Azure SQL adapter is available
    static ensureAzureSQL() {
        if (!db_1.azureSqlAdapter) {
            throw new Error('Azure SQL adapter not initialized. Please check your Azure SQL configuration.');
        }
        return db_1.azureSqlAdapter;
    }
    // Financial Advisors
    static async getFinancialAdvisors() {
        return await this.ensureAzureSQL().getFinancialAdvisors();
    }
    static async getFinancialAdvisorById(id) {
        return await this.ensureAzureSQL().getFinancialAdvisorById(id);
    }
    static async createFinancialAdvisor(advisorData) {
        return await this.ensureAzureSQL().createFinancialAdvisor(advisorData);
    }
    // User Credentials
    static async getUserCredentialByUsername(username) {
        return await this.ensureAzureSQL().getUserCredentialByUsername(username);
    }
    static async createUserCredential(userCredData) {
        return await this.ensureAzureSQL().createUserCredential(userCredData);
    }
    static async updateUserLastLogin(id) {
        return await this.ensureAzureSQL().updateUserLastLogin(id);
    }
    // Provinces
    static async getProvinces() {
        if (db_1.dbConfig.type === 'azure-sql') {
            return await this.ensureAzureSQL().getProvinces();
        }
        else {
            // Return hardcoded provinces for development
            return [
                { id: 1, name: 'Eastern Cape', code: 'EC' },
                { id: 2, name: 'Free State', code: 'FS' },
                { id: 3, name: 'Gauteng', code: 'GP' },
                { id: 4, name: 'KwaZulu-Natal', code: 'KZN' },
                { id: 5, name: 'Limpopo', code: 'LIM' },
                { id: 6, name: 'Mpumalanga', code: 'MP' },
                { id: 7, name: 'North West', code: 'NW' },
                { id: 8, name: 'Northern Cape', code: 'NC' },
                { id: 9, name: 'Western Cape', code: 'WC' }
            ];
        }
    }
    static async createProvince(province) {
        return await this.ensureAzureSQL().createProvince(province);
    }
    // Customers
    static async getCustomers() {
        return await this.ensureAzureSQL().getCustomers();
    }
    static async createCustomer(customer) {
        return await this.ensureAzureSQL().createCustomer(customer);
    }
    static async getCustomerById(id) {
        // TODO: Implement getCustomerById in Azure SQL adapter
        throw new Error('getCustomerById not yet implemented for Azure SQL mode');
    }
    static async updateCustomer(id, updateData) {
        return await this.ensureAzureSQL().updateCustomer(id, updateData);
    }
    // Marital Statuses
    static async getMaritalStatuses() {
        return await this.ensureAzureSQL().getMaritalStatuses();
    }
    static async createMaritalStatus(status) {
        return await this.ensureAzureSQL().createMaritalStatus(status);
    }
    // Preferred Languages
    static async getPreferredLanguages() {
        return await this.ensureAzureSQL().getPreferredLanguages();
    }
    static async createPreferredLanguage(language) {
        return await this.ensureAzureSQL().createPreferredLanguage(language);
    }
    // Policy Types
    static async getPolicyTypes() {
        return await this.ensureAzureSQL().getPolicyTypes();
    }
    static async createPolicyType(policyType) {
        // TODO: Implement createPolicyType in Azure SQL adapter
        throw new Error('createPolicyType not yet implemented for Azure SQL mode');
    }
    // Policies
    static async getPolicies() {
        return await this.ensureAzureSQL().getPolicies();
    }
    static async createPolicy(policy) {
        return await this.ensureAzureSQL().createPolicy(policy);
    }
    // Qualifications
    static async getQualifications() {
        return await this.ensureAzureSQL().getQualifications();
    }
    static async createQualification(qualification) {
        // TODO: Implement createQualification in Azure SQL adapter
        throw new Error('createQualification not yet implemented for Azure SQL mode');
    }
    // Bank Statements  
    static async createBankStatement(statement) {
        return await this.ensureAzureSQL().createBankStatement(statement);
    }
    static async getBankStatementsByCustomer(customerID) {
        return await this.ensureAzureSQL().getBankStatements(customerID);
    }
    static async getBankStatementById(id) {
        return await this.ensureAzureSQL().getBankStatementById(id);
    }
    // Bank Transactions
    static async getBankTransactionsByStatement(statementId) {
        // TODO: Implement getBankTransactionsByStatement in Azure SQL adapter
        throw new Error('getBankTransactionsByStatement not yet implemented for Azure SQL mode');
    }
    static async getBankTransactionsByCustomer(customerID, fromDate, toDate) {
        // TODO: Implement getBankTransactionsByCustomer in Azure SQL adapter
        throw new Error('getBankTransactionsByCustomer not yet implemented for Azure SQL mode');
    }
    static async getTransactionsByCategory(customerID, fromDate, toDate) {
        return await this.ensureAzureSQL().getTransactionsByCategory(customerID, fromDate, toDate);
    }
    // Transaction Categories
    static async getTransactionCategories() {
        // TODO: Implement getTransactionCategories in Azure SQL adapter
        return [];
    }
    static async createTransactionCategory(category) {
        // TODO: Implement createTransactionCategory in Azure SQL adapter
        return { id: 1, ...category };
    }
    // Transaction Summary and Analysis
    static async getTransactionSummary(customerID, fromDate, toDate) {
        return await this.ensureAzureSQL().getTransactionSummary(customerID, fromDate, toDate);
    }
    static async insertBankTransactions(transactions) {
        // TODO: Implement batch insert for bank transactions in Azure SQL adapter
        return { success: true, count: transactions.length };
    }
    static async updateBankStatementCompletion(statementId, totalIn, totalOut, netAmount, transactionCount) {
        // TODO: Implement update bank statement completion in Azure SQL adapter
        return { success: true };
    }
    static async updateBankStatementError(statementId, errorMessage) {
        // TODO: Implement update bank statement error in Azure SQL adapter
        return { success: true };
    }
    // Profile Management
    static async updateAdvisorProfile(userID, updateData) {
        return await this.ensureAzureSQL().updateAdvisorProfile(userID, updateData);
    }
    static async updateCustomerProfile(userID, updateData) {
        return await this.ensureAzureSQL().updateCustomerProfile(userID, updateData);
    }
    // Transaction Updates
    static async updateTransactionCategory(transactionId, categoryId) {
        // Note: Azure SQL adapter needs to implement this method
        throw new Error('Transaction category updates not yet implemented for Azure SQL mode');
    }
}
exports.DatabaseService = DatabaseService;
