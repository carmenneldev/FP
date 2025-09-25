// Database service layer to abstract between PostgreSQL (Drizzle) and Azure SQL (Custom Adapter)
import { db, azureSqlAdapter, dbConfig } from './db';
import { 
  financialAdvisors, 
  userCredentials, 
  provinces,
  customers,
  maritalStatuses,
  preferredLanguages,
  policyTypes,
  policies,
  qualifications,
  bankStatements,
  bankTransactions,
  transactionCategories,
  type InsertFinancialAdvisor,
  type InsertUserCredential,
  type InsertBankStatement,
  type InsertBankTransaction
} from '../shared/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';

// Check if using Azure SQL
const isAzureSQL = () => azureSqlAdapter !== null;

export class DatabaseService {
  // Financial Advisors
  static async getFinancialAdvisors() {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getFinancialAdvisors();
    }
    return await db.select().from(financialAdvisors);
  }

  static async getFinancialAdvisorById(id: number) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getFinancialAdvisorById(id);
    }
    const [advisor] = await db
      .select()
      .from(financialAdvisors)
      .where(eq(financialAdvisors.id, id));
    return advisor || null;
  }

  static async createFinancialAdvisor(advisorData: InsertFinancialAdvisor) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createFinancialAdvisor(advisorData);
    }
    const [newAdvisor] = await db
      .insert(financialAdvisors)
      .values(advisorData)
      .returning();
    return newAdvisor;
  }

  // User Credentials
  static async getUserCredentialByUsername(username: string) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getUserCredentialByUsername(username);
    }
    const [userCred] = await db
      .select()
      .from(userCredentials)
      .where(eq(userCredentials.username, username));
    return userCred || null;
  }

  static async createUserCredential(userCredData: InsertUserCredential) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createUserCredential(userCredData);
    }
    const [newUserCred] = await db
      .insert(userCredentials)
      .values(userCredData)
      .returning();
    const { passwordHash, ...userCredWithoutPassword } = newUserCred;
    return userCredWithoutPassword;
  }

  static async updateUserLastLogin(id: number) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.updateUserLastLogin(id);
    }
    await db
      .update(userCredentials)
      .set({ lastLogin: new Date() })
      .where(eq(userCredentials.id, id));
  }

  // Provinces
  static async getProvinces() {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getProvinces();
    }
    return await db.select().from(provinces);
  }

  static async createProvince(province: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createProvince(province);
    }
    const [newProvince] = await db
      .insert(provinces)
      .values(province)
      .returning();
    return newProvince;
  }

  // Customers
  static async getCustomers() {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getCustomers();
    }
    return await db.query.customers.findMany({
      with: {
        maritalStatus: true,
        preferredLanguage: true,
        province: true,
        qualification: true
      }
    });
  }

  static async createCustomer(customer: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createCustomer(customer);
    }
    const [newCustomer] = await db
      .insert(customers)
      .values(customer)
      .returning();
    return newCustomer;
  }

  static async updateCustomer(id: number, updateData: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.updateCustomer(id, updateData);
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
      return await azureSqlAdapter!.getMaritalStatuses();
    }
    return await db.select().from(maritalStatuses);
  }

  static async createMaritalStatus(status: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createMaritalStatus(status);
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
      return await azureSqlAdapter!.getPreferredLanguages();
    }
    return await db.select().from(preferredLanguages);
  }

  static async createPreferredLanguage(language: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createPreferredLanguage(language);
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
      return await azureSqlAdapter!.getPolicyTypes();
    }
    return await db.select().from(policyTypes);
  }

  // Policies
  static async getPolicies() {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getPolicies();
    }
    return await db.select().from(policies);
  }

  static async createPolicy(policy: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createPolicy(policy);
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
      return await azureSqlAdapter!.getQualifications();
    }
    return await db.select().from(qualifications);
  }

  // Bank Statements
  static async getBankStatements(customerID: number) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getBankStatements(customerID);
    }
    return await db.query.bankStatements.findMany({
      where: eq(bankStatements.customerID, customerID),
      orderBy: desc(bankStatements.uploadedAt)
    });
  }

  static async getBankStatementById(id: number) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getBankStatementById(id);
    }
    return await db.query.bankStatements.findFirst({
      where: eq(bankStatements.id, id)
    });
  }

  static async createBankStatement(statementData: InsertBankStatement) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.createBankStatement(statementData);
    }
    const [newStatement] = await db
      .insert(bankStatements)
      .values(statementData)
      .returning();
    return newStatement;
  }

  // Transaction Summary and Analytics
  static async getTransactionSummary(customerID: number, fromDate?: string, toDate?: string) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getTransactionSummary(customerID, fromDate, toDate);
    }

    let whereConditions = [eq(bankTransactions.customerID, customerID)];
    
    if (fromDate) whereConditions.push(gte(bankTransactions.txnDate, new Date(fromDate)));
    if (toDate) whereConditions.push(lte(bankTransactions.txnDate, new Date(toDate)));

    const totals = await db
      .select({
        totalIn: sql<number>`SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END)`,
        totalOut: sql<number>`SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END)`,
        totalTransactions: sql<number>`COUNT(*)`
      })
      .from(bankTransactions)
      .where(and(...whereConditions));

    return totals[0] || { totalIn: 0, totalOut: 0, totalTransactions: 0 };
  }

  static async getTransactionsByCategory(customerID: number, fromDate?: string, toDate?: string) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.getTransactionsByCategory(customerID, fromDate, toDate);
    }

    let whereConditions = [eq(bankTransactions.customerID, customerID)];
    
    if (fromDate) whereConditions.push(gte(bankTransactions.txnDate, new Date(fromDate)));
    if (toDate) whereConditions.push(lte(bankTransactions.txnDate, new Date(toDate)));

    return await db
      .select({
        categoryId: bankTransactions.categoryID,
        categoryName: transactionCategories.name,
        total: sql<number>`SUM(amount)`,
        count: sql<number>`COUNT(*)`
      })
      .from(bankTransactions)
      .leftJoin(transactionCategories, eq(bankTransactions.categoryID, transactionCategories.id))
      .where(and(...whereConditions))
      .groupBy(bankTransactions.categoryID, transactionCategories.name)
      .orderBy(desc(sql`SUM(amount)`));
  }

  // Profile Management
  static async updateAdvisorProfile(userID: number, updateData: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.updateAdvisorProfile(userID, updateData);
    }
    const [updated] = await db
      .update(financialAdvisors)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(financialAdvisors.id, userID))
      .returning();
    return updated;
  }

  static async updateCustomerProfile(userID: number, updateData: any) {
    if (isAzureSQL()) {
      return await azureSqlAdapter!.updateCustomerProfile(userID, updateData);
    }
    const [updated] = await db
      .update(customers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(customers.id, userID))
      .returning();
    return updated;
  }

  // Transaction Category Updates
  static async updateTransactionCategory(transactionId: number, categoryId: number) {
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
  static async insertBankTransactions(transactions: InsertBankTransaction[]) {
    if (isAzureSQL()) {
      // TODO: Implement insertBankTransactions in AzureSQLAdapter
      throw new Error('Bank transaction insertion not yet implemented for Azure SQL mode');
    }
    return await db.insert(bankTransactions).values(transactions);
  }

  // Statement Status Updates
  static async updateBankStatementCompletion(
    statementId: number, 
    totalIn: string, 
    totalOut: string, 
    netAmount: string, 
    transactionCount: number
  ) {
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

  static async updateBankStatementError(statementId: number, error: string) {
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