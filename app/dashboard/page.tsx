import { Suspense } from 'react';
import { getDashboardData } from '@/lib/data';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { LoadingDashboard } from '@/components/dashboard/loading-dashboard';
import { GridBackground } from '@/components/aceternity/grid-background';
import { SeedButton } from '@/components/seed-button';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <GridBackground className="fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {data.isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-3xl border border-border bg-card/80 p-12 backdrop-blur-sm max-w-lg">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <span className="text-4xl">₹</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">No Transactions Yet</h2>
              <p className="mb-8 text-muted-foreground">
                Start tracking your finances by adding your first transaction. You can also generate demo data to
                explore the dashboard features.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/add-transaction"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-foreground transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Add Transaction
                </a>
                <SeedButton />
              </div>
            </div>
          </div>
        ) : (
          <Suspense fallback={<LoadingDashboard />}>
            <DashboardContent 
              totalIncome={data.totalIncome}
              totalExpense={data.totalExpense}
              netBalance={data.netBalance}
              recentTransactions={data.recentTransactions}
              monthComparison={data.monthComparison}
              topCategory={data.topCategory}
              transactionCount={data.transactionCount}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
