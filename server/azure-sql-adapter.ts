import * as sql from 'mssql';
import { getSchemaStatements } from './azure-sql-schema';

// Azure SQL Database Adapter
// This adapter provides a bridge between our application and Azure SQL Database
// since Drizzle ORM doesn't support SQL Server

export interface DatabaseConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  port?: number;
  connectionTimeout?: number;
  requestTimeout?: number;
}

export class AzureSQLAdapter {
  private pool: sql.ConnectionPool | null = null;
  private config: sql.config;

  constructor(config: DatabaseConfig) {
    this.config = {
      server: config.server,
      database: config.database,
      user: config.user,
      password: config.password,
      port: config.port || 1433,
      connectionTimeout: config.connectionTimeout || 30000,
      requestTimeout: config.requestTimeout || 30000,
      options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: false,
        enableArithAbort: true
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };
  }

  async connect(): Promise<void> {
    if (!this.pool) {
      this.pool = new sql.ConnectionPool(this.config);
      await this.pool.connect();
      console.log('✅ Azure SQL Database connection established');
      
      // Initialize database schema on first connection
      await this.initializeSchema();
    }
  }

  private async initializeSchema(): Promise<void> {
    try {
      console.log('🔄 Initializing Azure SQL Database schema...');
      
      const statements = getSchemaStatements();
      let tablesCreated = 0;
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const request = this.pool!.request();
            await request.query(statement);
            
            // Count table creation statements
            if (statement.includes('CREATE TABLE')) {
              tablesCreated++;
            }
          } catch (error: any) {
            // Log but don't fail if table already exists or similar non-critical errors
            if (!error.message.includes('already exists') && !error.message.includes('already an object')) {
              console.warn('⚠️ Schema statement warning:', error.message);
            }
          }
        }
      }
      
      if (tablesCreated > 0) {
        console.log(`✅ Azure SQL Database schema initialized successfully (${tablesCreated} tables processed)`);
      } else {
        console.log('✅ Azure SQL Database schema already exists');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Azure SQL Database schema:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('🔌 Azure SQL Database connection closed');
    }
  }

  async query(sqlQuery: string, params: any = {}): Promise<any> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const request = this.pool.request();
    
    // Add parameters to the request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });

    const result = await request.query(sqlQuery);
    return result.recordset;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      await this.query('SELECT 1 as health');
      return { 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      throw new Error(`Database health check failed: ${(error as Error).message}`);
    }
  }

  // Financial Advisors
  async getFinancialAdvisors(): Promise<any[]> {
    // Try/fallback query for backward compatibility with table/column names
    try {
      // Try new schema first (camelCase table/columns)
      return await this.query(`
        SELECT id, firstName, surname, identityNumber, mobileNumber, emailAddress, 
               physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number,
               createdAt, updatedAt, profileImageUrl
        FROM financialAdvisors 
        ORDER BY createdAt DESC
      `);
    } catch (error: any) {
      if (error.number === 207 || error.number === 208 || error?.originalError?.info?.number === 207 || error?.originalError?.info?.number === 208) {
        // Fallback to legacy schema (snake_case table/columns)
        return await this.query(`
          SELECT id, first_name as firstName, surname, identity_number as identityNumber, 
                 mobile_number as mobileNumber, email_address as emailAddress, 
                 physical_address1 as physicalAddress1, physical_address2 as physicalAddress2, 
                 province_id as provinceID, postal_code as postalCode, fsca_number as fsca_Number,
                 created_at as createdAt, updated_at as updatedAt, profile_image_url as profileImageUrl
          FROM financial_advisors 
          ORDER BY created_at DESC
        `);
      }
      throw error;
    }
  }

  async getFinancialAdvisorById(id: number): Promise<any> {
    // Try/fallback query for backward compatibility
    try {
      // Try new schema first (camelCase table/columns)
      const result = await this.query(`
        SELECT id, firstName, surname, identityNumber, mobileNumber, emailAddress, 
               physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number,
               createdAt, updatedAt, profileImageUrl
        FROM financialAdvisors 
        WHERE id = @id
      `, { id });
      return result[0] || null;
    } catch (error: any) {
      if (error.number === 207 || error.number === 208 || error?.originalError?.info?.number === 207 || error?.originalError?.info?.number === 208) {
        // Fallback to legacy schema (snake_case table/columns)
        const result = await this.query(`
          SELECT id, first_name as firstName, surname, identity_number as identityNumber, 
                 mobile_number as mobileNumber, email_address as emailAddress, 
                 physical_address1 as physicalAddress1, physical_address2 as physicalAddress2, 
                 province_id as provinceID, postal_code as postalCode, fsca_number as fsca_Number,
                 created_at as createdAt, updated_at as updatedAt, profile_image_url as profileImageUrl
          FROM financial_advisors 
          WHERE id = @id
        `, { id });
        return result[0] || null;
      }
      throw error;
    }
  }

  async createFinancialAdvisor(advisor: any): Promise<any> {
    // Try/fallback insert for backward compatibility
    try {
      // Try new schema first (camelCase table/columns)
      const result = await this.query(`
        INSERT INTO financialAdvisors (firstName, surname, identityNumber, mobileNumber, emailAddress, 
                                     physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number)
        OUTPUT INSERTED.*
        VALUES (@firstName, @surname, @identityNumber, @mobileNumber, @emailAddress, 
                @physicalAddress1, @physicalAddress2, @provinceID, @postalCode, @fsca_Number)
      `, advisor);
      return result[0];
    } catch (error: any) {
      if (error.number === 207 || error.number === 208 || error?.originalError?.info?.number === 207 || error?.originalError?.info?.number === 208) {
        // Fallback to legacy schema (snake_case table/columns)
        const result = await this.query(`
          INSERT INTO financial_advisors (first_name, surname, identity_number, mobile_number, email_address, 
                                        physical_address1, physical_address2, province_id, postal_code, fsca_number)
          OUTPUT INSERTED.*
          VALUES (@firstName, @surname, @identityNumber, @mobileNumber, @emailAddress, 
                  @physicalAddress1, @physicalAddress2, @provinceID, @postalCode, @fsca_Number)
        `, advisor);
        return result[0];
      }
      throw error;
    }
  }

  // User Credentials
  async getUserCredentialByUsername(username: string): Promise<any> {
    const result = await this.query(`
      SELECT id, userType, userID, username, passwordHash, isActive, createdAt, updatedAt, lastLogin
      FROM userCredentials 
      WHERE username = @username
    `, { username });
    return result[0] || null;
  }

  async createUserCredential(userCred: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO userCredentials (userType, userID, username, passwordHash, isActive)
      OUTPUT INSERTED.*
      VALUES (@userType, @userID, @username, @passwordHash, @isActive)
    `, userCred);
    const { passwordHash, ...userCredWithoutPassword } = result[0];
    return userCredWithoutPassword;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await this.query(`
      UPDATE userCredentials 
      SET lastLogin = GETUTCDATE()
      WHERE id = @id
    `, { id });
  }

  // Provinces
  async getProvinces(): Promise<any[]> {
    // Try/fallback queries for backward compatibility
    try {
      // Try new schema first (province_name)
      return await this.query(`
        SELECT id, province_name as name, code
        FROM provinces 
        ORDER BY province_name
      `);
    } catch (error: any) {
      if (error.number === 207 || error?.originalError?.info?.number === 207) { // Invalid column name error
        // Fallback to old schema (name)
        return await this.query(`
          SELECT id, name, code
          FROM provinces 
          ORDER BY name
        `);
      }
      throw error;
    }
  }

  async createProvince(province: any): Promise<any> {
    // Try/fallback insert for backward compatibility
    try {
      // Try new schema first (province_name)
      const result = await this.query(`
        INSERT INTO provinces (province_name, code)
        OUTPUT INSERTED.*
        VALUES (@name, @code)
      `, province);
      return result[0];
    } catch (error: any) {
      if (error.number === 207 || error?.originalError?.info?.number === 207) { // Invalid column name error
        // Fallback to old schema (name)
        const result = await this.query(`
          INSERT INTO provinces (name, code)
          OUTPUT INSERTED.*
          VALUES (@name, @code)
        `, province);
        return result[0];
      }
      throw error;
    }
  }

  // Customers
  async getCustomers(advisorId?: number): Promise<any[]> {
    // Only filter by advisor ID if a valid number is provided
    const whereClause = (typeof advisorId === 'number') ? 'WHERE c.financial_advisor_id = @advisorId' : '';
    const params = (typeof advisorId === 'number') ? { advisorId } : {};
    
    try {
      // Try new schema first (province_name)
      const results = await this.query(`
        SELECT c.id, c.firstName, c.surname, c.identityNumber, c.mobileNumber, c.emailAddress,
               c.physicalAddress1, c.physicalAddress2, c.provinceID, c.postalCode,
               c.maritalStatusID, c.preferredLanguageID, c.qualificationID, c.profileImageUrl,
               c.financial_advisor_id, c.createdAt, c.updatedAt,
               ms.name as maritalStatusName,
               pl.name as preferredLanguageName,
               p.province_name as provinceName,
               q.name as qualificationName
        FROM customers c
        LEFT JOIN maritalStatuses ms ON c.maritalStatusID = ms.id
        LEFT JOIN preferredLanguages pl ON c.preferredLanguageID = pl.id
        LEFT JOIN provinces p ON c.provinceID = p.id
        LEFT JOIN qualifications q ON c.qualificationID = q.id
        ${whereClause}
        ORDER BY c.createdAt DESC
      `, params);
      
      // Transform data to match frontend expectations
      return results.map((customer: any) => ({
        ...customer,
        isActive: true, // Default to active for now
        maritalStatus: {
          statusName: customer.maritalStatusName || 'Not specified'
        },
        netWorth: Math.random() * 100000 // Temporary random value for progress bar
      }));
    } catch (error: any) {
      if (error.number === 207 || error?.originalError?.info?.number === 207) { // Invalid column name error
        // Fallback to old schema (name)
        const results = await this.query(`
          SELECT c.id, c.firstName, c.surname, c.identityNumber, c.mobileNumber, c.emailAddress,
                 c.physicalAddress1, c.physicalAddress2, c.provinceID, c.postalCode,
                 c.maritalStatusID, c.preferredLanguageID, c.qualificationID, c.profileImageUrl,
                 c.financial_advisor_id, c.createdAt, c.updatedAt,
                 ms.name as maritalStatusName,
                 pl.name as preferredLanguageName,
                 p.name as provinceName,
                 q.name as qualificationName
          FROM customers c
          LEFT JOIN maritalStatuses ms ON c.maritalStatusID = ms.id
          LEFT JOIN preferredLanguages pl ON c.preferredLanguageID = pl.id
          LEFT JOIN provinces p ON c.provinceID = p.id
          LEFT JOIN qualifications q ON c.qualificationID = q.id
          ${whereClause}
          ORDER BY c.createdAt DESC
        `, params);
        
        // Transform data to match frontend expectations
        return results.map((customer: any) => ({
          ...customer,
          isActive: true, // Default to active for now
          maritalStatus: {
            statusName: customer.maritalStatusName || 'Not specified'
          },
          netWorth: Math.random() * 100000 // Temporary random value for progress bar
        }));
      }
      throw error;
    }
  }

  async createCustomer(customer: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO customers (financial_advisor_id, firstName, surname, identityNumber, mobileNumber, emailAddress,
                           physicalAddress1, physicalAddress2, provinceID, postalCode,
                           maritalStatusID, preferredLanguageID, qualificationID)
      OUTPUT INSERTED.*
      VALUES (@financialAdvisorID, @firstName, @surname, @identityNumber, @mobileNumber, @emailAddress,
              @physicalAddress1, @physicalAddress2, @provinceID, @postalCode,
              @maritalStatusID, @preferredLanguageID, @qualificationID)
    `, customer);
    return result[0];
  }

  async updateCustomer(id: number, updateData: any): Promise<any> {
    // Whitelist allowed columns to prevent SQL injection
    const allowedColumns = [
      'firstName', 'surname', 'identityNumber', 'mobileNumber', 'emailAddress',
      'physicalAddress1', 'physicalAddress2', 'provinceID', 'postalCode',
      'maritalStatusID', 'preferredLanguageID', 'qualificationID', 'profileImageUrl'
    ];
    
    const filteredData: any = {};
    const setParts: string[] = [];
    
    Object.keys(updateData).forEach(key => {
      if (allowedColumns.includes(key)) {
        filteredData[key] = updateData[key];
        setParts.push(`${key} = @${key}`);
      }
    });
    
    if (setParts.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const result = await this.query(`
      UPDATE customers 
      SET ${setParts.join(', ')}, updatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @id
    `, { ...filteredData, id });
    return result[0];
  }

  // Marital Statuses
  async getMaritalStatuses(): Promise<any[]> {
    return await this.query(`
      SELECT id, name
      FROM maritalStatuses 
      ORDER BY name
    `);
  }

  async createMaritalStatus(status: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO maritalStatuses (name)
      OUTPUT INSERTED.*
      VALUES (@name)
    `, status);
    return result[0];
  }

  // Preferred Languages
  async getPreferredLanguages(): Promise<any[]> {
    return await this.query(`
      SELECT id, name, code
      FROM preferredLanguages 
      ORDER BY name
    `);
  }

  async createPreferredLanguage(language: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO preferredLanguages (name, code)
      OUTPUT INSERTED.*
      VALUES (@name, @code)
    `, language);
    return result[0];
  }

  // Policy Types
  async getPolicyTypes(): Promise<any[]> {
    return await this.query(`
      SELECT id, name, description
      FROM policyTypes 
      ORDER BY name
    `);
  }

  // Policies
  async getPolicies(): Promise<any[]> {
    return await this.query(`
      SELECT id, policyName, policyNumber, customerID, policyTypeID, premiumAmount, coverageAmount,
             startDate, endDate, isActive, createdAt, updatedAt
      FROM policies 
      ORDER BY createdAt DESC
    `);
  }

  async createPolicy(policy: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO policies (policyName, policyNumber, customerID, policyTypeID, premiumAmount, coverageAmount,
                          startDate, endDate, isActive)
      OUTPUT INSERTED.*
      VALUES (@policyName, @policyNumber, @customerID, @policyTypeID, @premiumAmount, @coverageAmount,
              @startDate, @endDate, @isActive)
    `, policy);
    return result[0];
  }

  // Qualifications
  async getQualifications(): Promise<any[]> {
    return await this.query(`
      SELECT id, name, description
      FROM qualifications 
      ORDER BY name
    `);
  }

  // Bank Statements
  async getBankStatements(customerID: number): Promise<any[]> {
    return await this.query(`
      SELECT id, customerID, fileName, displayName, storagePath, mimeType, fileHash,
             uploadStatus, error, transactionCount, totalIn, totalOut, netAmount,
             uploadedAt, processedAt
      FROM bankStatements 
      WHERE customer_id = @customer_id
      ORDER BY uploadedAt DESC
    `, { customer_id: customerID });
  }

  async getBankStatementById(id: number): Promise<any> {
    const result = await this.query(`
      SELECT id, customerID, fileName, displayName, storagePath, mimeType, fileHash,
             uploadStatus, error, transactionCount, totalIn, totalOut, netAmount,
             uploadedAt, processedAt
      FROM bankStatements 
      WHERE id = @id
    `, { id });
    return result[0] || null;
  }

  async createBankStatement(statement: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO bankStatements (customerID, fileName, displayName, storagePath, mimeType, fileHash, uploadStatus)
      OUTPUT INSERTED.*
      VALUES (@customerID, @fileName, @displayName, @storagePath, @mimeType, @fileHash, @uploadStatus)
    `, statement);
    return result[0];
  }

  async insertBankTransactions(transactions: any[]): Promise<void> {
    if (transactions.length === 0) return;
    
    for (const txn of transactions) {
      await this.query(`
        INSERT INTO bank_transactions (statement_id, customer_id, txn_date, description, merchant, amount, direction, balance, category_id, raw_data)
        VALUES (@statementID, @customer_id, @txnDate, @description, @merchant, @amount, @direction, @balance, @categoryID, @rawData)
      `, txn);
    }
  }

  async updateBankStatementCompletion(statementId: number, totalIn: string, totalOut: string, netAmount: string, transactionCount: number): Promise<void> {
    await this.query(`
      UPDATE bankStatements 
      SET uploadStatus = 'processed', 
          totalIn = @totalIn, 
          totalOut = @totalOut, 
          netAmount = @netAmount,
          transactionCount = @transactionCount,
          processedAt = GETDATE()
      WHERE id = @statementId
    `, { statementId, totalIn, totalOut, netAmount, transactionCount });
  }

  async updateBankStatementError(statementId: number, errorMessage: string): Promise<void> {
    await this.query(`
      UPDATE bankStatements 
      SET uploadStatus = 'error', 
          error = @errorMessage,
          processedAt = GETDATE()
      WHERE id = @statementId
    `, { statementId, errorMessage });
  }

  // Bank Transactions
  async getTransactionSummary(customerID: number, fromDate?: string, toDate?: string): Promise<any> {
    let whereClause = 'WHERE customer_id = @customer_id';
    let params: any = { customer_id: customerID };

    if (fromDate) {
      whereClause += ' AND txnDate >= @fromDate';
      params.fromDate = fromDate;
    }
    if (toDate) {
      whereClause += ' AND txnDate <= @toDate';
      params.toDate = toDate;
    }

    const result = await this.query(`
      SELECT 
        SUM(CASE WHEN direction = 'in' THEN amount ELSE 0 END) as totalIn,
        SUM(CASE WHEN direction = 'out' THEN amount ELSE 0 END) as totalOut,
        COUNT(*) as totalTransactions
      FROM bank_transactions 
      ${whereClause}
    `, params);

    return result[0] || { totalIn: 0, totalOut: 0, totalTransactions: 0 };
  }

  async getTransactionsByCategory(customerID: number, fromDate?: string, toDate?: string): Promise<any[]> {
    let whereClause = 'WHERE bt.customer_id = @customer_id';
    let params: any = { customer_id: customerID };

    if (fromDate) {
      whereClause += ' AND bt.txnDate >= @fromDate';
      params.fromDate = fromDate;
    }
    if (toDate) {
      whereClause += ' AND bt.txnDate <= @toDate';
      params.toDate = toDate;
    }

    return await this.query(`
      SELECT 
        bt.category_id,
        tc.name as categoryName,
        SUM(bt.amount) as total,
        COUNT(*) as count
      FROM bank_transactions bt
      LEFT JOIN transaction_categories tc ON bt.category_id = tc.id
      ${whereClause}
      GROUP BY bt.category_id, tc.name
      ORDER BY total DESC
    `, params);
  }

  // Profile Management
  async updateAdvisorProfile(userID: number, updateData: any): Promise<any> {
    // Whitelist allowed columns to prevent SQL injection
    const allowedColumns = [
      'firstName', 'surname', 'identityNumber', 'mobileNumber', 'emailAddress',
      'physicalAddress1', 'physicalAddress2', 'provinceID', 'postalCode',
      'fsca_Number', 'profileImageUrl'
    ];
    
    const filteredData: any = {};
    const setParts: string[] = [];
    
    Object.keys(updateData).forEach(key => {
      if (allowedColumns.includes(key)) {
        filteredData[key] = updateData[key];
        setParts.push(`${key} = @${key}`);
      }
    });
    
    if (setParts.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const result = await this.query(`
      UPDATE financialAdvisors 
      SET ${setParts.join(', ')}, updatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @userID
    `, { ...filteredData, userID });
    return result[0];
  }

  async updateCustomerProfile(userID: number, updateData: any): Promise<any> {
    // Whitelist allowed columns to prevent SQL injection
    const allowedColumns = [
      'firstName', 'surname', 'identityNumber', 'mobileNumber', 'emailAddress',
      'physicalAddress1', 'physicalAddress2', 'provinceID', 'postalCode',
      'maritalStatusID', 'preferredLanguageID', 'qualificationID', 'profileImageUrl'
    ];
    
    const filteredData: any = {};
    const setParts: string[] = [];
    
    Object.keys(updateData).forEach(key => {
      if (allowedColumns.includes(key)) {
        filteredData[key] = updateData[key];
        setParts.push(`${key} = @${key}`);
      }
    });
    
    if (setParts.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const result = await this.query(`
      UPDATE customers 
      SET ${setParts.join(', ')}, updatedAt = GETUTCDATE()
      OUTPUT INSERTED.*
      WHERE id = @userID
    `, { ...filteredData, userID });
    return result[0];
  }

  // Transaction Categories
  async getTransactionCategories(): Promise<any[]> {
    const result = await this.query(`
      SELECT id, name, direction_constraint as directionConstraint, regex_patterns as regexPatterns, 
             color, is_system as isSystem, created_at as createdAt
      FROM transaction_categories 
      ORDER BY name ASC
    `);
    return result;
  }

  async createTransactionCategory(category: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO transaction_categories (name, direction_constraint, regex_patterns, color, is_system)
      OUTPUT INSERTED.id
      VALUES (@name, @directionConstraint, @regexPatterns, @color, @isSystem)
    `, {
      name: category.name,
      directionConstraint: category.directionConstraint || null,
      regexPatterns: category.regexPatterns ? JSON.stringify(category.regexPatterns) : null,
      color: category.color,
      isSystem: category.isSystem || false
    });
    return result[0];
  }
}