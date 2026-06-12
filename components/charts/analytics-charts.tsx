'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Transaction, categoryColors } from '@/types/transaction';
import { getCategoryBreakdown, getMonthlySpending, getLargestIncome, getLargestExpense, calculateTotalIncome, calculateTotalExpense } from '@/lib/calculations';
import { formatCurrency, formatMonth } from '@/lib/utils';
import { BentoCard, BentoGrid } from '@/components/aceternity/bento-grid';
import { TrendingUp, TrendingDown, IndianRupee, PiggyBank } from 'lucide-react';
import { useTheme } from 'next-themes';
import { CountUp } from '@/components/dashboard/count-up';

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export function AnalyticsCharts({ transactions }: AnalyticsChartsProps) {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  const categoryData = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlySpending(transactions);
  const largestIncome = getLargestIncome(transactions);
  const largestExpense = getLargestExpense(transactions);

  const totalExpense = calculateTotalExpense(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const averageMonthlyExpense = monthlyData.length > 0 ? monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length : 0;

  return (
    <div id="tour-analytics-charts" className="space-y-6">
      <BentoGrid>
        <BentoCard className="md:col-span-2 lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="amount"
                    nameKey="category"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="none"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-background p-3 shadow-md">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: data.color }} />
                              <p className="font-semibold text-foreground">{data.category}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-muted-foreground flex justify-between gap-4">
                                <span>Amount:</span> 
                                <span className="font-medium text-foreground">{formatCurrency(data.amount)}</span>
                              </p>
                              <p className="text-sm text-muted-foreground flex justify-between gap-4">
                                <span>Share:</span> 
                                <span className="font-medium text-foreground">{data.percentage.toFixed(1)}%</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 w-full space-y-2">
                {categoryData.slice(0, 5).map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground">{cat.category}</span>
                    </div>
                    <span className="text-foreground">{cat.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">No expense data yet</div>
          )}
        </BentoCard>

        <BentoCard className="md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Monthly Income vs Expenses</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#e4e4e7"} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickFormatter={(value) => formatMonth(value + '-01')}
                />
                <YAxis tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#000',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => formatMonth(label + '-01')}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">No monthly data yet</div>
          )}
        </BentoCard>

        <BentoCard className="md:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Key Metrics</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/20 p-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={totalIncome} prefix="₹" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-red-500/20 p-3">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={totalExpense} prefix="₹" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-cyan-500/20 p-3">
                <PiggyBank className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Monthly Expense</p>
                <p className="text-xl font-bold text-foreground">
                  <CountUp end={averageMonthlyExpense} prefix="₹" decimals={0} />
                </p>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Largest Credit</h3>
          {largestIncome ? (
            <div className="text-center py-4">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20"
              >
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(largestIncome.amount)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{largestIncome.category}</p>
              <p className="text-xs text-muted-foreground">{formatMonth(largestIncome.date)}</p>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">No credit yet</div>
          )}
        </BentoCard>

        <BentoCard className="md:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Largest Debit</h3>
          {largestExpense ? (
            <div className="text-center py-4">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20"
              >
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(largestExpense.amount)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{largestExpense.category}</p>
              <p className="text-xs text-muted-foreground">{formatMonth(largestExpense.date)}</p>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">No debit yet</div>
          )}
        </BentoCard>

        <BentoCard className="md:col-span-2 lg:col-span-3">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Spending Categories</h3>
          {categoryData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.slice(0, 6).map((cat, index) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{cat.category}</span>
                    <span className="text-foreground">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">No data yet</div>
          )}
        </BentoCard>


      </BentoGrid>
    </div>
  );
}
