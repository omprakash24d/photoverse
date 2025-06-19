"use client";

import Link from 'next/link';
import React from 'react';
import { Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export function PageFooter() {
  const developerLinks = [
    {
      href: "https://www.linkedin.com/in/omrakash24d/",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn"
    },
    {
      href: "https://github.com/omprakash24d",
      icon: <Github className="h-5 w-5" />,
      label: "GitHub"
    },
    {
      href: "https://twitter.com/omprakash25d",
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter"
    },
    // Add more social links here as needed
  ];

  return (
    <footer className="w-full max-w-3xl text-center mt-12 py-6 border-t border-border">
      <p className="text-sm text-muted-foreground font-body">
        Developed with <span className="text-accent">&hearts;</span> by Om Prakash.
      </p>
      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        PhotoVerse: An AI-powered tool to transform images and ideas into poetry.
      </p>

      <div className="flex justify-center items-center space-x-3 mt-3 mb-3">
        <span className="text-xs text-muted-foreground/80 font-body">Connect with the developer:</span>
        {developerLinks.map(({ href, icon, label }) => (
          <a 
            key={label} 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            title={`Om Prakash on ${label}`} 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {icon}
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        &copy; {new Date().getFullYear()} Om Prakash. All rights reserved.
      </p>
      <div className="text-xs text-muted-foreground/80 font-body mt-1">
        <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link> | 
        <Link href="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>|
        <Link href="/contact-us" className="text-accent hover:underline">Contact Us</Link>
      </div>
    </footer>
  );
}
