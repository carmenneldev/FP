import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import Papa from 'papaparse';
import { db, initializeAzureSQL, checkDatabaseHealth, dbConfig } from './db';

// Conditional PDF parsing import with error handling for Azure deployment
let pdfParse: any = null;
try {
  pdfParse = require('pdf-parse');
  console.log('✅ PDF parsing module loaded successfully');
} catch (error: any) {
  console.warn('⚠️  PDF parsing module failed to load. PDF bank statement uploads will be disabled.', error?.message || 'Unknown error');
}
import { DatabaseService } from './database-service';
import { 
  // Table definitions removed for Azure SQL mode - using types only
  type InsertFinancialAdvisor,
  type InsertUserCredential,
  type InsertBankStatement,
  type InsertBankTransaction
} from '../shared/schema';
// No longer using Drizzle ORM - Azure SQL only
import { CategorizationService } from './categorization.service';

const app = express();
const PORT = parseInt(process.env['PORT'] || process.env['WEBSITES_PORT'] || '8080');
// Enforce JWT secret in production
const JWT_SECRET = process.env['JWT_SECRET'];
if (!JWT_SECRET) {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('JWT_SECRET environment variable must be set in production');
  }
  console.warn('⚠️  Using default JWT secret for development. Set JWT_SECRET environment variable for production.');
}
const SAFE_JWT_SECRET = JWT_SECRET || 'dev-only-secret-change-for-production';

// Initialize services and start server
async function initializeApp() {
  try {
    // Initialize Azure SQL if needed
    await initializeAzureSQL();
    
    // Initialize categorization service
    await CategorizationService.initialize();
    console.log('✅ Categorization service initialized');
    
    // Only start server if this file is executed directly (development mode)
    // In production, server.js handles the server startup
    if (require.main === module) {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Development server running on port ${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🌐 External access: https://4c78b2fc-0624-450f-87fa-d68904955935-00-13oubrciiekpk.worf.replit.dev:${PORT}/api/health`);
      });
    } else {
      console.log(`✅ Server module initialized for production (database connected)`);
    }
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
}

// Always initialize the application (both when imported and run directly)
initializeApp();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow both CSV and PDF files for bank statement uploads (with fallback for Azure)
    const allowedMimes = pdfParse 
      ? ['text/csv', 'application/pdf']
      : ['text/csv'];
    const allowedExtensions = pdfParse 
      ? ['.csv', '.pdf']
      : ['.csv'];
    
    if (allowedMimes.includes(file.mimetype) || 
        allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
      cb(null, true);
    } else {
      const message = pdfParse 
        ? 'Only CSV and PDF files are allowed for bank statement uploads'
        : 'Only CSV files are allowed (PDF parsing unavailable in this environment)';
      cb(new Error(message));
    }
  }
});

// Configure multer for profile image uploads
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/profile-images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with user ID and timestamp
    const user = (req as any).user;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `profile-${user.userID}-${uniqueSuffix}${extension}`);
  }
});

const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (allowedMimes.includes(file.mimetype) || 
        allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, GIF, WebP) are allowed'));
    }
  }
});

// Middleware
// CORS configuration - simplified for production server.js to handle
if (require.main === module) {
  // Only apply CORS in development mode
  app.use(cors({
    origin: ['https://4c78b2fc-0624-450f-87fa-d68904955935-00-13oubrciiekpk.worf.replit.dev:5000', 'https://4c78b2fc-0624-450f-87fa-d68904955935-00-13oubrciiekpk.worf.replit.dev', 'http://localhost:5000'],
    credentials: true
  }));
}
app.use(express.json());

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  console.log('🔐 Auth middleware called for:', req.method, req.url);
  const authHeader = req.headers['authorization'];
  console.log('📡 Authorization header:', authHeader ? 'Present' : 'Missing');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token found, returning 401');
    return res.sendStatus(401);
  }

  console.log('🎟️ Token found, verifying...');
  jwt.verify(token, SAFE_JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.sendStatus(403);
    }
    console.log('✅ Token verified for user:', user.username);
    req.user = user;
    next();
  });
};

// ===== AUTHENTICATION ENDPOINTS =====

// Login endpoint
app.post('/api/UserCredential/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    

    // Find user by username
    const userCred = await DatabaseService.getUserCredentialByUsername(username);

    if (!userCred) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userCred.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user details based on userType
    let userData = null;
    if (userCred.userType === 'Advisor') {
      userData = await DatabaseService.getFinancialAdvisorById(userCred.userID);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userCred.id, 
        username: userCred.username, 
        userType: userCred.userType,
        userID: userCred.userID
      },
      SAFE_JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await DatabaseService.updateUserLastLogin(userCred.id);

    res.json({
      token,
      user: { ...userCred, passwordHash: undefined }, // Don't send password hash
      userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return;
});

// ===== PROVINCE ENDPOINTS =====

// Get all Provinces
app.get('/api/Province', async (req, res) => {
  try {
    console.log('🌍 Fetching provinces list');
    console.log('🔍 Database type:', dbConfig.type);
    const provinces = await DatabaseService.getProvinces();
    console.log(`✅ Found ${provinces.length} provinces`);
    res.json(provinces);
  } catch (error) {
    console.error('❌ Error fetching provinces:', error);
    console.error('❌ Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.constructor.name : 'Unknown',
      code: (error as any)?.code,
      number: (error as any)?.number,
      originalError: (error as any)?.originalError
    });
    res.status(500).json({ 
      error: 'Failed to fetch provinces',
      debug: {
        dbType: dbConfig.type,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Create Province (for data management)
app.post('/api/Province', authenticateToken, async (req, res) => {
  try {
    console.log('🌍 Creating new province:', req.body);
    const newProvince = await DatabaseService.createProvince(req.body);
    console.log('✅ Province created successfully:', newProvince);
    res.status(201).json(newProvince);
  } catch (error) {
    console.error('❌ Error creating province:', error);
    res.status(500).json({ error: 'Failed to create province' });
  }
});

// ===== FINANCIAL ADVISOR ENDPOINTS =====

// Create Financial Advisor
app.post('/api/FinancialAdvisor', async (req, res) => {
  try {
    console.log('📧 Financial Advisor registration request received');
    console.log('📧 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📧 Database type:', dbConfig.type);
    
    const { id, createdAt, updatedAt, ...clientData } = req.body;
    
    // Only include fields that should be set by client, let DB handle ID and timestamps
    const advisorData: InsertFinancialAdvisor = {
      firstName: clientData.firstName,
      surname: clientData.surname,
      identityNumber: clientData.identityNumber,
      mobileNumber: clientData.mobileNumber,
      emailAddress: clientData.emailAddress,
      physicalAddress1: clientData.physicalAddress1,
      physicalAddress2: clientData.physicalAddress2,
      provinceID: clientData.provinceID,
      postalCode: clientData.postalCode,
      fsca_Number: clientData.fsca_Number
      // Let database handle id (auto-generated), createdAt/updatedAt (defaultNow)
    };
    
    console.log('📧 Processed advisor data for database:', JSON.stringify(advisorData, null, 2));
    
    const newAdvisor = await DatabaseService.createFinancialAdvisor(advisorData);
    console.log('✅ Advisor created successfully:', JSON.stringify(newAdvisor, null, 2));

    res.status(201).json(newAdvisor);
  } catch (error) {
    console.error('❌ Error creating advisor:', error);
    
    // Enhanced error details for Azure debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      sqlError: error && typeof error === 'object' && 'code' in error ? {
        code: (error as any).code,
        constraint: (error as any).constraint,
        detail: (error as any).detail,
        originalError: (error as any).originalError
      } : null,
      requestBody: req.body,
      databaseType: dbConfig.type,
      timestamp: new Date().toISOString()
    };
    
    console.error('❌ Full error details:', JSON.stringify(errorDetails, null, 2));
    
    // Check for unique constraint violations in DrizzleQueryError
    if (error && typeof error === 'object' && 'cause' in error) {
      const cause = error.cause as any;
      if (cause && cause.code === '23505') { // PostgreSQL unique violation code
        if (cause.constraint?.includes('email')) {
          return res.status(400).json({ error: 'Email address already exists' });
        } else if (cause.constraint?.includes('identity_number')) {
          return res.status(400).json({ error: 'Identity number already exists' });
        } else {
          return res.status(400).json({ error: 'This advisor already exists' });
        }
      }
    }
    
    // Check for Azure SQL specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      const sqlError = error as any;
      if (sqlError.code === 'EREQUEST') {
        console.error('🔍 Azure SQL Request Error - likely schema or connection issue');
      } else if (sqlError.code === 'ELOGIN') {
        console.error('🔍 Azure SQL Login Error - authentication issue');
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to create advisor',
      details: process.env['NODE_ENV'] === 'development' ? errorDetails.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
  return;
});

// Get all Financial Advisors
app.get('/api/FinancialAdvisor', authenticateToken, async (req, res) => {
  try {
    const advisors = await DatabaseService.getFinancialAdvisors();
    res.json(advisors);
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
});

// Get Financial Advisor by ID
app.get('/api/FinancialAdvisor/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const advisor = await DatabaseService.getFinancialAdvisorById(id);

    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    res.json(advisor);
  } catch (error) {
    console.error('Error fetching advisor:', error);
    res.status(500).json({ error: 'Failed to fetch advisor' });
  }
  return;
});

// ===== USER CREDENTIAL ENDPOINTS =====

// Create User Credential (for registration)
app.post('/api/UserCredential', async (req, res) => {
  try {
    const { passwordHash, createdAt, updatedAt, lastLogin, ...otherData } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    
    // Only include the fields that should be set by client, let DB handle timestamps
    const userCredData: InsertUserCredential = {
      userType: otherData.userType,
      userID: otherData.userID,
      username: otherData.username,
      isActive: otherData.isActive ?? true,
      passwordHash: hashedPassword
      // Let database handle createdAt/updatedAt with defaultNow()
    };
    
    const userCredWithoutPassword = await DatabaseService.createUserCredential(userCredData);
    res.status(201).json(userCredWithoutPassword);
  } catch (error) {
    console.error('Error creating user credential:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user credential' });
    }
  }
});

// ===== CUSTOMER ENDPOINTS =====

// Get all Customers
app.get('/api/Customer', authenticateToken, async (req, res) => {
  try {
    const customerList = await DatabaseService.getCustomers();
    res.json(customerList);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create Customer
app.post('/api/Customer', authenticateToken, async (req, res) => {
  try {
    const newCustomer = await DatabaseService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update Customer
app.put('/api/Customer/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id: bodyId, createdAt, updatedAt, ...updateData } = req.body;
    
    const updatedCustomer = await DatabaseService.updateCustomer(id, updateData);

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
  return;
});

// ===== OTHER DATA MANAGEMENT ENDPOINTS =====

// Marital Status endpoints
app.get('/api/MaritalStatus', async (req, res) => {
  try {
    const statuses = await DatabaseService.getMaritalStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marital statuses' });
  }
});

app.post('/api/MaritalStatus', authenticateToken, async (req, res) => {
  try {
    const newStatus = await DatabaseService.createMaritalStatus(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marital status' });
  }
});

// Preferred Language endpoints
app.get('/api/PreferredLanguage', async (req, res) => {
  try {
    const languages = await DatabaseService.getPreferredLanguages();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

app.post('/api/PreferredLanguage', authenticateToken, async (req, res) => {
  try {
    const newLanguage = await DatabaseService.createPreferredLanguage(req.body);
    res.status(201).json(newLanguage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create language' });
  }
});

// Policy Type endpoints
app.get('/api/PolicyType', async (req, res) => {
  try {
    const types = await DatabaseService.getPolicyTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch policy types' });
  }
});

// Policy endpoints
app.get('/api/Policy', authenticateToken, async (req, res) => {
  try {
    const policyList = await DatabaseService.getPolicies();
    
    // Map database field names to frontend expected field names
    const mappedPolicies = policyList.map((policy: any) => ({
      ...policy,
      policyInitiationDate: policy.startDate,
      policyExpirationDate: policy.endDate,
      customerID: policy.customerID,
      policyName: policy.policyName || policy.policyNumber, // Use policy name from database, fallback to number
      underwritten: policy.isActive ? 'Yes' : 'No',
      value: policy.premiumAmount || policy.coverageAmount || 0
    }));
    
    res.json(mappedPolicies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
});

app.post('/api/Policy', authenticateToken, async (req, res) => {
  try {
    const { policyName, policyNumber, policyTypeID, customerID, value, policyInitiationDate, policyExpirationDate, underwritten } = req.body;
    
    console.log('Received policy data:', req.body);
    
    // Use provided policy number or auto-generate if empty
    const finalPolicyNumber = policyNumber && policyNumber.trim() 
      ? policyNumber.trim() 
      : `POL-${Date.now()}`;
    
    // Map frontend fields to database schema
    const policyData = {
      policyName: policyName || finalPolicyNumber, // Save the policy name from frontend
      policyNumber: finalPolicyNumber,
      customerID: parseInt(customerID), // Use the actual customer ID from frontend
      policyTypeID: parseInt(policyTypeID),
      premiumAmount: value ? value.toString() : null,
      coverageAmount: value ? value.toString() : null,
      startDate: policyInitiationDate ? new Date(policyInitiationDate) : null,
      endDate: policyExpirationDate ? new Date(policyExpirationDate) : null,
      isActive: true
    };
    
    console.log('Creating policy with mapped data:', policyData);
    
    const newPolicy = await DatabaseService.createPolicy(policyData);
      
    res.status(201).json(newPolicy);
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({ error: 'Failed to create policy' });
  }
});

// Qualification endpoints
app.get('/api/Qualification', async (req, res) => {
  try {
    const qualificationList = await DatabaseService.getQualifications();
    res.json(qualificationList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch qualifications' });
  }
});

// ===== BANK STATEMENT ENDPOINTS =====

// Upload bank statement for a customer
app.post('/api/Customer/:id/Statement', authenticateToken, upload.single('statement'), async (req, res) => {
  try {
    const customerId = parseInt(req.params['id']);
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Calculate file hash for duplicate detection
    const fileBuffer = fs.readFileSync(file.path);
    const fileHash = createHash('sha256').update(fileBuffer).digest('hex');

    // Allow duplicate uploads - only handle filename versioning
    // Note: Users may want to upload the same statement multiple times
    // for different analysis or testing purposes

    // Generate smart displayName for the new file
    const baseFileName = path.parse(file.originalname).name;
    const fileExtension = path.parse(file.originalname).ext;
    
    // Check for existing statements with same original filename
    // Check for duplicate statement using Azure SQL adapter
    const existingStatements = await DatabaseService.getBankStatementsByCustomer(customerId);
    const existingWithSameName = existingStatements.filter(s => s.fileName === file.originalname);

    let displayName: string;
    if (existingWithSameName.length === 0) {
      // First file with this name - use original
      displayName = file.originalname;
    } else {
      // Auto-version: append (v2), (v3), etc.
      const versionNumber = existingWithSameName.length + 1;
      displayName = `${baseFileName} (v${versionNumber})${fileExtension}`;
    }

    // Create bank statement record
    const statementData: InsertBankStatement = {
      customerID: customerId,
      fileName: file.originalname,
      displayName: displayName,
      storagePath: file.path,
      mimeType: file.mimetype,
      fileHash: fileHash,
      uploadStatus: 'uploaded'
    };

    const newStatement = await DatabaseService.createBankStatement(statementData);

    // Process the file asynchronously
    processStatementFile(newStatement.id, file.path);

    res.status(201).json({
      statementId: newStatement.id,
      fileName: newStatement.originalFileName,
      displayName: newStatement.displayName,
      status: 'uploaded',
      message: 'File uploaded successfully and is being processed'
    });
  } catch (error) {
    console.error('Error uploading statement:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path); // Clean up file on error
    }
    res.status(500).json({ error: 'Failed to upload statement' });
  }
  return;
});

// Get all statements for a customer
app.get('/api/Customer/:id/Statements', authenticateToken, async (req, res) => {
  try {
    const customerId = parseInt(req.params['id']);
    const statements = await DatabaseService.getBankStatementsByCustomer(customerId);
    
    res.json(statements);
  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

// Get statement processing status
app.get('/api/Statements/:id/status', authenticateToken, async (req, res) => {
  try {
    const statementId = parseInt(req.params.id);
    const statement = await DatabaseService.getBankStatementById(statementId);
    
    if (!statement) {
      return res.status(404).json({ error: 'Statement not found' });
    }

    res.json({
      id: statement.id,
      status: statement.uploadStatus,
      error: statement.error,
      transactionCount: statement.transactionCount,
      totalIn: statement.totalIn,
      totalOut: statement.totalOut,
      netAmount: statement.netAmount,
      processedAt: statement.processedAt
    });
  } catch (error) {
    console.error('Error fetching statement status:', error);
    res.status(500).json({ error: 'Failed to fetch statement status' });
  }
  return;
});

// Get transaction summary for customer dashboard
app.get('/api/Customer/:id/TransactionSummary', authenticateToken, async (req, res) => {
  try {
    const customerId = parseInt(req.params['id']);
    const { from, to } = req.query;
    
    // Use Azure SQL adapter for transaction summary
    const fromDate = from ? from as string : undefined;
    const toDate = to ? to as string : undefined;

    // Use Azure SQL adapter for transaction summary
    const summary = await DatabaseService.getTransactionSummary(customerId, fromDate, toDate);
    const totals = {
      totalIn: summary.totalIn || 0,
      totalOut: summary.totalOut || 0,
      count: summary.transactionCount || 0
    };

    // Use Azure SQL adapter for category breakdown
    const categoryBreakdown = await DatabaseService.getTransactionsByCategory(customerId, fromDate, toDate);

    // Use Azure SQL adapter for latest statements
    const allStatements = await DatabaseService.getBankStatementsByCustomer(customerId);
    const latestStatements = allStatements.slice(0, 5); // TODO: Add limit/ordering to adapter method

    res.json({
      totals: {
        totalIn: totals.totalIn || 0,
        totalOut: Math.abs(totals.totalOut || 0),
        netAmount: (totals.totalIn || 0) - Math.abs(totals.totalOut || 0),
        transactionCount: totals.count || 0
      },
      categoryBreakdown,
      latestStatements
    });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Failed to fetch transaction summary' });
  }
});

// Get transactions for a statement
app.get('/api/Statements/:id/Transactions', authenticateToken, async (req, res) => {
  try {
    const statementId = parseInt(req.params.id);
    const { categoryId, direction, search, page = 1, size = 50, sort = 'txnDate' } = req.query;
    
    // Azure SQL mode - statement transactions not yet implemented
    const transactions: any[] = [];

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get ALL transactions for a customer (across all statements)
app.get('/api/Customer/:id/Transactions', authenticateToken, async (req, res) => {
  try {
    const customerId = parseInt(req.params['id']);
    const { categoryId, direction, search, page = 1, size = 100, sort = 'txnDate', from, to } = req.query;
    
    // Azure SQL mode - customer transactions not yet implemented
    const transactions: any[] = [];

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    res.status(500).json({ error: 'Failed to fetch customer transactions' });
  }
});

// Manual category override for a transaction
app.post('/api/Transactions/:id/Category', authenticateToken, async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const { categoryId } = req.body;
    
    await DatabaseService.updateTransactionCategory(transactionId, categoryId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating transaction category:', error);
    res.status(500).json({ error: 'Failed to update transaction category' });
  }
});

// Get all transaction categories
app.get('/api/TransactionCategories', async (req, res) => {
  try {
    const categories = CategorizationService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Process statement file function
async function processStatementFile(statementId: number, filePath: string) {
  try {
    console.log(`Processing statement ${statementId}...`);
    
    // Azure SQL mode - get statement and update status
    const statement = await DatabaseService.getBankStatementById(statementId);

    if (!statement) {
      throw new Error('Statement not found');
    }

    // Parse file based on type
    const fileExtension = path.extname(filePath).toLowerCase();
    let transactions;
    
    if (fileExtension === '.pdf') {
      if (!pdfParse) {
        throw new Error('PDF parsing is not available in this environment. Please upload a CSV file instead.');
      }
      transactions = await parsePDFFile(filePath);
    } else {
      transactions = await parseCSVFile(filePath);
    }
    
    console.log(`Parsed ${transactions.length} transactions from ${fileExtension} file`);
    
    // Process and categorize each transaction
    let totalIn = 0;
    let totalOut = 0;
    const processedTransactions: InsertBankTransaction[] = [];

    for (const txn of transactions) {
      const amount = parseFloat(txn.amount);
      const direction = amount >= 0 ? 'in' : 'out';
      
      if (direction === 'in') {
        totalIn += amount;
      } else {
        totalOut += Math.abs(amount);
      }

      // Categorize transaction
      const categorization = await CategorizationService.categorizeTransaction(
        txn.description,
        txn.merchant || '',
        amount
      );

      processedTransactions.push({
        statementID: statementId,
        customerID: statement.customerID,
        txnDate: new Date(txn.date),
        description: txn.description,
        merchant: txn.merchant,
        amount: amount.toFixed(2),
        direction,
        balance: txn.balance ? parseFloat(txn.balance).toFixed(2) : undefined,
        categoryID: categorization.categoryId,
        confidence: categorization.confidence.toFixed(4),
        rawData: txn
      });
    }

    // Insert all transactions
    if (processedTransactions.length > 0) {
      await DatabaseService.insertBankTransactions(processedTransactions);
    }

    // Update statement with totals and completion status
    await DatabaseService.updateBankStatementCompletion(
      statementId,
      totalIn.toFixed(2),
      totalOut.toFixed(2),
      (totalIn - totalOut).toFixed(2),
      processedTransactions.length
    );

    console.log(`✅ Statement ${statementId} processed successfully`);
    
    // Clean up file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  } catch (error) {
    console.error(`❌ Error processing statement ${statementId}:`, error);
    
    await DatabaseService.updateBankStatementError(
      statementId, 
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

// Parse CSV file function
async function parseCSVFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize common header variations
        const h = header.toLowerCase().trim();
        if (h.includes('date')) return 'date';
        if (h.includes('description') || h.includes('detail')) return 'description';
        if (h.includes('amount') || h.includes('value')) return 'amount';
        if (h.includes('balance')) return 'balance';
        if (h.includes('merchant') || h.includes('reference')) return 'merchant';
        return h.replace(/[^a-zA-Z0-9]/g, '');
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing errors: ' + results.errors.map(e => e.message).join(', ')));
          return;
        }
        resolve(results.data || []);
      },
      error: reject
    });
  });
}

// Parse PDF file function (restored with Azure deployment safety)
async function parsePDFFile(filePath: string): Promise<any[]> {
  if (!pdfParse) {
    throw new Error('PDF parsing is not available in this environment');
  }
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    
    console.log('PDF Text Length:', text.length);
    console.log('PDF Text Preview (first 200 chars):', text.substring(0, 200));
    
    // Extract transaction lines using common bank statement patterns
    const lines = text.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
    console.log('Total lines found:', lines.length);
    
    const transactions: any[] = [];
    
    // Simple patterns for common bank statement formats
    const transactionPatterns = [
      // FNB Pattern: "13 Jun FNB App Transfer From Tech 1,500.00 Cr 2,523.01 Cr"
      /(\d{1,2}\s+\w{3})\s+(.+?)\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s+(Cr|Dr)?\s*(\d{1,3}(?:,\d{3})*\.\d{2})\s+(Cr|Dr)?/,
      
      // Standard Pattern: Date Description Amount Balance
      /(\d{1,2}[\s\/\-]\w{3}[\s\/\-]\d{4}|\d{1,2}[\s\/\-]\d{1,2}[\s\/\-]\d{4})\s+(.+?)\s+([\-\+]?\d{1,3}(?:,\d{3})*\.?\d{0,2})\s+([\-\+]?\d{1,3}(?:,\d{3})*\.?\d{0,2})?/
    ];

    console.log(`Trying ${transactionPatterns.length} different parsing patterns...`);
    
    for (const line of lines) {
      // Skip header lines and other non-transaction lines
      if (line.toLowerCase().includes('statement') ||
          line.toLowerCase().includes('balance') ||
          line.toLowerCase().includes('account') ||
          line.length < 15) {
        continue;
      }
      
      // Try each pattern to extract transaction data
      for (let i = 0; i < transactionPatterns.length; i++) {
        const pattern = transactionPatterns[i];
        const match = line.match(pattern);
        
        if (match) {
          let date, description, amount, balance;
          
          if (i === 0) {
            // FNB Pattern
            const [, rawDate, desc, txnAmount, txnCrDr, balanceAmount, balanceCrDr] = match;
            date = rawDate?.trim();
            description = desc?.trim() || 'Transaction';
            amount = txnAmount?.replace(/,/g, '');
            balance = balanceAmount?.replace(/,/g, '');
            
            // Apply direction based on Cr/Dr indicators
            if (txnCrDr !== 'Cr') {
              amount = `-${amount}`;
            }
          } else {
            // Standard Pattern
            [, date, description, amount, balance] = match;
          }
          
          // Clean and standardize the data
          const numAmount = parseAmount(amount || '0');
          const numBalance = balance ? parseAmount(balance) : null;
          
          if (!isNaN(numAmount) && date && description) {
            // Parse date to standard format
            const parsedDate = parseFlexibleDate(date);
            
            transactions.push({
              date: parsedDate.toISOString().split('T')[0],
              description: description.trim(),
              amount: numAmount.toString(),
              merchant: extractMerchantFromDescription(description.trim()),
              balance: numBalance ? numBalance.toString() : null
            });
          }
          break; // Found a match, don't try other patterns
        }
      }
    }
    
    console.log(`Extracted ${transactions.length} transactions from PDF`);
    return transactions;

  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF bank statement');
  }
}

// Helper function to parse flexible date formats
function parseFlexibleDate(dateStr: string): Date {
  // Just trim whitespace, don't normalize spaces for DD MMM format
  const cleaned = dateStr.trim();
  
  // Try different date formats
  const formats = [
    // DD MMM (e.g., "14 Apr") - common in FNB statements - try this first
    /^(\d{1,2})\s+(\w{3})$/,
    // DD-MMM-YYYY (e.g., "01-Jan-2024")
    /^(\d{1,2})\s*(\w{3})\s*(\d{4})$/,
    // DD/MM/YYYY or DD/MM/YY
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/,
    // MM/DD/YYYY or MM/DD/YY  
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/,
    // YYYY/MM/DD
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
  ];
  
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                     'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  for (const format of formats) {
    const match = cleaned.toLowerCase().match(format);
    if (match) {
      if (format === formats[0]) {
        // Handle DD MMM format (e.g., "14 Apr") - smart year inference for bank statements
        const day = parseInt(match[1]);
        const monthIndex = monthNames.indexOf(match[2].toLowerCase());
        const currentYear = new Date().getFullYear();
        if (monthIndex !== -1) {
          // For bank statements, try current year first, then work backwards
          let year = currentYear;
          let parsedDate = new Date(year, monthIndex, day);
          
          // If date is in the future, try previous years (bank statements are historical)
          while (parsedDate > new Date() && year > currentYear - 5) {
            year--;
            parsedDate = new Date(year, monthIndex, day);
          }
          
          return parsedDate;
        }
      } else if (format === formats[1]) {
        // Handle DD-MMM-YYYY format
        const day = parseInt(match[1]);
        const monthIndex = monthNames.indexOf(match[2].toLowerCase());
        const year = parseInt(match[3]);
        if (monthIndex !== -1) {
          return new Date(year, monthIndex, day);
        }
      } else if (format === formats[4]) {
        // Handle YYYY/MM/DD format
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      } else {
        // Handle DD/MM/YYYY or MM/DD/YYYY (assume DD/MM/YYYY for international)
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1; // Month is 0-indexed
        let year = parseInt(match[3]);
        if (year < 100) year += 2000; // Handle 2-digit years
        return new Date(year, month, day);
      }
    }
  }
  
  // Fallback to current date if parsing fails
  console.warn(`Could not parse date: ${dateStr}, using current date`);
  return new Date();
}

// Helper function to parse amounts with commas, parentheses, and DR/CR indicators
function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  
  // Clean the string and handle common formats
  let cleaned = amountStr.trim().toUpperCase();
  
  // Handle DR/CR indicators
  let isNegative = false;
  if (cleaned.includes('DR') || cleaned.includes('DEBIT')) {
    isNegative = true;
    cleaned = cleaned.replace(/DR|DEBIT/g, '').trim();
  } else if (cleaned.includes('CR') || cleaned.includes('CREDIT')) {
    cleaned = cleaned.replace(/CR|CREDIT/g, '').trim();
  }
  
  // Handle parentheses (often indicate negative amounts)
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    isNegative = true;
    cleaned = cleaned.slice(1, -1);
  }
  
  // Remove currency symbols and thousands separators
  cleaned = cleaned
    .replace(/[$£€¥₹]/g, '') // Remove currency symbols
    .replace(/,/g, '') // Remove thousands separators
    .replace(/[^\d\.\-\+]/g, '') // Keep only digits, decimal points, and signs
    .trim();
  
  // Handle leading/trailing signs
  if (cleaned.startsWith('-') || cleaned.startsWith('+')) {
    if (cleaned.startsWith('-')) isNegative = !isNegative;
    cleaned = cleaned.slice(1);
  }
  if (cleaned.endsWith('-')) {
    isNegative = true;
    cleaned = cleaned.slice(0, -1);
  }
  
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  
  return isNegative ? -Math.abs(parsed) : parsed;
}

// Helper function to extract merchant name from description
function extractMerchantFromDescription(description: string): string {
  // Remove common prefixes/suffixes and clean up the merchant name
  let merchant = description
    .replace(/^(PURCHASE|PAYMENT|TRANSFER|DEBIT|CREDIT)\s+/i, '')
    .replace(/\s+(PURCHASE|PAYMENT|TRANSFER|DEBIT|CREDIT)$/i, '')
    .replace(/\s*\d{2}\/\d{2}\/\d{4}\s*/, '')
    .replace(/\s*\d{4}-\d{2}-\d{2}\s*/, '')
    .replace(/\s*\*+\d+\s*/, '') // Remove card number masks
    .trim();
    
  // Take first part if there are multiple parts separated by common delimiters
  const parts = merchant.split(/[\-\#\*\s]{2,}/);
  return parts[0].trim() || merchant;
}

// ===== PROFILE MANAGEMENT ENDPOINTS =====

// Get current user's profile data
app.get('/api/Profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    let profile = null;

    if (user.userType === 'Advisor') {
      // Fetch financial advisor profile
      profile = await DatabaseService.getFinancialAdvisorById(user.userID);
    } else if (user.userType === 'Client') {
      // Fetch customer profile
      // Azure SQL mode - get customer by ID
      const customer = await DatabaseService.getCustomerById(user.userID);
      profile = customer;
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
  return;
});

// Update current user's profile data
app.put('/api/Profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated via this endpoint
    const { id, createdAt, ...updateData } = updates;
    updateData.updatedAt = new Date();

    let updatedProfile = null;

    if (user.userType === 'Advisor') {
      // Update financial advisor profile
      updatedProfile = await DatabaseService.updateAdvisorProfile(user.userID, updateData);
    } else if (user.userType === 'Client') {
      // Update customer profile  
      updatedProfile = await DatabaseService.updateCustomerProfile(user.userID, updateData);
    }

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle unique constraint violations
    if (error && typeof error === 'object' && 'cause' in error) {
      const cause = error.cause as any;
      if (cause && cause.code === '23505') {
        if (cause.constraint?.includes('email')) {
          return res.status(400).json({ error: 'Email address already exists' });
        } else if (cause.constraint?.includes('identity_number')) {
          return res.status(400).json({ error: 'Identity number already exists' });
        }
      }
    }
    
    res.status(500).json({ error: 'Failed to update profile' });
  }
  return;
});

// Upload profile picture
app.post('/api/Profile/avatar', authenticateToken, uploadProfileImage.single('avatar'), async (req, res) => {
  try {
    const user = (req as any).user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate the URL for the uploaded file
    const avatarUrl = `/uploads/profile-images/${file.filename}`;
    
    // Update the user's profile with the new avatar URL
    if (user.userType === 'Advisor') {
      await DatabaseService.updateAdvisorProfile(user.userID, { profileImageUrl: avatarUrl });
    } else if (user.userType === 'Client') {
      await DatabaseService.updateCustomerProfile(user.userID, { profileImageUrl: avatarUrl });
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      avatarUrl: avatarUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
  return;
});

// Remove profile picture
app.delete('/api/Profile/avatar', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Remove the profile image URL from the database
    if (user.userType === 'Advisor') {
      await DatabaseService.updateAdvisorProfile(user.userID, { profileImageUrl: null });
    } else if (user.userType === 'Client') {
      await DatabaseService.updateCustomerProfile(user.userID, { profileImageUrl: null });
    }

    res.json({
      message: 'Profile picture removed successfully'
    });
  } catch (error) {
    console.error('Error removing profile picture:', error);
    res.status(500).json({ error: 'Failed to remove profile picture' });
  }
});

// Serve uploaded profile images
app.use('/uploads/profile-images', express.static(path.join(__dirname, '../uploads/profile-images')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConfig.type,
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// Export the main app directly - server.js will handle the mounting
export const router = app;

// Note: Server startup is now handled in initializeApp() function above