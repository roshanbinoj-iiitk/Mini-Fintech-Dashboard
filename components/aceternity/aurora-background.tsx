'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col min-h-screen items-center justify-center',
        'bg-background transition-colors duration-500',
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'pointer-events-none absolute -inset-[10px] opacity-50',
            '[--aurora:repeating-linear-gradient(100deg,var(--color1)_10%,var(--color2)_15%,var(--color3)_22%,var(--color4)_30%,var(--color1)_40%)]',
            '[background-image:var(--aurora)]',
            '[background-size:300%_200%]',
            '[background-position:50%_50%]',
            'filter blur-[100px]',
            'animate-aurora',
            'after:content-[""] after:absolute after:inset-0',
            'after:[background-image:var(--aurora)] after:[background-size:200%_100%]',
            'after:[background-position:50%_50%] dark:after:mix-blend-difference after:blur-[40px]',
            'after:animate-aurora after:opacity-60'
          )}
          style={
            {
              '--color1': '#2563eb',
              '--color2': '#0891b2',
              '--color3': '#10b981',
              '--color4': '#14b8a6',
            } as React.CSSProperties
          }
        />
      </div>
      {showRadialGradient && (
        <div
          className={cn(
            'absolute inset-0',
            'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.3)_70%,rgba(255,255,255,0.7)_100%)]',
            'dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_70%,rgba(0,0,0,0.7)_100%)]'
          )}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
