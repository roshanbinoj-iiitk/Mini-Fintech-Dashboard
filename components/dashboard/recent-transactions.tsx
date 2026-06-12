'use client';

import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction, categoryColors } from '@/types/transaction';
import { ArrowUpRight, ArrowDownLeft, CircleDot } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CircleDot className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => {
        const isIncome = transaction.type === 'income';
        const color = categoryColors[transaction.category] || '#71717a';

        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-accent p-4 transition-all hover:border-white/10 hover:bg-accent"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-foreground"
              style={{ backgroundColor: `${color}30` }}
            >
              {isIncome ? (
                <ArrowDownLeft className="h-5 w-5" style={{ color }} />
              ) : (
                <ArrowUpRight className="h-5 w-5" style={{ color }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{transaction.category}</p>
              <p className="text-sm text-muted-foreground truncate">
                {transaction.note || formatDate(transaction.date)}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold" style={{ color: isIncome ? '#10b981' : '#ef4444' }}>
                {isIncome ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
