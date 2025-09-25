"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCategoriesRelations = exports.bankTransactionsRelations = exports.bankStatementsRelations = exports.policiesRelations = exports.customersRelations = exports.userCredentialsRelations = exports.financialAdvisorsRelations = exports.bankTransactions = exports.bankStatements = exports.transactionCategories = exports.qualifications = exports.policies = exports.policyTypes = exports.preferredLanguages = exports.maritalStatuses = exports.customers = exports.provinces = exports.userCredentials = exports.financialAdvisors = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// FinancialAdvisor table - based on src/app/models/financial-advisor.model.ts
exports.financialAdvisors = (0, pg_core_1.pgTable)('financial_advisors', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 255 }).notNull(),
    surname: (0, pg_core_1.varchar)('surname', { length: 255 }).notNull(),
    identityNumber: (0, pg_core_1.varchar)('identity_number', { length: 13 }).notNull().unique(),
    mobileNumber: (0, pg_core_1.varchar)('mobile_number', { length: 20 }).notNull(),
    emailAddress: (0, pg_core_1.varchar)('email_address', { length: 255 }).notNull().unique(),
    physicalAddress1: (0, pg_core_1.varchar)('physical_address1', { length: 500 }).notNull(),
    physicalAddress2: (0, pg_core_1.varchar)('physical_address2', { length: 500 }),
    provinceID: (0, pg_core_1.integer)('province_id').notNull(),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 10 }).notNull(),
    fsca_Number: (0, pg_core_1.varchar)('fsca_number', { length: 50 }),
    profileImageUrl: (0, pg_core_1.varchar)('profile_image_url', { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// UserCredential table - based on src/app/models/user-credential.model.ts
exports.userCredentials = (0, pg_core_1.pgTable)('user_credentials', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    userType: (0, pg_core_1.varchar)('user_type', { length: 50 }).notNull(), // 'Advisor', 'Client', etc.
    userID: (0, pg_core_1.integer)('user_id').notNull(), // References the actual user table (financialAdvisors, customers, etc.)
    username: (0, pg_core_1.varchar)('username', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    lastLogin: (0, pg_core_1.timestamp)('last_login'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Province table - based on src/app/models/province.model.ts
exports.provinces = (0, pg_core_1.pgTable)('provinces', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    provinceName: (0, pg_core_1.varchar)('province_name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 10 }),
    country: (0, pg_core_1.varchar)('country', { length: 100 }).default('South Africa')
});
// Customer table - based on src/app/models/customer.model.ts
exports.customers = (0, pg_core_1.pgTable)('customers', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    financialAdvisorID: (0, pg_core_1.integer)('financial_advisor_id').notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 255 }).notNull(),
    surname: (0, pg_core_1.varchar)('surname', { length: 255 }).notNull(),
    emailAddress: (0, pg_core_1.varchar)('email_address', { length: 255 }),
    mobileNumber: (0, pg_core_1.varchar)('mobile_number', { length: 20 }),
    identityNumber: (0, pg_core_1.varchar)('identity_number', { length: 13 }),
    physicalAddress1: (0, pg_core_1.varchar)('physical_address1', { length: 500 }),
    physicalAddress2: (0, pg_core_1.varchar)('physical_address2', { length: 500 }),
    provinceID: (0, pg_core_1.integer)('province_id'),
    postalCode: (0, pg_core_1.varchar)('postal_code', { length: 10 }),
    maritalStatusID: (0, pg_core_1.integer)('marital_status_id'),
    preferredLanguageID: (0, pg_core_1.integer)('preferred_language_id'),
    qualificationID: (0, pg_core_1.integer)('qualification_id'),
    profileImageUrl: (0, pg_core_1.varchar)('profile_image_url', { length: 500 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// MaritalStatus table
exports.maritalStatuses = (0, pg_core_1.pgTable)('marital_statuses', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    statusName: (0, pg_core_1.varchar)('status_name', { length: 100 }).notNull()
});
// PreferredLanguage table
exports.preferredLanguages = (0, pg_core_1.pgTable)('preferred_languages', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    languageName: (0, pg_core_1.varchar)('language_name', { length: 100 }).notNull()
});
// PolicyType table
exports.policyTypes = (0, pg_core_1.pgTable)('policy_types', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    typeName: (0, pg_core_1.varchar)('type_name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description')
});
// Policy table
exports.policies = (0, pg_core_1.pgTable)('policies', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    policyName: (0, pg_core_1.varchar)('policy_name', { length: 255 }),
    policyNumber: (0, pg_core_1.varchar)('policy_number', { length: 100 }).notNull().unique(),
    customerID: (0, pg_core_1.integer)('customer_id').notNull(),
    policyTypeID: (0, pg_core_1.integer)('policy_type_id').notNull(),
    premiumAmount: (0, pg_core_1.varchar)('premium_amount', { length: 20 }),
    coverageAmount: (0, pg_core_1.varchar)('coverage_amount', { length: 20 }),
    startDate: (0, pg_core_1.timestamp)('start_date'),
    endDate: (0, pg_core_1.timestamp)('end_date'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Qualification table
exports.qualifications = (0, pg_core_1.pgTable)('qualifications', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    qualificationName: (0, pg_core_1.varchar)('qualification_name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description')
});
// Transaction Categories table - for ML categorization
exports.transactionCategories = (0, pg_core_1.pgTable)('transaction_categories', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    directionConstraint: (0, pg_core_1.varchar)('direction_constraint', { length: 10 }), // 'in', 'out', or null
    regexPatterns: (0, pg_core_1.jsonb)('regex_patterns'), // JSON array of regex patterns
    isSystem: (0, pg_core_1.boolean)('is_system').default(false),
    color: (0, pg_core_1.varchar)('color', { length: 7 }), // hex color for UI
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow()
});
// Bank Statements table - stores uploaded bank statements
exports.bankStatements = (0, pg_core_1.pgTable)('bank_statements', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    customerID: (0, pg_core_1.integer)('customer_id').notNull(),
    originalFileName: (0, pg_core_1.varchar)('original_filename', { length: 500 }).notNull(),
    displayName: (0, pg_core_1.varchar)('display_name', { length: 500 }), // user-friendly name shown in UI
    storagePath: (0, pg_core_1.varchar)('storage_path', { length: 1000 }),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }),
    fileHash: (0, pg_core_1.varchar)('file_hash', { length: 64 }), // for duplicate detection
    periodStart: (0, pg_core_1.timestamp)('period_start'),
    periodEnd: (0, pg_core_1.timestamp)('period_end'),
    uploadStatus: (0, pg_core_1.varchar)('upload_status', { length: 20 }).default('uploaded'), // uploaded|processing|completed|failed
    error: (0, pg_core_1.text)('error'),
    totalIn: (0, pg_core_1.decimal)('total_in', { precision: 15, scale: 2 }).default('0.00'),
    totalOut: (0, pg_core_1.decimal)('total_out', { precision: 15, scale: 2 }).default('0.00'),
    netAmount: (0, pg_core_1.decimal)('net_amount', { precision: 15, scale: 2 }).default('0.00'),
    transactionCount: (0, pg_core_1.integer)('transaction_count').default(0),
    uploadedAt: (0, pg_core_1.timestamp)('uploaded_at').defaultNow(),
    processedAt: (0, pg_core_1.timestamp)('processed_at')
});
// Bank Transactions table - individual transactions from statements
exports.bankTransactions = (0, pg_core_1.pgTable)('bank_transactions', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedByDefaultAsIdentity(),
    statementID: (0, pg_core_1.integer)('statement_id').notNull(),
    customerID: (0, pg_core_1.integer)('customer_id').notNull(),
    txnDate: (0, pg_core_1.timestamp)('txn_date').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    merchant: (0, pg_core_1.varchar)('merchant', { length: 255 }),
    amount: (0, pg_core_1.decimal)('amount', { precision: 15, scale: 2 }).notNull(),
    direction: (0, pg_core_1.varchar)('direction', { length: 3 }).notNull(), // 'in' or 'out'
    balance: (0, pg_core_1.decimal)('balance', { precision: 15, scale: 2 }),
    categoryID: (0, pg_core_1.integer)('category_id'),
    confidence: (0, pg_core_1.decimal)('confidence', { precision: 5, scale: 4 }), // ML confidence 0-1
    isManualOverride: (0, pg_core_1.boolean)('is_manual_override').default(false),
    rawData: (0, pg_core_1.jsonb)('raw_data'), // original parsed row data
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
// Relations
exports.financialAdvisorsRelations = (0, drizzle_orm_1.relations)(exports.financialAdvisors, ({ one }) => ({
    province: one(exports.provinces, {
        fields: [exports.financialAdvisors.provinceID],
        references: [exports.provinces.id]
    })
}));
exports.userCredentialsRelations = (0, drizzle_orm_1.relations)(exports.userCredentials, ({ one }) => ({
    advisor: one(exports.financialAdvisors, {
        fields: [exports.userCredentials.userID],
        references: [exports.financialAdvisors.id]
    })
}));
exports.customersRelations = (0, drizzle_orm_1.relations)(exports.customers, ({ one, many }) => ({
    financialAdvisor: one(exports.financialAdvisors, {
        fields: [exports.customers.financialAdvisorID],
        references: [exports.financialAdvisors.id]
    }),
    province: one(exports.provinces, {
        fields: [exports.customers.provinceID],
        references: [exports.provinces.id]
    }),
    maritalStatus: one(exports.maritalStatuses, {
        fields: [exports.customers.maritalStatusID],
        references: [exports.maritalStatuses.id]
    }),
    preferredLanguage: one(exports.preferredLanguages, {
        fields: [exports.customers.preferredLanguageID],
        references: [exports.preferredLanguages.id]
    }),
    qualification: one(exports.qualifications, {
        fields: [exports.customers.qualificationID],
        references: [exports.qualifications.id]
    }),
    policies: many(exports.policies),
    bankStatements: many(exports.bankStatements),
    bankTransactions: many(exports.bankTransactions)
}));
exports.policiesRelations = (0, drizzle_orm_1.relations)(exports.policies, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.policies.customerID],
        references: [exports.customers.id]
    }),
    policyType: one(exports.policyTypes, {
        fields: [exports.policies.policyTypeID],
        references: [exports.policyTypes.id]
    })
}));
// Bank Statement relations
exports.bankStatementsRelations = (0, drizzle_orm_1.relations)(exports.bankStatements, ({ one, many }) => ({
    customer: one(exports.customers, {
        fields: [exports.bankStatements.customerID],
        references: [exports.customers.id]
    }),
    transactions: many(exports.bankTransactions)
}));
// Bank Transaction relations
exports.bankTransactionsRelations = (0, drizzle_orm_1.relations)(exports.bankTransactions, ({ one }) => ({
    customer: one(exports.customers, {
        fields: [exports.bankTransactions.customerID],
        references: [exports.customers.id]
    }),
    statement: one(exports.bankStatements, {
        fields: [exports.bankTransactions.statementID],
        references: [exports.bankStatements.id]
    }),
    category: one(exports.transactionCategories, {
        fields: [exports.bankTransactions.categoryID],
        references: [exports.transactionCategories.id]
    })
}));
// Transaction Category relations
exports.transactionCategoriesRelations = (0, drizzle_orm_1.relations)(exports.transactionCategories, ({ many }) => ({
    transactions: many(exports.bankTransactions)
}));
