'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
}

export function GlareCard({ children, className, glareColor = '#2563eb' }: GlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm',
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute h-64 w-64 rounded-full opacity-30 blur-[80px] transition-opacity"
            style={{
              background: glareColor,
              left: position.x - 128,
              top: position.y - 128,
            }}
          />
        </motion.div>
      )}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}
