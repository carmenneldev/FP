// Database service layer for Azure SQL only
import { azureSqlAdapter, dbConfig } from './db';
import type { 
  InsertFinancialAdvisor,
  InsertUserCredential,
  InsertBankStatement,
  InsertBankTransaction
} from '../shared/schema';

export class DatabaseService {
  // Helper to ensure Azure SQL adapter is available
  private static ensureAzureSQL() {
    if (!azureSqlAdapter) {
      throw new Error('Azure SQL adapter not initialized. Please check your Azure SQL configuration.');
    }
    return azureSqlAdapter;
  }

  // Financial Advisors
  static async getFinancialAdvisors() {
    return await this.ensureAzureSQL().getFinancialAdvisors();
  }

  static async getFinancialAdvisorById(id: number) {
    return await this.ensureAzureSQL().getFinancialAdvisorById(id);
  }

  static async createFinancialAdvisor(advisorData: InsertFinancialAdvisor) {
    return await this.ensureAzureSQL().createFinancialAdvisor(advisorData);
  }

  // User Credentials
  static async getUserCredentialByUsername(username: string) {
    return await this.ensureAzureSQL().getUserCredentialByUsername(username);
  }

  static async createUserCredential(userCredData: InsertUserCredential) {
    return await this.ensureAzureSQL().createUserCredential(userCredData);
  }

  static async updateUserLastLogin(id: number) {
    return await this.ensureAzureSQL().updateUserLastLogin(id);
  }

  // Provinces
  static async getProvinces() {
    if (dbConfig.type === 'azure-sql') {
      return await this.ensureAzureSQL().getProvinces();
    } else {
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

  static async createProvince(province: any) {
    return await this.ensureAzureSQL().createProvince(province);
  }

  // Customers
  static async getCustomers(advisorId?: number) {
    return await this.ensureAzureSQL().getCustomers(advisorId);
  }

  static async createCustomer(customer: any) {
    return await this.ensureAzureSQL().createCustomer(customer);
  }

  static async getCustomerById(id: number) {
    // TODO: Implement getCustomerById in Azure SQL adapter
    throw new Error('getCustomerById not yet implemented for Azure SQL mode');
  }

  static async updateCustomer(id: number, updateData: any) {
    return await this.ensureAzureSQL().updateCustomer(id, updateData);
  }

  // Marital Statuses
  static async getMaritalStatuses() {
    return await this.ensureAzureSQL().getMaritalStatuses();
  }

  static async createMaritalStatus(status: any) {
    return await this.ensureAzureSQL().createMaritalStatus(status);
  }

  // Preferred Languages
  static async getPreferredLanguages() {
    return await this.ensureAzureSQL().getPreferredLanguages();
  }

  static async createPreferredLanguage(language: any) {
    return await this.ensureAzureSQL().createPreferredLanguage(language);
  }

  // Policy Types
  static async getPolicyTypes() {
    return await this.ensureAzureSQL().getPolicyTypes();
  }

  static async createPolicyType(policyType: any) {
    // TODO: Implement createPolicyType in Azure SQL adapter
    throw new Error('createPolicyType not yet implemented for Azure SQL mode');
  }

  // Policies
  static async getPolicies() {
    return await this.ensureAzureSQL().getPolicies();
  }

  static async createPolicy(policy: any) {
    return await this.ensureAzureSQL().createPolicy(policy);
  }

  // Qualifications
  static async getQualifications() {
    return await this.ensureAzureSQL().getQualifications();
  }

  static async createQualification(qualification: any) {
    // TODO: Implement createQualification in Azure SQL adapter
    throw new Error('createQualification not yet implemented for Azure SQL mode');
  }

  // Bank Statements  
  static async createBankStatement(statement: InsertBankStatement) {
    return await this.ensureAzureSQL().createBankStatement(statement);
  }

  static async getBankStatementsByCustomer(customerID: number) {
    return await this.ensureAzureSQL().getBankStatements(customerID);
  }

  static async getBankStatementById(id: number) {
    return await this.ensureAzureSQL().getBankStatementById(id);
  }


  // Bank Transactions
  static async getBankTransactionsByStatement(statementId: number) {
    // TODO: Implement getBankTransactionsByStatement in Azure SQL adapter
    throw new Error('getBankTransactionsByStatement not yet implemented for Azure SQL mode');
  }

  static async getBankTransactionsByCustomer(customerID: number, fromDate?: string, toDate?: string) {
    // TODO: Implement getBankTransactionsByCustomer in Azure SQL adapter
    throw new Error('getBankTransactionsByCustomer not yet implemented for Azure SQL mode');
  }

  static async getTransactionsByCategory(customerID: number, fromDate?: string, toDate?: string) {
    return await this.ensureAzureSQL().getTransactionsByCategory(customerID, fromDate, toDate);
  }

  // Transaction Categories
  static async getTransactionCategories() {
    // TODO: Implement getTransactionCategories in Azure SQL adapter
    return [];
  }

  static async createTransactionCategory(category: any) {
    // TODO: Implement createTransactionCategory in Azure SQL adapter
    return { id: 1, ...category };
  }

  // Transaction Summary and Analysis
  static async getTransactionSummary(customerID: number, fromDate?: string, toDate?: string) {
    return await this.ensureAzureSQL().getTransactionSummary(customerID, fromDate, toDate);
  }

  static async insertBankTransactions(transactions: any[]) {
    return await this.ensureAzureSQL().insertBankTransactions(transactions);
  }

  static async updateBankStatementCompletion(statementId: number, totalIn: string, totalOut: string, netAmount: string, transactionCount: number) {
    return await this.ensureAzureSQL().updateBankStatementCompletion(statementId, totalIn, totalOut, netAmount, transactionCount);
  }

  static async updateBankStatementError(statementId: number, errorMessage: string) {
    return await this.ensureAzureSQL().updateBankStatementError(statementId, errorMessage);
  }

  // Profile Management
  static async updateAdvisorProfile(userID: number, updateData: any) {
    return await this.ensureAzureSQL().updateAdvisorProfile(userID, updateData);
  }

  static async updateCustomerProfile(userID: number, updateData: any) {
    return await this.ensureAzureSQL().updateCustomerProfile(userID, updateData);
  }

  // Transaction Updates
  static async updateTransactionCategory(transactionId: number, categoryId: number) {
    // Note: Azure SQL adapter needs to implement this method
    throw new Error('Transaction category updates not yet implemented for Azure SQL mode');
  }
}