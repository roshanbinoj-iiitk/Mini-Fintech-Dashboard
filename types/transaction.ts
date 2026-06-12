export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export const categories = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Home & Garden',
    'Gifts & Donations',
    'Office Expenses',
    'Other',
  ],
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Business',
    'Rental Income',
    'Dividends',
    'Interest',
    'Bonus',
    'Refund',
    'Other',
  ],
} as const;

export const categoryColors: Record<string, string> = {
  'Food & Dining': '#ef4444',
  'Transportation': '#f97316',
  'Shopping': '#eab308',
  'Entertainment': '#22c55e',
  'Bills & Utilities': '#14b8a6',
  'Healthcare': '#06b6d4',
  'Education': '#3b82f6',
  'Travel': '#8b5cf6',
  'Personal Care': '#ec4899',
  'Home & Garden': '#84cc16',
  'Gifts & Donations': '#f43f5e',
  'Office Expenses': '#6366f1',
  'Salary': '#10b981',
  'Freelance': '#14b8a6',
  'Investments': '#8b5cf6',
  'Business': '#64748b',
  'Rental Income': '#f59e0b',
  'Dividends': '#22c55e',
  'Interest': '#06b6d4',
  'Bonus': '#ec4899',
  'Refund': '#f97316',
  'Other': '#71717a',
};

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  topExpenseCategory: string | null;
  averageMonthlyExpense: number;
  largestTransaction: Transaction | null;
}

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'tip';
  title: string;
  description: string;
  icon: string;
}
