
"use client";

import Link from 'next/link';
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
      
      <p className="text-xs text-muted-foreground/80 font-body mt-2">
        <Link href="/contact-us" className="text-accent hover:underline">Contact Us</Link>
      </p>
      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        &copy; {new Date().getFullYear()} Om Prakash. All rights reserved.
      </p>
      <div className="text-xs text-muted-foreground/80 font-body mt-1">
        <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> | 
        <Link href="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>
      </div>
      <p className="text-xs text-muted-foreground/80 font-body mt-2">
        <Link href="#top" className="text-accent hover:underline">Back to top</Link>
      </p>
    </footer>
  );
}
