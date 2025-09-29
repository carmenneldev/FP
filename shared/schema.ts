// Note: This schema file provides TypeScript types only for Azure SQL mode
// All Drizzle ORM table definitions are commented out since we use Azure SQL adapter

// TypeScript interfaces for Azure SQL mode
export interface FinancialAdvisor {
  id?: number;
  firstName: string;
  surname: string;
  identityNumber: string;
  mobileNumber: string;
  emailAddress: string;
  physicalAddress1: string;
  physicalAddress2?: string;
  provinceID: number;
  postalCode: string;
  fsca_Number?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCredential {
  id?: number;
  userType: string;
  userID: number;
  username: string;
  passwordHash: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Province {
  id?: number;
  name: string;
  abbreviation: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  id?: number;
  firstName: string;
  surname: string;
  identityNumber: string;
  mobileNumber: string;
  emailAddress: string;
  physicalAddress1: string;
  physicalAddress2?: string;
  provinceID: number;
  postalCode: string;
  dateOfBirth: Date;
  age?: number;
  maritalStatusID: number;
  preferredLanguageID: number;
  financialAdvisorID: number;
  profileImageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MaritalStatus {
  id?: number;
  name: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PreferredLanguage {
  id?: number;
  name: string;
  languageCode: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PolicyType {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Policy {
  id?: number;
  customerID: number;
  policyTypeID: number;
  policyNumber: string;
  startDate: Date;
  endDate?: Date;
  premiumAmount?: string;
  coverageAmount?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Qualification {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BankStatement {
  id?: number;
  customerID: number;
  fileName: string;
  displayName?: string;
  storagePath?: string;
  mimeType?: string;
  fileHash?: string;
  uploadStatus?: string;
  fileType?: 'PDF' | 'CSV';
  uploadDate?: Date;
  statementPeriod?: string;
  totalTransactions?: number;
  transactionCount?: number;
  totalIn?: string;
  totalOut?: string;
  netAmount?: string;
  isProcessed?: boolean;
  processedAt?: Date;
  error?: string;
  errorMessage?: string;
  rawFileData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BankTransaction {
  id?: number;
  statementID: number;
  customer_id: number;
  txnDate: Date;
  description: string;
  merchant?: string;
  amount: string;
  direction: 'in' | 'out';
  balance?: string;
  categoryID?: number;
  confidence?: string;
  rawData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionCategory {
  id?: number;
  name: string;
  directionConstraint?: 'in' | 'out';
  regexPatterns?: string[] | any;
  color: string;
  isSystem?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Export types for insertions
export type InsertFinancialAdvisor = Omit<FinancialAdvisor, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertUserCredential = Omit<UserCredential, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertProvince = Omit<Province, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertMaritalStatus = Omit<MaritalStatus, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertPreferredLanguage = Omit<PreferredLanguage, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertPolicyType = Omit<PolicyType, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertPolicy = Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertQualification = Omit<Qualification, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertBankStatement = Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertBankTransaction = Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertTransactionCategory = Omit<TransactionCategory, 'id' | 'createdAt' | 'updatedAt'>;

// All Drizzle ORM table definitions commented out for Azure SQL mode
/*
export const financialAdvisors = pgTable('financial_advisors', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),
  identityNumber: varchar('identity_number', { length: 13 }).notNull().unique(),
  mobileNumber: varchar('mobile_number', { length: 20 }).notNull(),
  emailAddress: varchar('email_address', { length: 255 }).notNull().unique(),
  physicalAddress1: varchar('physical_address1', { length: 500 }).notNull(),
  physicalAddress2: varchar('physical_address2', { length: 500 }),
  provinceID: integer('province_id').notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  fsca_Number: varchar('fsca_number', { length: 50 }),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// UserCredential table - based on src/app/models/user-credential.model.ts
export const userCredentials = pgTable('user_credentials', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userType: varchar('user_type', { length: 50 }).notNull(), // 'Advisor', 'Client', etc.
  userID: integer('user_id').notNull(), // References the actual user table (financialAdvisors, customers, etc.)
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Province table - based on src/app/models/province.model.ts
export const provinces = pgTable('provinces', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  provinceName: varchar('province_name', { length: 255 }).notNull(),
  code: varchar('code', { length: 10 }),
  country: varchar('country', { length: 100 }).default('South Africa')
});

// Customer table - based on src/app/models/customer.model.ts
export const customers = pgTable('customers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  financialAdvisorID: integer('financial_advisor_id').notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),
  emailAddress: varchar('email_address', { length: 255 }),
  mobileNumber: varchar('mobile_number', { length: 20 }),
  identityNumber: varchar('identity_number', { length: 13 }),
  physicalAddress1: varchar('physical_address1', { length: 500 }),
  physicalAddress2: varchar('physical_address2', { length: 500 }),
  provinceID: integer('province_id'),
  postalCode: varchar('postal_code', { length: 10 }),
  maritalStatusID: integer('marital_status_id'),
  preferredLanguageID: integer('preferred_language_id'),
  qualificationID: integer('qualification_id'),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// MaritalStatus table
export const maritalStatuses = pgTable('marital_statuses', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  statusName: varchar('status_name', { length: 100 }).notNull()
});

// PreferredLanguage table
export const preferredLanguages = pgTable('preferred_languages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  languageName: varchar('language_name', { length: 100 }).notNull()
});

// PolicyType table
export const policyTypes = pgTable('policy_types', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  typeName: varchar('type_name', { length: 255 }).notNull(),
  description: text('description')
});

// Policy table
export const policies = pgTable('policies', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  policyName: varchar('policy_name', { length: 255 }),
  policyNumber: varchar('policy_number', { length: 100 }).notNull().unique(),
  customerID: integer('customer_id').notNull(),
  policyTypeID: integer('policy_type_id').notNull(),
  premiumAmount: varchar('premium_amount', { length: 20 }),
  coverageAmount: varchar('coverage_amount', { length: 20 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Qualification table
export const qualifications = pgTable('qualifications', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  qualificationName: varchar('qualification_name', { length: 255 }).notNull(),
  description: text('description')
});

// Transaction Categories table - for ML categorization
export const transactionCategories = pgTable('transaction_categories', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  directionConstraint: varchar('direction_constraint', { length: 10 }), // 'in', 'out', or null
  regexPatterns: jsonb('regex_patterns'), // JSON array of regex patterns
  isSystem: boolean('is_system').default(false),
  color: varchar('color', { length: 7 }), // hex color for UI
  createdAt: timestamp('created_at').defaultNow()
});

// Bank Statements table - stores uploaded bank statements
export const bankStatements = pgTable('bank_statements', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  customerID: integer('customer_id').notNull(),
  originalFileName: varchar('original_filename', { length: 500 }).notNull(),
  displayName: varchar('display_name', { length: 500 }), // user-friendly name shown in UI
  storagePath: varchar('storage_path', { length: 1000 }),
  mimeType: varchar('mime_type', { length: 100 }),
  fileHash: varchar('file_hash', { length: 64 }), // for duplicate detection
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  uploadStatus: varchar('upload_status', { length: 20 }).default('uploaded'), // uploaded|processing|completed|failed
  error: text('error'),
  totalIn: decimal('total_in', { precision: 15, scale: 2 }).default('0.00'),
  totalOut: decimal('total_out', { precision: 15, scale: 2 }).default('0.00'),
  netAmount: decimal('net_amount', { precision: 15, scale: 2 }).default('0.00'),
  transactionCount: integer('transaction_count').default(0),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  processedAt: timestamp('processed_at')
});

// Bank Transactions table - individual transactions from statements
export const bankTransactions = pgTable('bank_transactions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  statementID: integer('statement_id').notNull(),
  customerID: integer('customer_id').notNull(),
  txnDate: timestamp('txn_date').notNull(),
  description: text('description').notNull(),
  merchant: varchar('merchant', { length: 255 }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  direction: varchar('direction', { length: 3 }).notNull(), // 'in' or 'out'
  balance: decimal('balance', { precision: 15, scale: 2 }),
  categoryID: integer('category_id'),
  confidence: decimal('confidence', { precision: 5, scale: 4 }), // ML confidence 0-1
  isManualOverride: boolean('is_manual_override').default(false),
  rawData: jsonb('raw_data'), // original parsed row data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Relations
export const financialAdvisorsRelations = relations(financialAdvisors, ({ one }) => ({
  province: one(provinces, {
    fields: [financialAdvisors.provinceID],
    references: [provinces.id]
  })
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
  advisor: one(financialAdvisors, {
    fields: [userCredentials.userID],
    references: [financialAdvisors.id]
  })
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  financialAdvisor: one(financialAdvisors, {
    fields: [customers.financialAdvisorID],
    references: [financialAdvisors.id]
  }),
  province: one(provinces, {
    fields: [customers.provinceID],
    references: [provinces.id]
  }),
  maritalStatus: one(maritalStatuses, {
    fields: [customers.maritalStatusID],
    references: [maritalStatuses.id]
  }),
  preferredLanguage: one(preferredLanguages, {
    fields: [customers.preferredLanguageID],
    references: [preferredLanguages.id]
  }),
  qualification: one(qualifications, {
    fields: [customers.qualificationID],
    references: [qualifications.id]
  }),
  policies: many(policies),
  bankStatements: many(bankStatements),
  bankTransactions: many(bankTransactions)
}));

export const policiesRelations = relations(policies, ({ one }) => ({
  customer: one(customers, {
    fields: [policies.customerID],
    references: [customers.id]
  }),
  policyType: one(policyTypes, {
    fields: [policies.policyTypeID],
    references: [policyTypes.id]
  })
}));

// Bank Statement relations
export const bankStatementsRelations = relations(bankStatements, ({ one, many }) => ({
  customer: one(customers, {
    fields: [bankStatements.customerID],
    references: [customers.id]
  }),
  transactions: many(bankTransactions)
}));

// Bank Transaction relations
export const bankTransactionsRelations = relations(bankTransactions, ({ one }) => ({
  customer: one(customers, {
    fields: [bankTransactions.customerID],
    references: [customers.id]
  }),
  statement: one(bankStatements, {
    fields: [bankTransactions.statementID],
    references: [bankStatements.id]
  }),
  category: one(transactionCategories, {
    fields: [bankTransactions.categoryID],
    references: [transactionCategories.id]
  })
}));

// Transaction Category relations
export const transactionCategoriesRelations = relations(transactionCategories, ({ many }) => ({
  transactions: many(bankTransactions)
}));

// Type exports for use in the application
export type FinancialAdvisor = typeof financialAdvisors.$inferSelect;
export type InsertFinancialAdvisor = typeof financialAdvisors.$inferInsert;
export type UserCredential = typeof userCredentials.$inferSelect;
export type InsertUserCredential = typeof userCredentials.$inferInsert;
export type Province = typeof provinces.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;
export type Policy = typeof policies.$inferSelect;
export type MaritalStatus = typeof maritalStatuses.$inferSelect;
export type PreferredLanguage = typeof preferredLanguages.$inferSelect;
export type PolicyType = typeof policyTypes.$inferSelect;
export type Qualification = typeof qualifications.$inferSelect;

// Bank Statement and Transaction types
*/  // End of commented out Drizzle ORM definitions