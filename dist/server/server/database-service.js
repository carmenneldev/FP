"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
// Database service layer to abstract between PostgreSQL (Drizzle) and Azure SQL (Custom Adapter)
const db_1 = require("./db");
const schema_1 = require("../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Check if using Azure SQL
const isAzureSQL = () => db_1.azureSqlAdapter !== null;
class DatabaseService {
    // Financial Advisors
    static async getFinancialAdvisors() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getFinancialAdvisors();
        }
        return await db_1.db.select().from(schema_1.financialAdvisors);
    }
    static async getFinancialAdvisorById(id) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getFinancialAdvisorById(id);
        }
        const [advisor] = await db_1.db
            .select()
            .from(schema_1.financialAdvisors)
            .where((0, drizzle_orm_1.eq)(schema_1.financialAdvisors.id, id));
        return advisor || null;
    }
    static async createFinancialAdvisor(advisorData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createFinancialAdvisor(advisorData);
        }
        const [newAdvisor] = await db_1.db
            .insert(schema_1.financialAdvisors)
            .values(advisorData)
            .returning();
        return newAdvisor;
    }
    // User Credentials
    static async getUserCredentialByUsername(username) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getUserCredentialByUsername(username);
        }
        const [userCred] = await db_1.db
            .select()
            .from(schema_1.userCredentials)
            .where((0, drizzle_orm_1.eq)(schema_1.userCredentials.username, username));
        return userCred || null;
    }
    static async createUserCredential(userCredData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createUserCredential(userCredData);
        }
        const [newUserCred] = await db_1.db
            .insert(schema_1.userCredentials)
            .values(userCredData)
            .returning();
        const { passwordHash, ...userCredWithoutPassword } = newUserCred;
        return userCredWithoutPassword;
    }
    static async updateUserLastLogin(id) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateUserLastLogin(id);
        }
        await db_1.db
            .update(schema_1.userCredentials)
            .set({ lastLogin: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.userCredentials.id, id));
    }
    // Provinces
    static async getProvinces() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getProvinces();
        }
        return await db_1.db.select().from(schema_1.provinces);
    }
    static async createProvince(province) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createProvince(province);
        }
        const [newProvince] = await db_1.db
            .insert(schema_1.provinces)
            .values(province)
            .returning();
        return newProvince;
    }
    // Customers
    static async getCustomers() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getCustomers();
        }
        return await db_1.db.query.customers.findMany({
            with: {
                maritalStatus: true,
                preferredLanguage: true,
                province: true,
                qualification: true
            }
        });
    }
    static async createCustomer(customer) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createCustomer(customer);
        }
        const [newCustomer] = await db_1.db
            .insert(schema_1.customers)
            .values(customer)
            .returning();
        return newCustomer;
    }
    static async updateCustomer(id, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateCustomer(id, updateData);
        }
        const [updatedCustomer] = await db_1.db
            .update(schema_1.customers)
            .set({ ...updateData, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.customers.id, id))
            .returning();
        return updatedCustomer;
    }
    // Marital Statuses
    static async getMaritalStatuses() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getMaritalStatuses();
        }
        return await db_1.db.select().from(schema_1.maritalStatuses);
    }
    static async createMaritalStatus(status) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createMaritalStatus(status);
        }
        const [newStatus] = await db_1.db
            .insert(schema_1.maritalStatuses)
            .values(status)
            .returning();
        return newStatus;
    }
    // Preferred Languages
    static async getPreferredLanguages() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPreferredLanguages();
        }
        return await db_1.db.select().from(schema_1.preferredLanguages);
    }
    static async createPreferredLanguage(language) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createPreferredLanguage(language);
        }
        const [newLanguage] = await db_1.db
            .insert(schema_1.preferredLanguages)
            .values(language)
            .returning();
        return newLanguage;
    }
    // Policy Types
    static async getPolicyTypes() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPolicyTypes();
        }
        return await db_1.db.select().from(schema_1.policyTypes);
    }
    // Policies
    static async getPolicies() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getPolicies();
        }
        return await db_1.db.select().from(schema_1.policies);
    }
    static async createPolicy(policy) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createPolicy(policy);
        }
        const [newPolicy] = await db_1.db
            .insert(schema_1.policies)
            .values(policy)
            .returning();
        return newPolicy;
    }
    // Qualifications
    static async getQualifications() {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getQualifications();
        }
        return await db_1.db.select().from(schema_1.qualifications);
    }
    // Bank Statements
    static async getBankStatements(customerID) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getBankStatements(customerID);
        }
        return await db_1.db.query.bankStatements.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.bankStatements.customerID, customerID),
            orderBy: (0, drizzle_orm_1.desc)(schema_1.bankStatements.uploadedAt)
        });
    }
    static async getBankStatementById(id) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getBankStatementById(id);
        }
        return await db_1.db.query.bankStatements.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.bankStatements.id, id)
        });
    }
    static async createBankStatement(statementData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.createBankStatement(statementData);
        }
        const [newStatement] = await db_1.db
            .insert(schema_1.bankStatements)
            .values(statementData)
            .returning();
        return newStatement;
    }
    // Transaction Summary and Analytics
    static async getTransactionSummary(customerID, fromDate, toDate) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getTransactionSummary(customerID, fromDate, toDate);
        }
        let whereConditions = [(0, drizzle_orm_1.eq)(schema_1.bankTransactions.customerID, customerID)];
        if (fromDate)
            whereConditions.push((0, drizzle_orm_1.gte)(schema_1.bankTransactions.txnDate, new Date(fromDate)));
        if (toDate)
            whereConditions.push((0, drizzle_orm_1.lte)(schema_1.bankTransactions.txnDate, new Date(toDate)));
        const totals = await db_1.db
            .select({
            totalIn: (0, drizzle_orm_1.sql) `SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END)`,
            totalOut: (0, drizzle_orm_1.sql) `SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END)`,
            totalTransactions: (0, drizzle_orm_1.sql) `COUNT(*)`
        })
            .from(schema_1.bankTransactions)
            .where((0, drizzle_orm_1.and)(...whereConditions));
        return totals[0] || { totalIn: 0, totalOut: 0, totalTransactions: 0 };
    }
    static async getTransactionsByCategory(customerID, fromDate, toDate) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.getTransactionsByCategory(customerID, fromDate, toDate);
        }
        let whereConditions = [(0, drizzle_orm_1.eq)(schema_1.bankTransactions.customerID, customerID)];
        if (fromDate)
            whereConditions.push((0, drizzle_orm_1.gte)(schema_1.bankTransactions.txnDate, new Date(fromDate)));
        if (toDate)
            whereConditions.push((0, drizzle_orm_1.lte)(schema_1.bankTransactions.txnDate, new Date(toDate)));
        return await db_1.db
            .select({
            categoryId: schema_1.bankTransactions.categoryID,
            categoryName: schema_1.transactionCategories.name,
            total: (0, drizzle_orm_1.sql) `SUM(amount)`,
            count: (0, drizzle_orm_1.sql) `COUNT(*)`
        })
            .from(schema_1.bankTransactions)
            .leftJoin(schema_1.transactionCategories, (0, drizzle_orm_1.eq)(schema_1.bankTransactions.categoryID, schema_1.transactionCategories.id))
            .where((0, drizzle_orm_1.and)(...whereConditions))
            .groupBy(schema_1.bankTransactions.categoryID, schema_1.transactionCategories.name)
            .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `SUM(amount)`));
    }
    // Profile Management
    static async updateAdvisorProfile(userID, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateAdvisorProfile(userID, updateData);
        }
        const [updated] = await db_1.db
            .update(schema_1.financialAdvisors)
            .set({ ...updateData, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.financialAdvisors.id, userID))
            .returning();
        return updated;
    }
    static async updateCustomerProfile(userID, updateData) {
        if (isAzureSQL()) {
            return await db_1.azureSqlAdapter.updateCustomerProfile(userID, updateData);
        }
        const [updated] = await db_1.db
            .update(schema_1.customers)
            .set({ ...updateData, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.customers.id, userID))
            .returning();
        return updated;
    }
    // Transaction Category Updates
    static async updateTransactionCategory(transactionId, categoryId) {
        if (isAzureSQL()) {
            // TODO: Implement updateTransactionCategory in AzureSQLAdapter
            throw new Error('Transaction category updates not yet implemented for Azure SQL mode');
        }
        return await db_1.db.update(schema_1.bankTransactions)
            .set({
            categoryID: categoryId,
            isManualOverride: true,
            confidence: '1.0000',
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.bankTransactions.id, transactionId));
    }
    // Bulk Transaction Insert
    static async insertBankTransactions(transactions) {
        if (isAzureSQL()) {
            // TODO: Implement insertBankTransactions in AzureSQLAdapter
            throw new Error('Bank transaction insertion not yet implemented for Azure SQL mode');
        }
        return await db_1.db.insert(schema_1.bankTransactions).values(transactions);
    }
    // Statement Status Updates
    static async updateBankStatementCompletion(statementId, totalIn, totalOut, netAmount, transactionCount) {
        if (isAzureSQL()) {
            // TODO: Implement updateBankStatementCompletion in AzureSQLAdapter
            throw new Error('Bank statement completion updates not yet implemented for Azure SQL mode');
        }
        return await db_1.db.update(schema_1.bankStatements)
            .set({
            uploadStatus: 'completed',
            totalIn,
            totalOut,
            netAmount,
            transactionCount,
            processedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(schema_1.bankStatements.id, statementId));
    }
    static async updateBankStatementError(statementId, error) {
        if (isAzureSQL()) {
            // TODO: Implement updateBankStatementError in AzureSQLAdapter
            throw new Error('Bank statement error updates not yet implemented for Azure SQL mode');
        }
        return await db_1.db.update(schema_1.bankStatements)
            .set({
            uploadStatus: 'failed',
            error
        })
            .where((0, drizzle_orm_1.eq)(schema_1.bankStatements.id, statementId));
    }
}
exports.DatabaseService = DatabaseService;
