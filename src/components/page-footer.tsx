
"use client";

import Link from 'next/link';
import React from 'react';
import { Instagram, Twitter, Linkedin, Github, Pinterest } from 'lucide-react'; // Added Instagram, Pinterest

export function PageFooter() {
  const developerLinkedIn = "https://www.linkedin.com/in/om-prakash-yadav-991b29150/";
  const developerGithub = "https://github.com/OmPrakashAhir";
  const developerTwitter = "https://twitter.com/OmPraka96205339";
  // Placeholder social links - replace with actual links
  const siteInstagram = "https://instagram.com/your-photoverse-profile";
  const siteTwitter = "https://twitter.com/your-photoverse-profile";
  const sitePinterest = "https://pinterest.com/your-photoverse-profile";


  return (
    <footer className="w-full max-w-3xl text-center mt-12 py-6 border-t border-border">
      <p className="text-sm text-muted-foreground font-body">
        Developed with <span className="text-accent">&hearts;</span> by Om Prakash.
      </p>
      <p className="text-xs text-muted-foreground/80 font-body mt-1">
        PhotoVerse: An AI-powered tool to transform images and ideas into poetry.
      </p>
      
      <div className="mt-4 mb-3 flex justify-center space-x-5">
        <a href={siteInstagram} target="_blank" rel="noopener noreferrer" title="PhotoVerse on Instagram" className="text-muted-foreground hover:text-primary transition-colors">
          <Instagram className="h-6 w-6" />
          <span className="sr-only">PhotoVerse Instagram</span>
        </a>
        <a href={siteTwitter} target="_blank" rel="noopener noreferrer" title="PhotoVerse on Twitter" className="text-muted-foreground hover:text-primary transition-colors">
          <Twitter className="h-6 w-6" />
          <span className="sr-only">PhotoVerse Twitter</span>
        </a>
        <a href={sitePinterest} target="_blank" rel="noopener noreferrer" title="PhotoVerse on Pinterest" className="text-muted-foreground hover:text-primary transition-colors">
          <Pinterest className="h-6 w-6" />
          <span className="sr-only">PhotoVerse Pinterest</span>
        </a>
      </div>

      <div className="flex justify-center items-center space-x-3 mt-3 mb-3">
        <span className="text-xs text-muted-foreground/80 font-body">Connect with the developer:</span>
        <a href={developerLinkedIn} target="_blank" rel="noopener noreferrer" title="Om Prakash on LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
          <Linkedin className="h-5 w-5" />
          <span className="sr-only">LinkedIn</span>
        </a>
        <a href={developerGithub} target="_blank" rel="noopener noreferrer" title="Om Prakash on GitHub" className="text-muted-foreground hover:text-primary transition-colors">
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
        <a href={developerTwitter} target="_blank" rel="noopener noreferrer" title="Om Prakash on Twitter" className="text-muted-foreground hover:text-primary transition-colors">
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Twitter</span>
        </a>
      </div>
      
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
