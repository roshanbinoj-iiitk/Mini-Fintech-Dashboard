'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface EvervaultCardProps {
  children: React.ReactNode;
  className?: string;
}

export function EvervaultCard({ children, className }: EvervaultCardProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-xl" />
      <div className="relative rounded-2xl border border-border bg-card/90 p-6 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute inset-0 animate-evervault-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
        {children}
      </div>
    </div>
  );
}
