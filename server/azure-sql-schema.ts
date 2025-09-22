// Azure SQL Database Schema Creation
// This file contains SQL Server DDL statements to create all necessary tables
// for the FlightPlan application when deploying to Azure SQL Database

export const AZURE_SQL_SCHEMA_DDL = `
-- Financial Advisors table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='financial_advisors' AND xtype='U')
CREATE TABLE financial_advisors (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(255) NOT NULL,
    surname NVARCHAR(255) NOT NULL,
    identity_number NVARCHAR(13) NOT NULL UNIQUE,
    mobile_number NVARCHAR(20) NOT NULL,
    email_address NVARCHAR(255) NOT NULL UNIQUE,
    physical_address1 NVARCHAR(500) NOT NULL,
    physical_address2 NVARCHAR(500),
    province_id INT NOT NULL,
    postal_code NVARCHAR(10) NOT NULL,
    fsca_number NVARCHAR(50),
    profile_image_url NVARCHAR(500),
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- User Credentials table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_credentials' AND xtype='U')
CREATE TABLE user_credentials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_type NVARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    username NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    is_active BIT DEFAULT 1,
    last_login DATETIME2,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Provinces table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='provinces' AND xtype='U')
CREATE TABLE provinces (
    id INT IDENTITY(1,1) PRIMARY KEY,
    province_name NVARCHAR(255) NOT NULL,
    code NVARCHAR(10),
    country NVARCHAR(100) DEFAULT 'South Africa'
);

-- Customers table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='customers' AND xtype='U')
CREATE TABLE customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    financial_advisor_id INT NOT NULL,
    first_name NVARCHAR(255) NOT NULL,
    surname NVARCHAR(255) NOT NULL,
    email_address NVARCHAR(255),
    mobile_number NVARCHAR(20),
    identity_number NVARCHAR(13),
    physical_address1 NVARCHAR(500),
    physical_address2 NVARCHAR(500),
    province_id INT,
    postal_code NVARCHAR(10),
    marital_status_id INT,
    preferred_language_id INT,
    qualification_id INT,
    profile_image_url NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Marital Statuses table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='marital_statuses' AND xtype='U')
CREATE TABLE marital_statuses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    status_name NVARCHAR(100) NOT NULL
);

-- Preferred Languages table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='preferred_languages' AND xtype='U')
CREATE TABLE preferred_languages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    language_name NVARCHAR(100) NOT NULL
);

-- Policy Types table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='policy_types' AND xtype='U')
CREATE TABLE policy_types (
    id INT IDENTITY(1,1) PRIMARY KEY,
    type_name NVARCHAR(255) NOT NULL,
    description NTEXT
);

-- Policies table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='policies' AND xtype='U')
CREATE TABLE policies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    policy_name NVARCHAR(255),
    policy_number NVARCHAR(100) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    policy_type_id INT NOT NULL,
    premium_amount NVARCHAR(20),
    coverage_amount NVARCHAR(20),
    start_date DATETIME2,
    end_date DATETIME2,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETUTCDATE(),
    updated_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Qualifications table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='qualifications' AND xtype='U')
CREATE TABLE qualifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    qualification_name NVARCHAR(255) NOT NULL,
    description NTEXT
);

-- Transaction Categories table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='transaction_categories' AND xtype='U')
CREATE TABLE transaction_categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    direction_constraint NVARCHAR(10),
    regex_patterns NVARCHAR(MAX), -- JSON data
    is_system BIT DEFAULT 0,
    color NVARCHAR(7), -- hex color
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Bank Statements table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bank_statements' AND xtype='U')
CREATE TABLE bank_statements (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    original_filename NVARCHAR(500) NOT NULL,
    display_name NVARCHAR(500),
    storage_path NVARCHAR(1000),
    mime_type NVARCHAR(100),
    file_hash NVARCHAR(64),
    upload_status NVARCHAR(50) DEFAULT 'uploaded',
    error NTEXT,
    transaction_count INT,
    total_in DECIMAL(15,2),
    total_out DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    uploaded_at DATETIME2 DEFAULT GETUTCDATE(),
    processed_at DATETIME2
);

-- Bank Transactions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='bank_transactions' AND xtype='U')
CREATE TABLE bank_transactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    statement_id INT NOT NULL,
    txn_date DATE NOT NULL,
    description NVARCHAR(500) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance DECIMAL(15,2),
    direction NVARCHAR(10) NOT NULL, -- 'in' or 'out'
    merchant NVARCHAR(255),
    category_id INT,
    manual_category BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert default provinces
IF NOT EXISTS (SELECT * FROM provinces WHERE code = 'WC')
BEGIN
    INSERT INTO provinces (province_name, code) VALUES 
    ('Western Cape', 'WC'),
    ('Eastern Cape', 'EC'),
    ('Northern Cape', 'NC'),
    ('Free State', 'FS'),
    ('KwaZulu-Natal', 'KZN'),
    ('North West', 'NW'),
    ('Gauteng', 'GP'),
    ('Mpumalanga', 'MP'),
    ('Limpopo', 'LP');
END;

-- Insert default marital statuses
IF NOT EXISTS (SELECT * FROM marital_statuses WHERE status_name = 'Single')
BEGIN
    INSERT INTO marital_statuses (status_name) VALUES 
    ('Single'),
    ('Married'),
    ('Divorced'),
    ('Widowed'),
    ('Separated');
END;

-- Insert default preferred languages
IF NOT EXISTS (SELECT * FROM preferred_languages WHERE language_name = 'English')
BEGIN
    INSERT INTO preferred_languages (language_name) VALUES 
    ('English'),
    ('Afrikaans'),
    ('isiZulu'),
    ('isiXhosa'),
    ('Sesotho'),
    ('Setswana'),
    ('Sepedi'),
    ('Xitsonga'),
    ('siSwati'),
    ('Tshivenda'),
    ('isiNdebele');
END;

-- Insert default qualifications
IF NOT EXISTS (SELECT * FROM qualifications WHERE qualification_name = 'High School')
BEGIN
    INSERT INTO qualifications (qualification_name, description) VALUES 
    ('High School', 'Grade 12 / Matric'),
    ('Certificate', 'Certificate or Diploma'),
    ('Bachelors Degree', 'Undergraduate Degree'),
    ('Honours Degree', 'Honours or Postgraduate Diploma'),
    ('Masters Degree', 'Masters Degree'),
    ('Doctorate', 'PhD or Doctoral Degree');
END;

-- Insert default policy types
IF NOT EXISTS (SELECT * FROM policy_types WHERE type_name = 'Life Insurance')
BEGIN
    INSERT INTO policy_types (type_name, description) VALUES 
    ('Life Insurance', 'Life insurance coverage'),
    ('Health Insurance', 'Medical and health coverage'),
    ('Car Insurance', 'Vehicle insurance coverage'),
    ('Home Insurance', 'Property and home insurance'),
    ('Travel Insurance', 'Travel and trip coverage'),
    ('Disability Insurance', 'Disability income protection'),
    ('Investment Policy', 'Investment and savings policies');
END;

-- Insert default transaction categories
IF NOT EXISTS (SELECT * FROM transaction_categories WHERE name = 'Salary')
BEGIN
    INSERT INTO transaction_categories (name, direction_constraint, is_system, color) VALUES 
    ('Salary', 'in', 1, '#4CAF50'),
    ('Groceries', 'out', 1, '#FF9800'),
    ('Utilities', 'out', 1, '#2196F3'),
    ('Entertainment', 'out', 1, '#E91E63'),
    ('Transport', 'out', 1, '#9C27B0'),
    ('Healthcare', 'out', 1, '#00BCD4'),
    ('Shopping', 'out', 1, '#FF5722'),
    ('Restaurants', 'out', 1, '#795548'),
    ('Investment', 'out', 1, '#607D8B'),
    ('Transfer', NULL, 1, '#9E9E9E'),
    ('Other Income', 'in', 1, '#8BC34A'),
    ('Other Expense', 'out', 1, '#F44336');
END;

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_user_credentials_username')
    CREATE INDEX IX_user_credentials_username ON user_credentials(username);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_bank_transactions_customer_date')
    CREATE INDEX IX_bank_transactions_customer_date ON bank_transactions(customer_id, txn_date);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_bank_statements_customer')
    CREATE INDEX IX_bank_statements_customer ON bank_statements(customer_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_policies_customer')
    CREATE INDEX IX_policies_customer ON policies(customer_id);
`;

// Split DDL into individual statements for execution
export function getSchemaStatements(): string[] {
  return AZURE_SQL_SCHEMA_DDL
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    .map(stmt => stmt + ';');
}