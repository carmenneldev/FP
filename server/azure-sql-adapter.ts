import * as sql from 'mssql';

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
    return await this.query(`
      SELECT id, firstName, surname, identityNumber, mobileNumber, emailAddress, 
             physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number,
             createdAt, updatedAt, profileImageUrl
      FROM financialAdvisors 
      ORDER BY createdAt DESC
    `);
  }

  async getFinancialAdvisorById(id: number): Promise<any> {
    const result = await this.query(`
      SELECT id, firstName, surname, identityNumber, mobileNumber, emailAddress, 
             physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number,
             createdAt, updatedAt, profileImageUrl
      FROM financialAdvisors 
      WHERE id = @id
    `, { id });
    return result[0] || null;
  }

  async createFinancialAdvisor(advisor: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO financialAdvisors (firstName, surname, identityNumber, mobileNumber, emailAddress, 
                                   physicalAddress1, physicalAddress2, provinceID, postalCode, fsca_Number)
      OUTPUT INSERTED.*
      VALUES (@firstName, @surname, @identityNumber, @mobileNumber, @emailAddress, 
              @physicalAddress1, @physicalAddress2, @provinceID, @postalCode, @fsca_Number)
    `, advisor);
    return result[0];
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
    return await this.query(`
      SELECT id, name, code
      FROM provinces 
      ORDER BY name
    `);
  }

  async createProvince(province: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO provinces (name, code)
      OUTPUT INSERTED.*
      VALUES (@name, @code)
    `, province);
    return result[0];
  }

  // Customers
  async getCustomers(): Promise<any[]> {
    return await this.query(`
      SELECT c.id, c.firstName, c.surname, c.identityNumber, c.mobileNumber, c.emailAddress,
             c.physicalAddress1, c.physicalAddress2, c.provinceID, c.postalCode,
             c.maritalStatusID, c.preferredLanguageID, c.qualificationID, c.profileImageUrl,
             c.createdAt, c.updatedAt,
             ms.name as maritalStatusName,
             pl.name as preferredLanguageName,
             p.name as provinceName,
             q.name as qualificationName
      FROM customers c
      LEFT JOIN maritalStatuses ms ON c.maritalStatusID = ms.id
      LEFT JOIN preferredLanguages pl ON c.preferredLanguageID = pl.id
      LEFT JOIN provinces p ON c.provinceID = p.id
      LEFT JOIN qualifications q ON c.qualificationID = q.id
      ORDER BY c.createdAt DESC
    `);
  }

  async createCustomer(customer: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO customers (firstName, surname, identityNumber, mobileNumber, emailAddress,
                           physicalAddress1, physicalAddress2, provinceID, postalCode,
                           maritalStatusID, preferredLanguageID, qualificationID)
      OUTPUT INSERTED.*
      VALUES (@firstName, @surname, @identityNumber, @mobileNumber, @emailAddress,
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
      SELECT id, customerID, originalFileName, displayName, storagePath, mimeType, fileHash,
             uploadStatus, error, transactionCount, totalIn, totalOut, netAmount,
             uploadedAt, processedAt
      FROM bankStatements 
      WHERE customerID = @customerID
      ORDER BY uploadedAt DESC
    `, { customerID });
  }

  async getBankStatementById(id: number): Promise<any> {
    const result = await this.query(`
      SELECT id, customerID, originalFileName, displayName, storagePath, mimeType, fileHash,
             uploadStatus, error, transactionCount, totalIn, totalOut, netAmount,
             uploadedAt, processedAt
      FROM bankStatements 
      WHERE id = @id
    `, { id });
    return result[0] || null;
  }

  async createBankStatement(statement: any): Promise<any> {
    const result = await this.query(`
      INSERT INTO bankStatements (customerID, originalFileName, displayName, storagePath, mimeType, fileHash, uploadStatus)
      OUTPUT INSERTED.*
      VALUES (@customerID, @originalFileName, @displayName, @storagePath, @mimeType, @fileHash, @uploadStatus)
    `, statement);
    return result[0];
  }

  // Bank Transactions
  async getTransactionSummary(customerID: number, fromDate?: string, toDate?: string): Promise<any> {
    let whereClause = 'WHERE customerID = @customerID';
    let params: any = { customerID };

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
      FROM bankTransactions 
      ${whereClause}
    `, params);

    return result[0] || { totalIn: 0, totalOut: 0, totalTransactions: 0 };
  }

  async getTransactionsByCategory(customerID: number, fromDate?: string, toDate?: string): Promise<any[]> {
    let whereClause = 'WHERE bt.customerID = @customerID';
    let params: any = { customerID };

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
        bt.categoryID,
        tc.name as categoryName,
        SUM(bt.amount) as total,
        COUNT(*) as count
      FROM bankTransactions bt
      LEFT JOIN transactionCategories tc ON bt.categoryID = tc.id
      ${whereClause}
      GROUP BY bt.categoryID, tc.name
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
}