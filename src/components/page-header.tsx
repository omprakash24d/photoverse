
"use client";

import React from 'react';
import Link from 'next/link';
import { PhotoVerseLogo } from '@/components/photo-verse-logo';
import { ThemeToggle } from '@/components/theme-toggle';

export function PageHeader() {
  return (
    <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative">
      {/* Theme Toggle - Positioned to the top right */}
      <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-4 z-10">
        <ThemeToggle />
      </div>

      {/* Logo and Title */}
      <div className="pt-12 sm:pt-0">
        <Link href="/" className="inline-flex justify-center items-center gap-3 mb-3 group" aria-label="Go to PhotoVerse homepage">
            <PhotoVerseLogo className="h-12 w-12 sm:h-16 sm:w-16 transition-transform group-hover:scale-105" />
            <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-tight transition-colors group-hover:text-accent">
              PhotoVerse
            </h1>
        </Link>
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your photos (or just your words!) into emotionally resonant, AI-generated poems.
        </p>
      </div>
    </header>
  );
}
