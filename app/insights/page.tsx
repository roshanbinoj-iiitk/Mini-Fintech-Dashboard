import { Suspense } from 'react';
import { getTransactions } from '@/actions/transaction-actions';
import { InsightsDisplay } from '@/components/insights/insights-display';
import { GridBackground } from '@/components/aceternity/grid-background';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-9 w-9 rounded-full bg-muted" />
        <div>
          <Skeleton className="h-5 w-32 bg-muted" />
          <Skeleton className="mt-1 h-4 w-48 bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-2xl bg-muted" />
    </div>
  );
}

export default async function InsightsPage() {
  const transactions = await getTransactions();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <GridBackground className="fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Insights</h1>
          <p className="text-muted-foreground">AI-powered recommendations for smarter financial decisions</p>
        </div>

        <Suspense fallback={<LoadingInsights />}>
          <InsightsDisplay transactions={transactions} />
        </Suspense>
      </div>
    </div>
  );
}
