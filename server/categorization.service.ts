import OpenAI from 'openai';
import { db } from './db';
import { transactionCategories, bankTransactions, TransactionCategory, BankTransaction } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

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
    this.categories = await db.select().from(transactionCategories);
    
    // Create default categories if none exist
    if (this.categories.length === 0) {
      await this.createDefaultCategories();
      this.categories = await db.select().from(transactionCategories);
    }
  }

  private static async createDefaultCategories() {
    const defaultCategories = [
      // Income categories
      { name: 'Salary/Wages', directionConstraint: 'in', regexPatterns: ['salary', 'wage', 'payroll', 'income'], color: '#22c55e', isSystem: true },
      { name: 'Investment Income', directionConstraint: 'in', regexPatterns: ['dividend', 'interest', 'investment', 'capital gain'], color: '#10b981', isSystem: true },
      { name: 'Business Income', directionConstraint: 'in', regexPatterns: ['business', 'client', 'invoice', 'freelance'], color: '#06b6d4', isSystem: true },
      { name: 'Government Benefits', directionConstraint: 'in', regexPatterns: ['pension', 'grant', 'social', 'government'], color: '#8b5cf6', isSystem: true },
      { name: 'Other Income', directionConstraint: 'in', regexPatterns: [], color: '#84cc16', isSystem: true },
      
      // Expense categories
      { name: 'Groceries', directionConstraint: 'out', regexPatterns: ['supermarket', 'grocery', 'food', 'checkers', 'woolworths', 'pick n pay', 'shoprite'], color: '#ef4444', isSystem: true },
      { name: 'Utilities', directionConstraint: 'out', regexPatterns: ['electricity', 'water', 'gas', 'municipal', 'eskom', 'city of'], color: '#f97316', isSystem: true },
      { name: 'Transport/Fuel', directionConstraint: 'out', regexPatterns: ['petrol', 'diesel', 'fuel', 'taxi', 'uber', 'bolt', 'transport'], color: '#eab308', isSystem: true },
      { name: 'Medical/Healthcare', directionConstraint: 'out', regexPatterns: ['medical', 'hospital', 'pharmacy', 'doctor', 'clinic', 'health'], color: '#ec4899', isSystem: true },
      { name: 'Insurance', directionConstraint: 'out', regexPatterns: ['insurance', 'life cover', 'medical aid', 'funeral', 'vehicle insurance'], color: '#6366f1', isSystem: true },
      { name: 'Education', directionConstraint: 'out', regexPatterns: ['school', 'university', 'education', 'tuition', 'books', 'stationery'], color: '#8b5cf6', isSystem: true },
      { name: 'Entertainment', directionConstraint: 'out', regexPatterns: ['restaurant', 'movie', 'entertainment', 'netflix', 'dstv', 'spotify'], color: '#f59e0b', isSystem: true },
      { name: 'Clothing', directionConstraint: 'out', regexPatterns: ['clothing', 'shoes', 'fashion', 'apparel', 'edgars', 'mr price'], color: '#d946ef', isSystem: true },
      { name: 'Banking/Fees', directionConstraint: 'out', regexPatterns: ['bank fee', 'service fee', 'atm', 'transaction fee', 'monthly fee'], color: '#64748b', isSystem: true },
      { name: 'Debt/Loans', directionConstraint: 'out', regexPatterns: ['loan', 'credit', 'installment', 'bond', 'mortgage', 'debt'], color: '#dc2626', isSystem: true },
      { name: 'Other Expenses', directionConstraint: 'out', regexPatterns: [], color: '#6b7280', isSystem: true },
    ];

    await db.insert(transactionCategories).values(defaultCategories);
  }

  // Rule-based categorization using regex patterns
  static async categorizeByRules(description: string, amount: number): Promise<TransactionCategorization | null> {
    const direction = amount >= 0 ? 'in' : 'out';
    const cleanDescription = description.toLowerCase().trim();

    for (const category of this.categories) {
      // Skip if direction constraint doesn't match
      if (category.directionConstraint && category.directionConstraint !== direction) {
        continue;
      }

      const patterns = category.regexPatterns as string[] || [];
      for (const pattern of patterns) {
        if (cleanDescription.includes(pattern.toLowerCase())) {
          return {
            categoryId: category.id,
            categoryName: category.name,
            confidence: 0.9 // High confidence for rule-based matches
          };
        }
      }
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

  // Main categorization method - tries rules first, then ML
  static async categorizeTransaction(description: string, merchant: string, amount: number): Promise<TransactionCategorization> {
    // Try rule-based categorization first
    let result = await this.categorizeByRules(description, amount);
    
    // If no rule match, try ML categorization (only if not disabled)
    if (!result && !this.mlDisabled) {
      result = await this.categorizeWithML(description, merchant, amount);
    }

    // Fallback to default "Other" categories
    if (!result) {
      const direction = amount >= 0 ? 'in' : 'out';
      const defaultCategory = this.categories.find(cat => 
        cat.name === (direction === 'in' ? 'Other Income' : 'Other Expenses')
      );
      
      if (defaultCategory) {
        result = {
          categoryId: defaultCategory.id,
          categoryName: defaultCategory.name,
          confidence: 0.1
        };
      } else {
        throw new Error('No default category found');
      }
    }

    return result;
  }

  // Recategorize transactions (for manual overrides or reprocessing)
  static async recategorizeTransactions(transactionIds: number[]): Promise<void> {
    const transactions = await db.select()
      .from(bankTransactions)
      .where(sql`${bankTransactions.id} = ANY(${transactionIds})`);

    for (const transaction of transactions) {
      const categorization = await this.categorizeTransaction(
        transaction.description,
        transaction.merchant || '',
        parseFloat(transaction.amount)
      );

      await db.update(bankTransactions)
        .set({
          categoryID: categorization.categoryId,
          confidence: categorization.confidence.toString(),
          updatedAt: new Date()
        })
        .where(eq(bankTransactions.id, transaction.id));
    }
  }

  // Get all categories for frontend
  static getCategories(): TransactionCategory[] {
    return this.categories;
  }
}