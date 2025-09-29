import { Customer } from './customer.model';
import { BudgetExpenseCategory } from './budget-expense-category.model';

export interface Budget {
  id: number;
  customerID: number;
  fy: number;
  month: number;
  income: number;
  expenseCategoryID: number;
  value: number;
  customer?: Customer;
  expenseCategory?: BudgetExpenseCategory;
}