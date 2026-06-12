import { Suspense } from 'react';
import { getAnalyticsData } from '@/lib/data';
import { AnalyticsCharts } from '@/components/charts/analytics-charts';
import { GridBackground } from '@/components/aceternity/grid-background';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl bg-muted" />
        <Skeleton className="h-80 rounded-2xl bg-muted md:col-span-2" />
        <Skeleton className="h-80 rounded-2xl bg-muted" />
        <Skeleton className="h-80 rounded-2xl bg-muted md:col-span-2" />
        <Skeleton className="h-80 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <GridBackground className="fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Visualize your spending patterns and trends</p>
        </div>

        <Suspense fallback={<LoadingAnalytics />}>
          <AnalyticsCharts 
            categoryData={data.categoryData}
            monthlyData={data.monthlyData}
            largestIncome={data.largestIncome}
            largestExpense={data.largestExpense}
            totalExpense={data.totalExpense}
            totalIncome={data.totalIncome}
          />
        </Suspense>
      </div>
    </div>
  );
}
