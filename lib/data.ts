import { getTransactions } from '@/actions/transaction-actions';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  getRecentTransactions,
  compareMonths,
  getTopSpendingCategoryThisMonth,
  getCategoryBreakdown,
  getMonthlySpending,
  getLargestIncome,
  getLargestExpense,
} from '@/lib/calculations';

export async function getDashboardData() {
  const transactions = await getTransactions();
  
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  
  return {
    isEmpty: transactions.length === 0,
    transactionCount: transactions.length,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    recentTransactions: getRecentTransactions(transactions, 5),
    monthComparison: compareMonths(transactions),
    topCategory: getTopSpendingCategoryThisMonth(transactions),
  };
}

export async function getAnalyticsData() {
  const transactions = await getTransactions();
  
  return {
    isEmpty: transactions.length === 0,
    categoryData: getCategoryBreakdown(transactions),
    monthlyData: getMonthlySpending(transactions),
    largestIncome: getLargestIncome(transactions),
    largestExpense: getLargestExpense(transactions),
    totalExpense: calculateTotalExpense(transactions),
    totalIncome: calculateTotalIncome(transactions),
  };
}
