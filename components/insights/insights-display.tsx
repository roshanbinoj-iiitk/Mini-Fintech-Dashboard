'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { AIInsightsResponse } from '@/types/insights';
import { CardSpotlight } from '@/components/aceternity/card-spotlight';
import { EvervaultCard } from '@/components/aceternity/evervault-card';
import { AlertTriangle, TrendingUp, PiggyBank, Lightbulb, PieChart, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  calculateTotalIncome,
  calculateTotalExpense,
  getCategoryBreakdown,
  getLargestTransaction,
  compareMonths,
} from '@/lib/calculations';

interface InsightsDisplayProps {
  transactions: Transaction[];
}

const typeStyles = {
  info: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400', DefaultIcon: PieChart },
  warning: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', icon: 'text-amber-400', DefaultIcon: AlertTriangle },
  success: { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', icon: 'text-emerald-400', DefaultIcon: TrendingUp },
  tip: { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', DefaultIcon: Lightbulb },
};

export function InsightsDisplay({ transactions }: InsightsDisplayProps) {
  const [aiResponse, setAiResponse] = useState<AIInsightsResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentHash = `${transactions.length}-${calculateTotalExpense(transactions)}`;

  useEffect(() => {
    const cached = localStorage.getItem('ai_insights_cache');
    const cachedTime = localStorage.getItem('ai_insights_timestamp');
    const cachedHash = localStorage.getItem('ai_insights_hash');

    if (cached && cachedHash === currentHash) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAiResponse(JSON.parse(cached));
        if (cachedTime) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLastGenerated(cachedTime);
        }
      } catch (_e) {
        console.error('Failed to parse cached insights');
      }
    } else {
      localStorage.removeItem('ai_insights_cache');
      localStorage.removeItem('ai_insights_timestamp');
      localStorage.removeItem('ai_insights_hash');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAiResponse(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastGenerated(null);
    }
  }, [currentHash]);

  const handleGenerate = async () => {
    if (transactions.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const totalIncome = calculateTotalIncome(transactions);
      const totalExpense = calculateTotalExpense(transactions);
      const categoryBreakdown = getCategoryBreakdown(transactions);
      const largestTransaction = getLargestTransaction(transactions);
      const monthComparison = compareMonths(transactions);
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

      const metrics = {
        totalIncome,
        totalExpense,
        netCashFlow: totalIncome - totalExpense,
        savingsRate,
        categoryBreakdown,
        largestTransaction,
        monthComparison
      };

      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate insights');
      }

      const data: AIInsightsResponse = await res.json();
      setAiResponse(data);
      
      const now = new Date().toLocaleString();
      setLastGenerated(now);
      localStorage.setItem('ai_insights_cache', JSON.stringify(data));
      localStorage.setItem('ai_insights_timestamp', now);
      localStorage.setItem('ai_insights_hash', currentHash);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating insights. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (transactions.length === 0) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-2"
          >
            <Sparkles className="h-5 w-5 text-foreground" />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI-Powered Insights</h2>
            <p className="text-sm text-muted-foreground">
              {lastGenerated ? `Last generated: ${lastGenerated}` : 'Based on your financial patterns'}
            </p>
          </div>
        </div>
        
        <Button 
          id="tour-generate-insights"
          onClick={handleGenerate} 
          disabled={isGenerating} 
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300"
        >
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isGenerating ? 'Analyzing Data...' : aiResponse ? 'Regenerate Insights' : 'Generate AI Insights'}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {isGenerating ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl bg-muted" />
            ))}
          </div>
          <Skeleton className="h-32 rounded-2xl bg-muted" />
        </div>
      ) : !aiResponse ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-3xl bg-secondary/30">
          <div className="rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 mb-6">
            <Sparkles className="h-12 w-12 text-cyan-400" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Unlock AI Insights</h2>
          <p className="max-w-md text-muted-foreground mb-6">Analyze your transaction history using LLaMA to get personalized recommendations and actionable financial advice.</p>
        </div>
      ) : (
        <div id="tour-insights-results">
          <div className="mb-6 p-4 rounded-2xl bg-secondary/50 border border-border">
            <p className="text-foreground text-sm md:text-base leading-relaxed">{aiResponse.summary}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {aiResponse.insights.map((insight, index) => {
              const styles = typeStyles[insight.type] || typeStyles.info;
              const Icon = styles.DefaultIcon;

              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <CardSpotlight
                    className="rounded-2xl h-full"
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
                    <div className={cn('rounded-2xl border bg-gradient-to-br p-6 h-full flex flex-col', styles.border, styles.bg)}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="rounded-xl bg-secondary p-3 shrink-0">
                          <Icon className={cn('h-5 w-5', styles.icon)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                      {insight.recommendation && (
                        <div className="mt-auto pt-4 border-t border-border/50">
                          <p className="text-sm font-medium text-foreground/90">
                            <span className={cn("inline-block mr-2", styles.icon)}>Recommendation:</span>
                            {insight.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardSpotlight>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: aiResponse.insights.length * 0.1 }}>
            <EvervaultCard className="mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4">
                    <PiggyBank className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">AI Financial Health Score</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive evaluation of your financial data</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {aiResponse.healthScore}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {aiResponse.healthScore >= 80 ? 'Excellent' : aiResponse.healthScore >= 60 ? 'Good' : aiResponse.healthScore >= 40 ? 'Fair' : 'Needs Attention'}
                  </p>
                </div>
              </div>
            </EvervaultCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
