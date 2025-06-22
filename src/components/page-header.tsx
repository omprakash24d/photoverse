"use client";

import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { PhotoVerseLogo } from '@/components/photo-verse-logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useIsClerkEnabled } from '@/hooks/use-clerk-enabled';

export function PageHeader() {
  const isClerkEnabled = useIsClerkEnabled();

  return (
    <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative">
      {/* Theme Toggle and Authentication Buttons - Positioned to the top right */}
      <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-4 z-10">
        <ThemeToggle />
        {isClerkEnabled && (
          <>
            <SignedOut>
              <SignInButton>
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        )}
      </div>

      {/* Logo and Title - Conditionally add padding top if auth buttons are present */}
      <div className="pt-12 sm:pt-0"> {/* Added padding top for small screens to avoid overlap */}
        <div className="flex justify-center items-center gap-3 mb-3">
          <PhotoVerseLogo className="h-12 w-12 sm:h-16 sm:w-16" />
          <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-tight">
            PhotoVerse
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your photos (or just your words!) into emotionally resonant, AI-generated poems.
        </p>
      </div>
    </header>
  );
}
