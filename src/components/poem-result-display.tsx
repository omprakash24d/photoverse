
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Copy, RotateCcw, Pencil, ImageIcon as DownloadImagePlaceholderIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea'; 
import { Label } from '@/components/ui/label';

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
  const [editablePoem, setEditablePoem] = useState<string>(poem || "");

  useEffect(() => {
    // Update editablePoem when the poem prop changes (e.g., after regeneration)
    setEditablePoem(poem || "");
  }, [poem]);

  const handleCopyPoem = async () => {
    if (!editablePoem) return;
    try {
      await navigator.clipboard.writeText(editablePoem);
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
    if (!editablePoem) return;
    try {
      const blob = new Blob([editablePoem], { type: 'text/plain;charset=utf-8' });
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
  
  const handleDownloadImage = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "Downloading the poem as an image will be available in a future update.",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary">Your PhotoVerse!</CardTitle>
        <CardDescription className="text-center font-body">
          Behold, the poetry inspired by your {imageDataUrl ? "image" : "description"}. Edit it below if you wish!
        </CardDescription>
      </CardHeader>
      <CardContent className={`grid gap-6 items-start p-4 md:p-6 ${imageDataUrl ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {imageDataUrl && (
          <div className="aspect-square w-full rounded-lg overflow-hidden border border-muted shadow-md relative">
            <Image src={imageDataUrl} alt="Source image for the generated poem" layout="fill" objectFit="contain" data-ai-hint="artistic photography" />
          </div>
        )}
        <div className={`bg-card-foreground/5 p-4 sm:p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col ${!imageDataUrl ? 'md:col-span-1' : ''}`}>
          {isGeneratingPoem && !poem ? ( 
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          ) : ( 
            <>
              <Label htmlFor="editable-poem" className="font-body mb-2 flex items-center">
                <Pencil className="mr-2 h-4 w-4 text-primary" /> Edit Your Poem:
              </Label>
              <Textarea
                id="editable-poem"
                value={editablePoem}
                onChange={(e) => setEditablePoem(e.target.value)}
                rows={poem ? Math.max(8, poem.split('\n').length + 2) : 8} 
                className="font-body text-lg sm:text-xl whitespace-pre-wrap leading-relaxed w-full bg-background/70"
                disabled={isGeneratingPoem}
              />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center items-center gap-3 p-4 md:p-6 bg-muted/30 border-t">
        <Button onClick={onRegenerate} disabled={isGeneratingPoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingPoem ? 'animate-spin' : ''}`} />
          {isGeneratingPoem ? 'Regenerating...' : 'Regenerate Poem'}
        </Button>
        <Button onClick={handleCopyPoem} disabled={isGeneratingPoem || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Copy className="mr-2 h-4 w-4" />
          Copy Poem
        </Button>
        <Button onClick={handleDownloadPoemTxt} disabled={isGeneratingPoem || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Download className="mr-2 h-4 w-4" />
          Download .txt
        </Button>
        <Button onClick={handleDownloadImage} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
            <DownloadImagePlaceholderIcon className="mr-2 h-4 w-4" /> Download as Image
        </Button>
        <Button onClick={onStartOver} variant="default" className="w-full xs:w-auto grow sm:grow-0">
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>
    </Card>
  );
}
