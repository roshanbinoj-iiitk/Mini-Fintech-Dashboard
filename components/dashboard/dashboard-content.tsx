'use client';

import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, PiggyBank, PieChart } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { StatCard } from './stat-card';
import { RecentTransactions } from './recent-transactions';
import { BentoCard, BentoGrid } from '@/components/aceternity/bento-grid';
import { CountUp } from './count-up';
import { calculateTotalIncome, calculateTotalExpense, getRecentTransactions, compareMonths, getTopSpendingCategoryThisMonth } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';

interface DashboardContentProps {
  transactions: Transaction[];
}

export function DashboardContent({ transactions }: DashboardContentProps) {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpense = calculateTotalExpense(transactions);
  const netBalance = totalIncome - totalExpense;
  const recentTransactions = getRecentTransactions(transactions, 5);
  const monthComparison = compareMonths(transactions);
  const topCategory = getTopSpendingCategoryThisMonth(transactions);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your financial overview.</p>
        </div>
        <div className="text-sm text-muted-foreground">{transactions.length} transactions recorded</div>
      </div>

      <div id="tour-dashboard-metrics" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Income" value={totalIncome} prefix="₹" icon={TrendingUp} color="green" />
        <StatCard
          title="Total Expenses"
          value={totalExpense}
          prefix="₹"
          icon={TrendingDown}
          color="red"
          trend={
            Math.abs(monthComparison.change) > 0
              ? {
                  value: monthComparison.change,
                  isPositive: monthComparison.change < 0,
                  label: monthComparison.change > 0 ? 'vs last month' : 'Down from last month',
                }
              : undefined
          }
        />
        <StatCard
          title="Net Balance"
          value={netBalance}
          prefix="₹"
          icon={Wallet}
          color={netBalance >= 0 ? 'cyan' : 'red'}
        />
        <StatCard title="Top Category (This Month)" value={topCategory || 'N/A'} icon={PieChart} color="purple" />
      </div>

      <BentoGrid className="mt-8">
        <BentoCard className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
            <motion.a href="/transactions" className="text-sm text-cyan-400 hover:text-cyan-300" whileHover={{ x: 2 }}>
              View All
            </motion.a>
          </div>
          <RecentTransactions transactions={recentTransactions} />
        </BentoCard>

        <BentoCard className="md:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-6">Quick Stats</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg. Monthly Expense</span>
              <span className="font-semibold text-foreground">
                <CountUp end={totalExpense / 6} prefix="₹" decimals={0} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-semibold text-red-400">
                <CountUp end={monthComparison.currentMonth} prefix="₹" decimals={0} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Month</span>
              <span className="font-semibold text-muted-foreground">
                <CountUp end={monthComparison.previousMonth} prefix="₹" decimals={0} />
              </span>
            </div>
            <div className="h-px bg-border my-4" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Savings Rate</span>
              <span
                className={`font-semibold ${
                  totalIncome > 0 && (totalIncome - totalExpense) / totalIncome >= 0.2 ? 'text-emerald-400' : 'text-muted-foreground'
                }`}
              >
                {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-2 lg:col-span-3">
          <h2 className="text-lg font-semibold text-foreground mb-6">Income vs Expenses</h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>
                <span className="text-emerald-400">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                />
              </div>
            </div>
            <div className="flex-1 md:ml-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="text-red-400">{formatCurrency(totalExpense)}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(totalExpense / (totalIncome + totalExpense)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                />
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
