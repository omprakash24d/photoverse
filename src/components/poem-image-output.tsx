
"use client";

import React from 'react';
import Image from 'next/image';
import type { PhotoVerseLogo } from './photo-verse-logo'; // Corrected import type

interface PoemImageOutputProps {
  imageDataUrl: string | null;
  poemText: string;
  LogoComponent: typeof PhotoVerseLogo; // Expecting the component type itself
  siteName: string;
}

// Define a specific style for the output image container
const containerStyle: React.CSSProperties = {
  width: '600px', // Fixed width for consistent output
  padding: '30px',
  backgroundColor: 'hsl(var(--background))', // Use theme background
  color: 'hsl(var(--foreground))', // Use theme foreground
  fontFamily: 'Lora, serif', // Match body font
  border: '1px solid hsl(var(--border))',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const imageContainerStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '300px', // Max height for the image
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  borderRadius: '8px',
  border: '1px solid hsl(var(--border))',
};

const poemTextStyle: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap', // Preserve line breaks from poem
  textAlign: 'center',
  maxHeight: '400px',
  overflowY: 'auto',
};

const footerStyle: React.CSSProperties = {
  marginTop: 'auto', // Push footer to bottom
  paddingTop: '20px',
  borderTop: '1px solid hsl(var(--border))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const siteNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: 'Raleway, sans-serif', // Match headline font
  color: 'hsl(var(--primary))',
};

export function PoemImageOutput({
  imageDataUrl,
  poemText,
  LogoComponent,
  siteName,
}: PoemImageOutputProps) {
  return (
    <div style={containerStyle}>
      {imageDataUrl && (
        <div style={imageContainerStyle}>
          {/* 
            Using a standard img tag here because next/image can sometimes be tricky
            with html-to-image if not rendered in the main document flow correctly.
            For off-screen rendering, standard img is more straightforward.
            Ensure data-ai-hint is appropriate.
          */}
          <img 
            src={imageDataUrl} 
            alt="User provided art" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            data-ai-hint="user artwork"
          />
        </div>
      )}
      <div style={poemTextStyle}>
        {poemText || "No poem generated."}
      </div>
      <div style={footerStyle}>
        <LogoComponent className="h-8 w-8" />
        <span style={siteNameStyle}>{siteName}</span>
      </div>
    </div>
  );
}
