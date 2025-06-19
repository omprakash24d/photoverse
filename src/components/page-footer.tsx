
"use client";

import React from 'react';

export function PageFooter() {
  return (
    <footer className="w-full max-w-3xl text-center mt-12 py-6 border-t border-border">
      <p className="text-sm text-muted-foreground font-body">
        Developed with <span className="text-accent">&hearts;</span> by Om Prakash.
      </p>
      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        PhotoVerse: An AI-powered tool to transform images and ideas into poetry.
      </p>
    </footer>
  );
}
