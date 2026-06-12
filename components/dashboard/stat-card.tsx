'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountUp } from './count-up';
import { CardSpotlight } from '@/components/aceternity/card-spotlight';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color: 'cyan' | 'green' | 'red' | 'blue' | 'purple';
  decimals?: number;
}

const colorVariants = {
  cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400', glow: '#0891b2' },
  green: { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', icon: 'text-emerald-400', glow: '#10b981' },
  red: { bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30', icon: 'text-red-400', glow: '#ef4444' },
  blue: { bg: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', icon: 'text-blue-400', glow: '#3b82f6' },
  purple: { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', glow: '#8b5cf6' },
};

export function StatCard({ title, value, prefix = '', suffix = '', icon: Icon, trend, color, decimals = 0 }: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="h-full">
      <CardSpotlight className="rounded-3xl h-full" spotlightColor={`${colors.glow}20`}>
        <div className={cn('rounded-3xl border p-6 backdrop-blur-sm h-full flex flex-col', colors.border)}>
          <div className="flex items-start justify-between">
            <div className="rounded-xl p-3 bg-gradient-to-br from-white/5 to-white/10">
              <Icon className={cn('h-5 w-5', colors.icon)} />
            </div>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                  trend.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                )}
              >
                {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value > 0 ? '+' : ''}
                {trend.value.toFixed(1)}%
              </div>
            )}
          </div>

          <div className="mt-4 flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className={cn("mt-1 font-bold text-foreground truncate", typeof value === 'string' && value.length > 10 ? "text-2xl" : "text-3xl")}>
              {typeof value === 'number' ? (
                <CountUp end={value} prefix={prefix} suffix={suffix} decimals={decimals} />
              ) : (
                <span>
                  {prefix}
                  {value}
                  {suffix}
                </span>
              )}
            </h3>
          </div>

          {trend ? (
            <p className="mt-2 text-xs text-muted-foreground">{trend.label}</p>
          ) : (
            <p className="mt-2 text-xs text-transparent select-none" aria-hidden="true">Placeholder</p>
          )}
        </div>
      </CardSpotlight>
    </motion.div>
  );
}
