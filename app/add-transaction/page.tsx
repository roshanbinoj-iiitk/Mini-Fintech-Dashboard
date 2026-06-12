import { Suspense } from 'react';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { GridBackground } from '@/components/aceternity/grid-background';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingForm() {
  return (
    <div className="mx-auto max-w-xl">
      <Skeleton className="mb-6 h-6 w-32 bg-muted" />
      <div className="rounded-3xl border border-border bg-card/80 p-8">
        <Skeleton className="mb-6 h-8 w-48 bg-muted" />
        <Skeleton className="mb-6 h-28 w-full rounded-xl bg-muted" />
        <Skeleton className="mb-6 h-12 w-full bg-muted" />
        <Skeleton className="mb-6 h-12 w-full bg-muted" />
        <Skeleton className="mb-6 h-12 w-full bg-muted" />
        <Skeleton className="mb-8 h-12 w-full bg-muted" />
        <Skeleton className="h-14 w-full bg-muted" />
      </div>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <GridBackground className="fixed inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <Suspense fallback={<LoadingForm />}>
          <TransactionForm />
        </Suspense>
      </div>
    </div>
  );
}
