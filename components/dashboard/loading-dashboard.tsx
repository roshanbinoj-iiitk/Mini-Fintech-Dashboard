'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function LoadingDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-32 bg-muted" />
          <Skeleton className="mt-2 h-5 w-48 bg-muted" />
        </div>
        <Skeleton className="h-5 w-24 bg-muted" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-border bg-card/70 p-6">
            <div className="flex items-start justify-between">
              <Skeleton className="h-11 w-11 rounded-xl bg-muted" />
              <Skeleton className="h-6 w-16 rounded-full bg-muted" />
            </div>
            <Skeleton className="mt-4 h-4 w-24 bg-muted" />
            <Skeleton className="mt-2 h-8 w-32 bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-card/70 p-6">
          <Skeleton className="h-6 w-40 bg-muted" />
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-6">
          <Skeleton className="h-6 w-24 bg-muted" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-28 bg-muted" />
                <Skeleton className="h-4 w-16 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
