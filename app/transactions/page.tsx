import { Suspense } from 'react';
import { getPaginatedTransactions, getCategories } from '@/actions/transaction-actions';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { GridBackground } from '@/components/aceternity/grid-background';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingTransactions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-40 bg-muted" />
          <Skeleton className="mt-2 h-5 w-56 bg-muted" />
        </div>
        <Skeleton className="h-10 w-24 bg-muted" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 flex-1 bg-muted" />
        <Skeleton className="h-10 w-20 bg-muted" />
        <Skeleton className="h-10 w-40 bg-muted" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const type = typeof params.type === 'string' ? params.type : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
  const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;

  const [paginatedData, categories] = await Promise.all([
    getPaginatedTransactions({ search, type, category, sortBy, page, limit: 10, startDate, endDate }),
    getCategories()
  ]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <GridBackground className="fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>
        <Suspense fallback={<LoadingTransactions />} key={`${search}-${type}-${category}-${sortBy}-${page}-${startDate}-${endDate}`}>
          <TransactionFilters 
            transactions={paginatedData.transactions} 
            categories={categories} 
            totalPages={paginatedData.totalPages}
            currentPage={paginatedData.currentPage}
            totalCount={paginatedData.totalCount}
          />
        </Suspense>
      </div>
    </div>
  );
}
