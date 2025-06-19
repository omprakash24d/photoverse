
"use client";

import React from 'react';
import type { PhotoVerseLogo } from './photo-verse-logo'; // Assuming PhotoVerseLogo is a type if not default export

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  border: string;
}

interface PoemImageOutputProps {
  imageDataUrl: string | null;
  poemText: string;
  LogoComponent: typeof PhotoVerseLogo; // Or React.FC if it's a functional component
  siteName: string;
  themeColors: ThemeColors;
}

export function PoemImageOutput({
  imageDataUrl,
  poemText,
  LogoComponent,
  siteName,
  themeColors,
}: PoemImageOutputProps) {
  const containerStyle: React.CSSProperties = {
    width: '600px', 
    padding: '30px',
    backgroundColor: themeColors.background, 
    color: themeColors.foreground,       
    border: `1px solid ${themeColors.border}`, 
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    // Ensure fonts are explicitly set for html-to-image to try and use them if loaded
    fontFamily: "'Lora', serif", 
  };

  const imageContainerStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '300px', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '8px',
    border: `1px solid ${themeColors.border}`, 
  };

  const poemTextStyle: React.CSSProperties = {
    fontFamily: "'Lora', serif", 
    fontSize: '16px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap', 
    textAlign: 'center',
    maxHeight: '400px',
    overflowY: 'auto',
    color: themeColors.foreground, 
  };

  const footerStyle: React.CSSProperties = {
    marginTop: 'auto', 
    paddingTop: '20px',
    borderTop: `1px solid ${themeColors.border}`, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  const siteNameStyle: React.CSSProperties = {
    fontFamily: "'Raleway', sans-serif", 
    fontSize: '14px',
    fontWeight: 'bold',
    color: themeColors.primary, 
  };

  return (
    <div style={containerStyle}>
      {imageDataUrl && (
        <div style={imageContainerStyle}>
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
