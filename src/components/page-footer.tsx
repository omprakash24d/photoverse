
"use client";

import Link from 'next/link';
import React from 'react';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

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
    href: "https://instagram.com/omprakash25d",
    icon: <Instagram className="h-5 w-5" />,
    label: "Instagram"
  },
];

const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/contact-us", label: "Contact Us" },
];


export function PageFooter() {
  return (
    <footer className="w-full max-w-3xl text-center mt-5 py-6 border-t border-border">
      <p className="text-sm text-muted-foreground font-body">
        Developed with <span className="text-accent">&hearts;</span> by Om Prakash.
      </p>
      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        PhotoVerse: An AI-powered tool to transform images and ideas into poetry.
      </p>

      <div className="flex justify-center items-center space-x-4 mt-4 mb-4">
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

      <p className="text-xs text-muted-foreground/80 font-body">
        &copy; {new Date().getFullYear()} Om Prakash. All rights reserved.
      </p>
      <div className="flex justify-center items-center gap-x-2 text-xs text-muted-foreground/80 font-body mt-1">
        {legalLinks.map((link, index) => (
            <React.Fragment key={link.label}>
                <Link href={link.href} className="text-accent hover:underline">{link.label}</Link>
                {index < legalLinks.length - 1 && <span className="text-muted-foreground/50">|</span>}
            </React.Fragment>
        ))}
      </div>
    </footer>
  );
}
