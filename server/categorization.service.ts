import OpenAI from 'openai';
import { azureSqlAdapter, db } from './db';
import { TransactionCategory, BankTransaction } from '../shared/schema';
// No longer using Drizzle ORM - Azure SQL only

// Initialize OpenAI - the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

export interface TransactionCategorization {
  categoryId: number;
  categoryName: string;
  confidence: number;
}

export class CategorizationService {
  private static categories: TransactionCategory[] = [];
  private static mlDisabled = false; // Flag to disable ML when quota exceeded

  // Load categories into memory for faster processing
  static async initialize() {
    // Check which database type is being used
    const dbType = process.env['AZURE_SQL_SERVER'] ? 'azure-sql' : 'postgresql';
    
    if (dbType === 'azure-sql') {
      if (!azureSqlAdapter) {
        throw new Error('Azure SQL adapter not initialized');
      }
      this.categories = await azureSqlAdapter!.getTransactionCategories();
      console.log(`✅ Loaded ${this.categories.length} transaction categories from Azure SQL`);
      
      // Fix NULL regex patterns in existing categories
      await this.fixNullPatterns();
      
      // Reload categories after fixing patterns
      this.categories = await azureSqlAdapter!.getTransactionCategories();
    } else {
      // PostgreSQL development mode - skip category loading for now
      console.log('⚠️  Transaction categories not yet implemented for PostgreSQL mode');
      this.categories = [];
    }
    
    // Create default categories if none exist
    if (this.categories.length === 0) {
      // Only create categories in Azure SQL mode for now
      if (dbType === 'azure-sql') {
        await this.createDefaultCategories();
        // Reload categories after creating them
        this.categories = await azureSqlAdapter!.getTransactionCategories();
        console.log(`✅ Created and loaded ${this.categories.length} default transaction categories`);
      }
    }
  }

  // Fix NULL regex patterns in database
  private static async fixNullPatterns() {
    const patternMap: Record<string, string[]> = {
      'Airtime': ['airtime', 'prepaid', 'fnb app prepaid', 'vodacom', 'mtn', 'cell c', 'telkom', 'mobile', 'data', 'bundles'],
      'Salary': ['salary', 'wage', 'payroll', 'income', 'fnb ob pmt'],
      'Groceries': ['supermarket', 'grocery', 'food', 'checkers', 'woolworths', 'pick n pay', 'shoprite', 'spar', 'game'],
      'Fuel': ['petrol', 'diesel', 'fuel', 'engen', 'shell', 'bp', 'caltex', 'sasol', 'taxi', 'uber', 'bolt'],
      'Entertainment': ['restaurant', 'movie', 'entertainment', 'netflix', 'dstv', 'spotify', 'takealot', 'udemy'],
      'Bills': ['bill', 'municipal', 'eskom', 'electricity', 'water', 'gas', 'city of'],
      'Investment': ['investment', 'dividend', 'interest', 'capital gain', 'payment to investment', 'datareserve'],
      'Transfer': ['transfer', 'payment', 'fnb app payment to', 'fnb app transfer from', 'fnb app transfer'],
      'ATM Withdrawal': ['atm', 'withdrawal', 'cash'],
      'Insurance': ['insurance', 'king price', 'magtape debit king price'],
      'Banking/Fees': ['bank fee', 'service fee', 'monthly account fee', 'value added serv', 'transaction fee', 'declined purch', 'bank your change', 'email sending fee'],
      'Vehicle/Car Payment': ['car payment', 'vehicle finance', 'auto loan', 'priceref', 'king priceref', 'magtape debit king priceref'],
      'Debt/Loans': ['loan', 'credit', 'installment', 'bond', 'mortgage', 'debt', 'debicheck', 'ploan', 'instlmt', 'temp loan repay']
    };

    let fixed = 0;
    for (const category of this.categories) {
      const patterns = patternMap[category.name];
      if (patterns && (!category.regexPatterns || category.regexPatterns.length === 0) && category.id) {
        try {
          await azureSqlAdapter!.updateCategoryPatterns(category.id, patterns);
          console.log(`🔧 Fixed NULL patterns for category: ${category.name}`);
          fixed++;
        } catch (error: any) {
          console.warn(`⚠️  Failed to fix patterns for ${category.name}:`, error.message);
        }
      }
    }
    
    if (fixed > 0) {
      console.log(`✅ Fixed ${fixed} categories with NULL regex patterns`);
    }
  }

  private static async createDefaultCategories() {
    if (!azureSqlAdapter) {
      throw new Error('Azure SQL adapter not initialized');
    }

    const defaultCategories = [
      // Income categories
      { name: 'Salary/Wages', directionConstraint: 'in', regexPatterns: ['salary', 'wage', 'payroll', 'income'], color: '#22c55e', isSystem: true },
      { name: 'Investment Income', directionConstraint: 'in', regexPatterns: ['dividend', 'interest', 'investment', 'capital gain'], color: '#10b981', isSystem: true },
      { name: 'Business Income', directionConstraint: 'in', regexPatterns: ['business', 'client', 'invoice', 'freelance'], color: '#06b6d4', isSystem: true },
      { name: 'Government Benefits', directionConstraint: 'in', regexPatterns: ['pension', 'grant', 'social', 'government'], color: '#8b5cf6', isSystem: true },
      { name: 'Other Income', directionConstraint: 'in', regexPatterns: [], color: '#84cc16', isSystem: true },
      
      // Expense categories  
      { name: 'Airtime', directionConstraint: 'out', regexPatterns: ['airtime', 'prepaid', 'fnb app prepaid', 'vodacom', 'mtn', 'cell c', 'telkom', 'mobile', 'data', 'bundles'], color: '#10b981', isSystem: true },
      { name: 'Groceries', directionConstraint: 'out', regexPatterns: ['supermarket', 'grocery', 'food', 'checkers', 'woolworths', 'pick n pay', 'shoprite', 'spar', 'game'], color: '#ef4444', isSystem: true },
      { name: 'Utilities', directionConstraint: 'out', regexPatterns: ['electricity', 'water', 'gas', 'municipal', 'eskom', 'city of'], color: '#f97316', isSystem: true },
      { name: 'Transport/Fuel', directionConstraint: 'out', regexPatterns: ['petrol', 'diesel', 'fuel', 'taxi', 'uber', 'bolt', 'transport'], color: '#eab308', isSystem: true },
      { name: 'Vehicle/Car Payment', directionConstraint: 'out', regexPatterns: ['car payment', 'vehicle finance', 'auto loan', 'priceref', 'king priceref', 'magtape debit king priceref'], color: '#f59e0b', isSystem: true },
      { name: 'Medical/Healthcare', directionConstraint: 'out', regexPatterns: ['medical', 'hospital', 'pharmacy', 'doctor', 'clinic', 'health'], color: '#ec4899', isSystem: true },
      { name: 'Insurance', directionConstraint: 'out', regexPatterns: ['insurance', 'life cover', 'medical aid', 'funeral', 'vehicle insurance', 'king price', 'magtape debit king price'], color: '#6366f1', isSystem: true },
      { name: 'Education', directionConstraint: 'out', regexPatterns: ['school', 'university', 'education', 'tuition', 'books', 'stationery'], color: '#8b5cf6', isSystem: true },
      { name: 'Entertainment', directionConstraint: 'out', regexPatterns: ['restaurant', 'movie', 'entertainment', 'netflix', 'dstv', 'spotify'], color: '#f59e0b', isSystem: true },
      { name: 'Clothing', directionConstraint: 'out', regexPatterns: ['clothing', 'shoes', 'fashion', 'apparel', 'edgars', 'mr price'], color: '#d946ef', isSystem: true },
      { name: 'Banking/Fees', directionConstraint: 'out', regexPatterns: ['bank fee', 'service fee', 'atm', 'transaction fee', 'monthly fee'], color: '#64748b', isSystem: true },
      { name: 'Debt/Loans', directionConstraint: 'out', regexPatterns: ['loan', 'credit', 'installment', 'bond', 'mortgage', 'debt', 'debicheck', 'ploan', 'instlmt'], color: '#dc2626', isSystem: true },
      { name: 'Other Expenses', directionConstraint: 'out', regexPatterns: [], color: '#6b7280', isSystem: true },
    ];

    // Create each category in the database (only if they don't exist)
    for (const category of defaultCategories) {
      try {
        await azureSqlAdapter.createTransactionCategory(category);
        console.log(`✅ Created default category: ${category.name}`);
      } catch (error: any) {
        // If category already exists, that's fine - skip the error
        if (!error.message.includes('duplicate') && !error.message.includes('constraint')) {
          console.warn(`⚠️  Failed to create category ${category.name}:`, error.message);
        }
      }
    }
  }

  // Rule-based categorization using regex patterns
  static async categorizeByRules(description: string, amount: number): Promise<TransactionCategorization | null> {
    const direction = amount >= 0 ? 'in' : 'out';
    const cleanDescription = description.toLowerCase().trim();

    // Debug logging for DebiCheck transactions
    if (cleanDescription.includes('debicheck')) {
      console.log(`🔍 DebiCheck transaction debug:`, {
        description: cleanDescription,
        direction,
        amount
      });
    }

    for (const category of this.categories) {
      // Skip if direction constraint doesn't match
      if (category.directionConstraint && category.directionConstraint !== direction) {
        if (cleanDescription.includes('debicheck')) {
          console.log(`⏭️  Skipped category ${category.name} - direction mismatch (${category.directionConstraint} !== ${direction})`);
        }
        continue;
      }

      const patterns = category.regexPatterns as string[] || [];
      for (const pattern of patterns) {
        if (cleanDescription.includes(pattern.toLowerCase())) {
          if (cleanDescription.includes('debicheck')) {
            console.log(`✅ DebiCheck matched pattern "${pattern}" in category ${category.name}`);
          }
          return {
            categoryId: category.id!,
            categoryName: category.name,
            confidence: 0.9 // High confidence for rule-based matches
          };
        }
      }
      
      if (cleanDescription.includes('debicheck') && category.name === 'Debt/Loans') {
        console.log(`🔍 Debt/Loans category patterns:`, patterns);
      }
    }

    if (cleanDescription.includes('debicheck')) {
      console.log(`❌ No pattern matched for DebiCheck transaction`);
    }
    return null;
  }

  // ML-based categorization using OpenAI
  static async categorizeWithML(description: string, merchant: string, amount: number): Promise<TransactionCategorization | null> {
    try {
      const direction = amount >= 0 ? 'income' : 'expense';
      const availableCategories = this.categories
        .filter(cat => !cat.directionConstraint || cat.directionConstraint === (amount >= 0 ? 'in' : 'out'))
        .map(cat => ({ id: cat.id, name: cat.name }));

      const prompt = `Categorize this South African bank transaction:
Description: "${description}"
Merchant: "${merchant || 'Unknown'}"
Amount: R${Math.abs(amount).toFixed(2)} (${direction})

Available categories:
${availableCategories.map(cat => `- ${cat.name} (ID: ${cat.id})`).join('\n')}

Return a JSON response with the best matching category ID, name, and confidence (0-1).
Format: {"categoryId": number, "categoryName": string, "confidence": number}

Consider South African context (banks: FNB, Standard Bank, ABSA, Nedbank, Capitec; stores: Woolworths, Checkers, Pick n Pay, Shoprite; fuel: Engen, Shell, BP, Caltex, Sasol).`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are a South African financial transaction categorization expert. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate the result
      if (!result.categoryId || !result.categoryName || typeof result.confidence !== 'number') {
        throw new Error('Invalid ML response format');
      }

      // Ensure the category exists in our list
      const validCategory = availableCategories.find(cat => cat.id === result.categoryId);
      if (!validCategory) {
        throw new Error('ML returned invalid category ID');
      }

      return {
        categoryId: result.categoryId,
        categoryName: result.categoryName,
        confidence: Math.max(0.1, Math.min(1.0, result.confidence))
      };

    } catch (error) {
      console.error('ML categorization failed:', error);
      
      // Check if error is quota exceeded
      if (error instanceof Error && 
          (error.message.includes('quota') || error.message.includes('insufficient_quota'))) {
        console.log('🚫 OpenAI quota exceeded - disabling ML categorization');
        this.mlDisabled = true;
      }
      
      return null;
    }
  }

  // Main categorization method - tries ML first, then rules
  static async categorizeTransaction(description: string, merchant: string, amount: number): Promise<TransactionCategorization> {
    console.log(`🔄 Categorizing: "${description}" (Amount: R${amount})`);
    
    // Try ML categorization first (if not disabled and OpenAI is configured)
    let result = null;
    if (!this.mlDisabled && openai) {
      console.log(`🤖 Trying OpenAI categorization...`);
      result = await this.categorizeWithML(description, merchant, amount);
      if (result) {
        console.log(`✅ OpenAI categorized as: ${result.categoryName} (confidence: ${result.confidence})`);
      } else {
        console.log(`⚠️ OpenAI categorization failed - falling back to rules`);
      }
    } else {
      console.log(`⏭️ Skipping OpenAI (disabled: ${this.mlDisabled}, configured: ${!!openai})`);
    }
    
    // If no ML match, try rule-based categorization
    if (!result) {
      console.log(`📋 Trying rule-based categorization...`);
      result = await this.categorizeByRules(description, amount);
      if (result) {
        console.log(`✅ Rule-based categorized as: ${result.categoryName} (confidence: ${result.confidence})`);
      }
    }

    // Fallback to default "Other" categories
    if (!result) {
      console.log(`⚠️ No match found - using default category`);
      const direction = amount >= 0 ? 'in' : 'out';
      const defaultCategory = this.categories.find(cat => 
        cat.name === (direction === 'in' ? 'Other Income' : 'Other Expenses')
      );
      
      if (defaultCategory && defaultCategory.id) {
        result = {
          categoryId: defaultCategory.id,
          categoryName: defaultCategory.name,
          confidence: 0.1
        };
      } else {
        throw new Error('No default category found');
      }
    }

    return result!; // We ensure result is always assigned above
  }

  // Recategorize transactions (for manual overrides or reprocessing)
  static async recategorizeTransactions(transactionIds: number[]): Promise<void> {
    // TODO: Implement recategorization in Azure SQL adapter
    throw new Error('Transaction recategorization not yet implemented for Azure SQL mode');
  }

  // Get all categories for frontend
  static getCategories(): TransactionCategory[] {
    return this.categories;
  }
}