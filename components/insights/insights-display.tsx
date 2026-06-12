'use client';

import { motion } from 'framer-motion';
import { Transaction, Insight } from '@/types/transaction';
import { generateInsights } from '@/lib/insights';
import { CardSpotlight } from '@/components/aceternity/card-spotlight';
import { EvervaultCard } from '@/components/aceternity/evervault-card';
import { AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Lightbulb, PieChart, DollarSign, Scale, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsDisplayProps {
  transactions: Transaction[];
}

const iconMap: Record<string, React.ElementType> = {
  PieChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PiggyBank,
  Lightbulb,
  DollarSign,
  Scale,
  ArrowUpRight,
  Sparkles,
};

const typeStyles = {
  info: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  warning: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', icon: 'text-amber-400' },
  success: { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
  tip: { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
};

export function InsightsDisplay({ transactions }: InsightsDisplayProps) {
  const insights = generateInsights(transactions);

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 mb-6">
          <Sparkles className="h-12 w-12 text-cyan-400" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">No Insights Yet</h2>
        <p className="max-w-md text-muted-foreground">Add some transactions to generate personalized financial insights and recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-2"
        >
          <Sparkles className="h-5 w-5 text-foreground" />
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI-Powered Insights</h2>
          <p className="text-sm text-muted-foreground">Based on your financial patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.icon] || Lightbulb;
          const styles = typeStyles[insight.type];

          return (
            <motion.div key={insight.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
              <CardSpotlight
                className="rounded-2xl"
                spotlightColor={
                  styles.icon === 'text-cyan-400'
                    ? '#0891b220'
                    : styles.icon === 'text-amber-400'
                    ? '#f59e0b20'
                    : styles.icon === 'text-emerald-400'
                    ? '#10b98120'
                    : '#8b5cf620'
                }
              >
                <div className={cn('rounded-2xl border bg-gradient-to-br p-6', styles.border, styles.bg)}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-white/10 p-3">
                      <Icon className={cn('h-5 w-5', styles.icon)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: insights.length * 0.1 }}>
        <EvervaultCard className="mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4">
                <PiggyBank className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Financial Health Score</h3>
                <p className="text-sm text-muted-foreground">Based on income vs expenses and spending patterns</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {calculateHealthScore(transactions)}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">Good</p>
            </div>
          </div>
        </EvervaultCard>
      </motion.div>
    </div>
  );
}

function calculateHealthScore(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome === 0) return 30;

  const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
  const baseScore = Math.min(50 + savingsRate * 1.5, 95);

  return Math.max(20, Math.round(baseScore));
}
