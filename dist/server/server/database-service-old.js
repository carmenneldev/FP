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
        return await this.ensureAzureSQL().getProvinces();
    }
    static async createProvince(province) {
        return await this.ensureAzureSQL().createProvince(province);
    }
    // Customers
    static async getCustomers() {
        return await this.ensureAzureSQL().getCustomers();
    }
    static async createCustomer(customer) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createCustomer(customer);
        }
        const [newCustomer] = await db
            .insert(customers)
            .values(customer)
            .returning();
        return newCustomer;
    }
    static async updateCustomer(id, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateCustomer(id, updateData);
        }
        const [updatedCustomer] = await db
            .update(customers)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(customers.id, id))
            .returning();
        return updatedCustomer;
    }
    // Marital Statuses
    static async getMaritalStatuses() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getMaritalStatuses();
        }
        return await db.select().from(maritalStatuses);
    }
    static async createMaritalStatus(status) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createMaritalStatus(status);
        }
        const [newStatus] = await db
            .insert(maritalStatuses)
            .values(status)
            .returning();
        return newStatus;
    }
    // Preferred Languages
    static async getPreferredLanguages() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPreferredLanguages();
        }
        return await db.select().from(preferredLanguages);
    }
    static async createPreferredLanguage(language) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createPreferredLanguage(language);
        }
        const [newLanguage] = await db
            .insert(preferredLanguages)
            .values(language)
            .returning();
        return newLanguage;
    }
    // Policy Types
    static async getPolicyTypes() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPolicyTypes();
        }
        return await db.select().from(policyTypes);
    }
    // Policies
    static async getPolicies() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPolicies();
        }
        return await db.select().from(policies);
    }
    static async createPolicy(policy) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createPolicy(policy);
        }
        const [newPolicy] = await db
            .insert(policies)
            .values(policy)
            .returning();
        return newPolicy;
    }
    // Qualifications
    static async getQualifications() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getQualifications();
        }
        return await db.select().from(qualifications);
    }
    // Bank Statements
    static async getBankStatements(customerID) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getBankStatements(customerID);
        }
        return await db.query.bankStatements.findMany({
            where: eq(bankStatements.customerID, customerID),
            orderBy: desc(bankStatements.uploadedAt)
        });
    }
    static async getBankStatementById(id) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getBankStatementById(id);
        }
        return await db.query.bankStatements.findFirst({
            where: eq(bankStatements.id, id)
        });
    }
    static async createBankStatement(statementData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createBankStatement(statementData);
        }
        const [newStatement] = await db
            .insert(bankStatements)
            .values(statementData)
            .returning();
        return newStatement;
    }
    // Transaction Summary and Analytics
    static async getTransactionSummary(customerID, fromDate, toDate) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getTransactionSummary(customerID, fromDate, toDate);
        }
        let whereConditions = [eq(bankTransactions.customerID, customerID)];
        if (fromDate)
            whereConditions.push(gte(bankTransactions.txnDate, new Date(fromDate)));
        if (toDate)
            whereConditions.push(lte(bankTransactions.txnDate, new Date(toDate)));
        const totals = await db
            .select({
            totalIn: sql `SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END)`,
            totalOut: sql `SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END)`,
            totalTransactions: sql `COUNT(*)`
        })
            .from(bankTransactions)
            .where(and(...whereConditions));
        return totals[0] || { totalIn: 0, totalOut: 0, totalTransactions: 0 };
    }
    static async getTransactionsByCategory(customerID, fromDate, toDate) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getTransactionsByCategory(customerID, fromDate, toDate);
        }
        let whereConditions = [eq(bankTransactions.customerID, customerID)];
        if (fromDate)
            whereConditions.push(gte(bankTransactions.txnDate, new Date(fromDate)));
        if (toDate)
            whereConditions.push(lte(bankTransactions.txnDate, new Date(toDate)));
        return await db
            .select({
            categoryId: bankTransactions.categoryID,
            categoryName: transactionCategories.name,
            total: sql `SUM(amount)`,
            count: sql `COUNT(*)`
        })
            .from(bankTransactions)
            .leftJoin(transactionCategories, eq(bankTransactions.categoryID, transactionCategories.id))
            .where(and(...whereConditions))
            .groupBy(bankTransactions.categoryID, transactionCategories.name)
            .orderBy(desc(sql `SUM(amount)`));
    }
    // Profile Management
    static async updateAdvisorProfile(userID, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateAdvisorProfile(userID, updateData);
        }
        const [updated] = await db
            .update(financialAdvisors)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(financialAdvisors.id, userID))
            .returning();
        return updated;
    }
    static async updateCustomerProfile(userID, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateCustomerProfile(userID, updateData);
        }
        const [updated] = await db
            .update(customers)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(customers.id, userID))
            .returning();
        return updated;
    }
    // Transaction Category Updates
    static async updateTransactionCategory(transactionId, categoryId) {
        if (isAzureSQL()) {
            // TODO: Implement updateTransactionCategory in AzureSQLAdapter
            throw new Error('Transaction category updates not yet implemented for Azure SQL mode');
        }
        return await db.update(bankTransactions)
            .set({
            categoryID: categoryId,
            isManualOverride: true,
            confidence: '1.0000',
            updatedAt: new Date()
        })
            .where(eq(bankTransactions.id, transactionId));
    }
    // Bulk Transaction Insert
    static async insertBankTransactions(transactions) {
        if (isAzureSQL()) {
            // TODO: Implement insertBankTransactions in AzureSQLAdapter
            throw new Error('Bank transaction insertion not yet implemented for Azure SQL mode');
        }
        return await db.insert(bankTransactions).values(transactions);
    }
    // Statement Status Updates
    static async updateBankStatementCompletion(statementId, totalIn, totalOut, netAmount, transactionCount) {
        if (isAzureSQL()) {
            // TODO: Implement updateBankStatementCompletion in AzureSQLAdapter
            throw new Error('Bank statement completion updates not yet implemented for Azure SQL mode');
        }
        return await db.update(bankStatements)
            .set({
            uploadStatus: 'completed',
            totalIn,
            totalOut,
            netAmount,
            transactionCount,
            processedAt: new Date()
        })
            .where(eq(bankStatements.id, statementId));
    }
    static async updateBankStatementError(statementId, error) {
        if (isAzureSQL()) {
            // TODO: Implement updateBankStatementError in AzureSQLAdapter
            throw new Error('Bank statement error updates not yet implemented for Azure SQL mode');
        }
        return await db.update(bankStatements)
            .set({
            uploadStatus: 'failed',
            error
        })
            .where(eq(bankStatements.id, statementId));
    }
}
exports.DatabaseService = DatabaseService;
