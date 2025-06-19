import * as React from 'react';

export function PhotoVerseLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PhotoVerse Logo"
    >
      <rect width="100" height="100" rx="20" fill="hsl(var(--primary))" />
      <path
        d="M30 75V35C30 30 35 25 40 25H60C65 25 70 30 70 35V75"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 50H70"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="40" r="5" fill="hsl(var(--primary-foreground))" />
    </svg>
  );
}
