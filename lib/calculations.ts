import { Transaction, MonthlyData, CategoryData, DashboardStats, categoryColors } from '@/types/transaction';
import { getISTDateString } from '@/lib/utils';

function extractYearMonth(dateVal: any): [number, number] {
  let dateStr = '';
  if (dateVal instanceof Date) {
    dateStr = getISTDateString(dateVal);
  } else if (typeof dateVal === 'string') {
    dateStr = dateVal.includes('T') ? dateVal.split('T')[0] : dateVal;
  } else {
    dateStr = getISTDateString(new Date(String(dateVal)));
  }
  const [y, m] = dateStr.split('-').map(Number);
  return [y, m];
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateNetBalance(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
}

export function getTopSpendingCategory(transactions: Transaction[]): string | null {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return null;

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || null;
}

export function getMonthlySpending(transactions: Transaction[]): MonthlyData[] {
  const monthlyData: Record<string, { income: number; expense: number }> = {};

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedTransactions.forEach((t) => {
    const [year, month] = extractYearMonth(t.date);
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expense: 0 };
    }

    if (t.type === 'income') {
      monthlyData[key].income += t.amount;
    } else {
      monthlyData[key].expense += t.amount;
    }
  });

  return Object.entries(monthlyData)
    .map(([key, data]) => ({
      month: key,
      ...data,
    }))
    .slice(-12);
}

export function getAverageMonthlyExpense(transactions: Transaction[]): number {
  const monthlySpending = getMonthlySpending(transactions);
  if (monthlySpending.length === 0) return 0;

  const totalExpense = monthlySpending.reduce((sum, m) => sum + m.expense, 0);
  return totalExpense / monthlySpending.length;
}

export function getLargestTransaction(transactions: Transaction[]): Transaction | null {
  if (transactions.length === 0) return null;
  return transactions.reduce((max, t) => (t.amount > max.amount ? t : max));
}

export function getCategoryBreakdown(transactions: Transaction[]): CategoryData[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  if (totalExpense === 0) return [];

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpense) * 100,
      color: categoryColors[category] || '#71717a',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getDashboardStats(transactions: Transaction[]): DashboardStats {
  return {
    totalIncome: calculateTotalIncome(transactions),
    totalExpense: calculateTotalExpense(transactions),
    netBalance: calculateNetBalance(transactions),
    transactionCount: transactions.length,
    topExpenseCategory: getTopSpendingCategory(transactions),
    averageMonthlyExpense: getAverageMonthlyExpense(transactions),
    largestTransaction: getLargestTransaction(transactions),
  };
}

export function getRecentTransactions(transactions: Transaction[], limit: number = 5): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function compareMonths(
  transactions: Transaction[]
): { currentMonth: number; previousMonth: number; change: number } {
  const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const now = new Date(nowStr);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  let previousYear = currentYear;
  let previousMonth = currentMonth - 1;
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear -= 1;
  }

  const currentMonthExpenses = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const [y, m] = extractYearMonth(t.date);
      return y === currentYear && m === currentMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const previousMonthExpenses = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const [y, m] = extractYearMonth(t.date);
      return y === previousYear && m === previousMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const change =
    previousMonthExpenses > 0
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : 0;

  return {
    currentMonth: currentMonthExpenses,
    previousMonth: previousMonthExpenses,
    change,
  };
}
