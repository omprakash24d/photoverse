
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Copy, RotateCcw, Pencil, Loader2, Wand2, Volume2, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toPng } from 'html-to-image';

interface PoemResultDisplayProps {
  imageUrl: string | null;
  poem: string | null;
  audioDataUrl: string | null;
  isGeneratingPoem: boolean;
  isGeneratingImage: boolean;
  isGeneratingAudio: boolean;
  onRegenerate: () => void;
  onStartOver: () => void;
}

export function PoemResultDisplay({
  imageUrl,
  poem,
  audioDataUrl,
  isGeneratingPoem,
  isGeneratingImage,
  isGeneratingAudio,
  onRegenerate,
  onStartOver,
}: PoemResultDisplayProps) {
  const { toast } = useToast();
  const [editablePoem, setEditablePoem] = useState<string>(poem || "");
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  
  const handleDownloadImage = useCallback(() => {
    if (downloadRef.current === null) {
      return;
    }
    
    toast({ title: "Generating Image...", description: "Please wait while we create your downloadable image." });

    toPng(downloadRef.current, { 
      cacheBust: true,
      pixelRatio: 2, // For higher resolution
      // Use a light background for the downloaded image for better compatibility
      backgroundColor: '#fbfbff', 
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'photoverse-creation.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Failed to download image:', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download the poem as an image.",
      });
    });
  }, [toast]);

  const showImagePanel = imageUrl || isGeneratingImage;

  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center text-primary">Your PhotoVerse!</CardTitle>
        <CardDescription className="text-center font-body">
          Behold, the poetry and art inspired by your words. Edit the poem below if you wish!
        </CardDescription>
      </CardHeader>
      <CardContent 
        ref={downloadRef} 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start p-4 md:p-6 bg-card"
      >
        {showImagePanel && (
          <div className="aspect-square w-full rounded-lg overflow-hidden border border-muted shadow-md relative flex items-center justify-center bg-muted/30">
            {isGeneratingImage ? (
                <div className="text-center p-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4 mx-auto"/>
                    <p className="font-headline text-primary">Generating AI Artwork...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
            ) : imageUrl ? (
              <NextImage src={imageUrl} alt="AI generated or user-provided image for the poem" layout="fill" objectFit="contain" data-ai-hint="artistic photography" />
            ) : null}
          </div>
        )}
        <div className={`bg-card-foreground/5 p-4 sm:p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col w-full ${!showImagePanel ? 'md:col-span-2' : ''}`}>
          {isGeneratingPoem && !poem ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <Label htmlFor="editable-poem" className="font-body mb-2 flex items-center">
                <Pencil className="mr-2 h-4 w-4 text-primary" /> Edit Your Poem:
              </Label>
              <Textarea
                id="editable-poem"
                value={editablePoem}
                onChange={(e) => setEditablePoem(e.target.value)}
                rows={poem ? Math.max(10, poem.split('\n').length + 2) : 10}
                className="font-body text-base sm:text-lg whitespace-pre-wrap leading-relaxed w-full bg-background/70 flex-grow"
                disabled={isGeneratingPoem}
                aria-label="Editable poem text area"
              />
               <div className="mt-4">
                <Label className="font-body mb-2 flex items-center">
                  <Volume2 className="mr-2 h-4 w-4 text-primary" /> Listen to the Poem:
                </Label>
                {isGeneratingAudio && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating audio...</span>
                  </div>
                )}
                {audioDataUrl && !isGeneratingAudio && (
                  <audio controls src={audioDataUrl} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                )}
                {!isGeneratingAudio && !audioDataUrl && (
                    <p className="text-sm text-muted-foreground">Audio could not be generated for this poem.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center items-center gap-3 p-4 md:p-6 bg-muted/30 border-t">
        <Button onClick={onRegenerate} disabled={isGeneratingPoem || isGeneratingImage || isGeneratingAudio} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          {isGeneratingPoem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          {isGeneratingPoem ? 'Generating...' : 'Regenerate'}
        </Button>
        <Button onClick={handleCopyPoem} disabled={isGeneratingPoem || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Copy className="mr-2 h-4 w-4" />
          Copy Poem
        </Button>
        <Button onClick={handleDownloadPoemTxt} disabled={isGeneratingPoem || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Download className="mr-2 h-4 w-4" />
          Download .txt
        </Button>
        <Button onClick={handleDownloadImage} disabled={isGeneratingPoem || isGeneratingImage || !poem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <ImageIcon className="mr-2 h-4 w-4" />
          Download Image
        </Button>
        <Button onClick={onStartOver} variant="default" className="w-full xs:w-auto grow sm:grow-0">
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>
    </Card>
  );
}
