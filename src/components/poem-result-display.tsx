
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Copy, RotateCcw } from 'lucide-react'; // Replaced Share2, Pencil, Sparkles
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface PoemResultDisplayProps {
  imageDataUrl: string | null;
  poem: string | null;
  isGeneratingPoem: boolean;
  onRegenerate: () => void;
  onStartOver: () => void;
}

export function PoemResultDisplay({
  imageDataUrl,
  poem,
  isGeneratingPoem,
  onRegenerate,
  onStartOver,
}: PoemResultDisplayProps) {
  const { toast } = useToast();

  const handleCopyPoem = async () => {
    if (!poem) return;
    try {
      await navigator.clipboard.writeText(poem);
      toast({
        title: "Poem Copied!",
        description: "The poem has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy poem: ', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy the poem to your clipboard.",
      });
    }
  };

  const handleDownloadPoemTxt = () => {
    if (!poem) return;
    try {
      const blob = new Blob([poem], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'photoverse_poem.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast({
        title: "Download Started",
        description: "Your poem is being downloaded as a .txt file.",
      });
    } catch (err) {
      console.error('Failed to download poem: ', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download the poem.",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary">Your PhotoVerse!</CardTitle>
        <CardDescription className="text-center font-body">
          Behold, the poetry inspired by your {imageDataUrl ? "image" : "description"}.
        </CardDescription>
      </CardHeader>
      <CardContent className={`grid gap-6 items-start p-4 md:p-6 ${imageDataUrl ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {imageDataUrl && (
          <div className="aspect-square w-full rounded-lg overflow-hidden border border-muted shadow-md relative">
            <Image src={imageDataUrl} alt="Source image for poem" layout="fill" objectFit="contain" data-ai-hint="artistic photography"/>
          </div>
        )}
        <div className={`bg-card-foreground/5 p-4 sm:p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col justify-center ${!imageDataUrl ? 'md:col-span-1' : ''}`}>
          {isGeneratingPoem && !poem ? (
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
            <p className="font-body text-lg text-muted-foreground">No poem generated yet, or an error occurred.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center items-center gap-3 p-4 md:p-6 bg-muted/30 border-t">
        <Button onClick={onRegenerate} disabled={isGeneratingPoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingPoem ? 'animate-spin' : ''}`} />
          {isGeneratingPoem ? 'Regenerating...' : 'Regenerate Poem'}
        </Button>
        <Button onClick={handleCopyPoem} disabled={isGeneratingPoem || !poem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Copy className="mr-2 h-4 w-4" />
          Copy Poem
        </Button>
        <Button onClick={handleDownloadPoemTxt} disabled={isGeneratingPoem || !poem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Download className="mr-2 h-4 w-4" />
          Download .txt
        </Button>
        <Button onClick={onStartOver} variant="default" className="w-full xs:w-auto grow sm:grow-0">
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>
    </Card>
  );
}
