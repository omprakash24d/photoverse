"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Share2, Pencil, Sparkles, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PoemResultDisplayProps {
  imageDataUrl: string | null;
  poem: string | null;
  isGeneratingPoem: boolean; // For showing loading state on the poem itself
  onRegenerate: () => void;
  onStartOver: () => void;
  // onEdit?: () => void; // Future feature
  // onDownload?: () => void; // Future feature
  // onShare?: () => void; // Future feature
}

export function PoemResultDisplay({
  imageDataUrl,
  poem,
  isGeneratingPoem,
  onRegenerate,
  onStartOver,
}: PoemResultDisplayProps) {
  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary">Your PhotoVerse!</CardTitle>
        <CardDescription className="text-center font-body">
          Behold, the poetry inspired by your image.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 items-start p-4 md:p-6">
        {imageDataUrl && (
          <div className="aspect-square w-full rounded-lg overflow-hidden border border-muted shadow-md relative">
            <Image src={imageDataUrl} alt="Source image for poem" layout="fill" objectFit="contain" data-ai-hint="artistic photography"/>
          </div>
        )}
        <div className="bg-card-foreground/5 p-4 sm:p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col justify-center">
          {isGeneratingPoem && !poem ? ( // Show skeleton only if poem is null and loading
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          ) : poem ? (
            <p className="font-body text-lg sm:text-xl whitespace-pre-line leading-relaxed text-foreground">
              {poem}
            </p>
          ) : (
            <p className="font-body text-lg text-muted-foreground">No poem generated yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4 md:p-6 bg-muted/30 border-t">
        <Button onClick={onRegenerate} disabled={isGeneratingPoem} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingPoem ? 'animate-spin' : ''}`} />
          {isGeneratingPoem ? 'Regenerating...' : 'Regenerate Poem'}
        </Button>
        {/* Placeholder buttons for future features */}
        {/* <Button variant="outline" disabled className="w-full sm:w-auto">
          <Pencil className="mr-2 h-4 w-4" /> Edit Poem
        </Button>
        <Button variant="outline" disabled className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
        <Button variant="outline" disabled className="w-full sm:w-auto">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button> */}
        <Button onClick={onStartOver} variant="default" className="w-full sm:w-auto">
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>
    </Card>
  );
}
