
"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import type { PoemSettings } from '@/lib/types';

interface LoadingOverlayProps {
  isDescriptionLoading: boolean;
  isPoemLoading: boolean;
  poemSettings: PoemSettings; // Needed for the poem loading message
}

export function LoadingOverlay({ isDescriptionLoading, isPoemLoading, poemSettings }: LoadingOverlayProps) {
  if (!isDescriptionLoading && !isPoemLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-headline text-primary">
        {isDescriptionLoading
          ? "Analyzing your masterpiece..."
          : isPoemLoading
            ? `Weaving your ${poemSettings.poemLength.toLowerCase()} ${poemSettings.style.toLowerCase()} poem in ${poemSettings.language}...`
            : "Processing..."
        }
      </p>
    </div>
  );
}
