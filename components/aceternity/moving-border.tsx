'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MovingBorderProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
}

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
}: MovingBorderProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl p-[2px]', containerClassName)}>
      <div
        className="absolute inset-0 animate-moving-border before:absolute before:inset-0 before:opacity-40 before:blur-xl"
        style={
          {
            '--duration': `${duration}ms`,
            backgroundImage:
              'linear-gradient(90deg, #2563eb, #0891b2, #10b981, #14b8a6, #2563eb)',
          } as React.CSSProperties
        }
      />
      <div className={cn('relative rounded-2xl bg-card backdrop-blur-sm', className)}>
        {children}
      </div>
    </div>
  );
}

export function MovingBorderButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <MovingBorder containerClassName={cn('inline-flex', className)}>
      <motion.button
        onClick={onClick}
        className="group relative inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-zinc-800"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
    </MovingBorder>
  );
}
