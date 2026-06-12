import { Transaction, Insight } from '@/types/transaction';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  getCategoryBreakdown,
  getLargestTransaction,
  compareMonths,
} from './calculations';
import { generateId } from './utils';

export function generateInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];

  if (transactions.length === 0) {
    return [];
  }

  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions);
  const largestTransaction = getLargestTransaction(transactions);
  const monthComparison = compareMonths(transactions);

  // Top spending category insight
  if (categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    insights.push({
      id: generateId(),
      type: 'info',
      title: `${top.category} is your top expense`,
      description: `${top.category} accounts for ${top.percentage.toFixed(1)}% of your total spending at ₹${top.amount.toFixed(2)}. Consider reviewing if this aligns with your priorities.`,
      icon: 'PieChart',
    });
  }

  // Month over month spending comparison
  if (monthComparison.change !== 0) {
    const direction = monthComparison.change > 0 ? 'increased' : 'decreased';
    const color = monthComparison.change > 0 ? 'warning' : 'success';
    insights.push({
      id: generateId(),
      type: color,
      title: `Spending ${direction} by ${Math.abs(monthComparison.change).toFixed(1)}%`,
      description:
        monthComparison.change > 0
          ? `This month you spent ₹${monthComparison.currentMonth.toFixed(2)} compared to ₹${monthComparison.previousMonth.toFixed(2)} last month. Consider reviewing recent purchases.`
          : `Great job! You spent ₹${Math.abs(monthComparison.currentMonth - monthComparison.previousMonth).toFixed(2)} less this month compared to last month.`,
      icon: monthComparison.change > 0 ? 'TrendingUp' : 'TrendingDown',
    });
  }

  // Income vs Expense analysis
  if (totalIncome > totalExpense) {
    const surplus = totalIncome - totalExpense;
    insights.push({
      id: generateId(),
      type: 'success',
      title: 'Positive cash flow',
      description: `Your income exceeded expenses by ₹${surplus.toFixed(2)}. This is a healthy financial position. Consider investing or saving the surplus.`,
      icon: 'ArrowUpRight',
    });
  } else if (totalExpense > totalIncome) {
    const deficit = totalExpense - totalIncome;
    insights.push({
      id: generateId(),
      type: 'warning',
      title: 'Spending exceeds income',
      description: `Your expenses exceeded income by ₹${deficit.toFixed(2)}. Review discretionary spending to improve your financial health.`,
      icon: 'AlertTriangle',
    });
  }

  // Category distribution insights
  if (categoryBreakdown.length >= 2) {
    const top2 = categoryBreakdown.slice(0, 2);
    if (top2[0].amount > top2[1].amount * 2) {
      insights.push({
        id: generateId(),
        type: 'tip',
        title: 'Unbalanced category spending',
        description: `${top2[0].category} spending is more than double ${top2[1].category}. Consider diversifying or evaluating if this allocation serves your goals.`,
        icon: 'Scale',
      });
    }
  }

  // Largest transaction insight
  if (largestTransaction && largestTransaction.amount > totalExpense * 0.15) {
    insights.push({
      id: generateId(),
      type: 'info',
      title: 'Notable large transaction',
      description: `Your largest transaction was ₹${largestTransaction.amount.toFixed(2)} in ${largestTransaction.category}. This represents ${((largestTransaction.amount / totalExpense) * 100).toFixed(1)}% of total expenses.`,
      icon: 'IndianRupee',
    });
  }

  // Savings potential insight
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  if (savingsRate >= 20) {
    insights.push({
      id: generateId(),
      type: 'success',
      title: 'Excellent savings rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. This is above the recommended 20% and puts you on track for financial security.`,
      icon: 'PiggyBank',
    });
  } else if (savingsRate >= 10) {
    insights.push({
      id: generateId(),
      type: 'tip',
      title: 'Good savings rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. Increasing to 20% would accelerate your financial goals significantly.`,
      icon: 'TrendingUp',
    });
  }

  // Entertainment vs Essentials
  const entertainmentCategories = ['Entertainment', 'Shopping', 'Travel'];
  const essentialCategories = ['Bills & Utilities', 'Healthcare', 'Education', 'Transportation'];

  const entertainmentSpent = categoryBreakdown
    .filter((c) => entertainmentCategories.includes(c.category))
    .reduce((sum, c) => sum + c.amount, 0);

  const essentialSpent = categoryBreakdown
    .filter((c) => essentialCategories.includes(c.category))
    .reduce((sum, c) => sum + c.amount, 0);

  if (entertainmentSpent > essentialSpent && essentialSpent > 0) {
    insights.push({
      id: generateId(),
      type: 'tip',
      title: 'Discretionary spending is high',
      description: `You're spending more on discretionary categories (₹${entertainmentSpent.toFixed(2)}) than essentials (₹${essentialSpent.toFixed(2)}). Consider balancing priorities.`,
      icon: 'Lightbulb',
    });
  }

  return insights;
}
