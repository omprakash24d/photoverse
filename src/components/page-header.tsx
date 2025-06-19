"use client";

import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { PhotoVerseLogo } from '@/components/photo-verse-logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function PageHeader() {
  return (
    <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative bg-white shadow-md rounded-lg p-6">
      {/* Theme Toggle and Authentication Buttons - Positioned to the top right */}
      <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-4 z-10">
        <ThemeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="hover:bg-gray-100 transition-colors">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* Logo and Title */}
      <div className="pt-12 sm:pt-0">
        <div className="flex justify-center items-center gap-3 mb-3">
          <PhotoVerseLogo className="h-12 w-12 sm:h-16 sm:w-16" />
          <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-tight">
            PhotoVerse
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Transform your photos (or just your words!) into emotionally resonant, AI-generated poems.
        </p>

        {/* Call to Action Button */}
        <Button size="lg" className="bg-accent text-white hover:bg-accent-dark transition-colors">
          Get Started
        </Button>
      </div>
    </header>
  );
}
