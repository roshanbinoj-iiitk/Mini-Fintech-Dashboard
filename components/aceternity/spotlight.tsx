'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
  return (
    <svg
      className={cn('animate-spotlight pointer-events-none absolute z-[1] opacity-0', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.29"
          cy="273.501"
          rx="1924.29"
          ry="273.501"
          transform="matrix(-0.962263 -0.272131 0.272131 -0.962263 3589.79 1263.47)"
          fill={fill ?? 'white'}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_3433" />
        </filter>
      </defs>
    </svg>
  );
}
