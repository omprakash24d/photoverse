
"use client";

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image'; // Renamed to avoid conflict
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Copy, RotateCcw, Pencil, FileImage } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toPng } from 'html-to-image';
import { PoemImageOutput } from './poem-image-output';
import { PhotoVerseLogo } from './photo-verse-logo';


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
  const poemImageRef = useRef<HTMLDivElement>(null);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);

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

  const handleDownloadImage = async () => {
    if (!poemImageRef.current || !editablePoem) {
      toast({
        variant: "destructive",
        title: "Cannot Generate Image",
        description: "Poem content is missing or the image generation component is not ready.",
      });
      return;
    }

    setIsDownloadingImage(true);
    toast({
      title: "Generating Image...",
      description: "Please wait while your poem image is being created.",
    });

    try {
      // Ensure styles are applied before capturing, a small delay can help.
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Determine background color based on current theme
      const isDarkMode = document.documentElement.classList.contains('dark');
      const backgroundColor = isDarkMode ? 'hsl(240 10% 10%)' : 'hsl(240 100% 98.5%)';


      const dataUrl = await toPng(poemImageRef.current, {
        quality: 0.95,
        backgroundColor: backgroundColor, 
        // Forcing a specific width and height for the capture to match PoemImageOutput's fixed width
        // and an estimated height. This might need adjustment if content varies greatly.
        // Alternatively, ensure PoemImageOutput itself has explicit dimensions set via style prop
        // that html-to-image can respect.
        // width: poemImageRef.current.offsetWidth, // Use actual width of the offscreen element
        // height: poemImageRef.current.offsetHeight, // Use actual height
        pixelRatio: 2, // For higher resolution
      });
      
      const link = document.createElement('a');
      link.download = 'photoverse_poem_image.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image Downloaded!",
        description: "Your poem image has been successfully downloaded.",
      });
    } catch (error) {
      console.error('Failed to generate or download image:', error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: `Could not generate the image. Error: ${(error as Error).message}`,
      });
    } finally {
      setIsDownloadingImage(false);
    }
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
            <NextImage src={imageDataUrl} alt="Source image for the generated poem" layout="fill" objectFit="contain" data-ai-hint="artistic photography" />
          </div>
        )}
        <div className={`bg-card-foreground/5 p-4 sm:p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col ${!imageDataUrl ? 'md:col-span-1' : ''} w-full`}>
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
                rows={poem ? Math.max(10, poem.split('\n').length + 2) : 10}
                className="font-body text-base sm:text-lg whitespace-pre-wrap leading-relaxed w-full bg-background/70 flex-grow"
                disabled={isGeneratingPoem || isDownloadingImage}
                aria-label="Editable poem text area"
              />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center items-center gap-3 p-4 md:p-6 bg-muted/30 border-t">
        <Button onClick={onRegenerate} disabled={isGeneratingPoem || isDownloadingImage} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <RefreshCw className={`mr-2 h-4 w-4 ${isGeneratingPoem ? 'animate-spin' : ''}`} />
          {isGeneratingPoem ? 'Regenerating...' : 'Regenerate Poem'}
        </Button>
        <Button onClick={handleCopyPoem} disabled={isGeneratingPoem || isDownloadingImage || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Copy className="mr-2 h-4 w-4" />
          Copy Poem
        </Button>
        <Button onClick={handleDownloadPoemTxt} disabled={isGeneratingPoem || isDownloadingImage || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
          <Download className="mr-2 h-4 w-4" />
          Download .txt
        </Button>
        <Button onClick={handleDownloadImage} disabled={isGeneratingPoem || isDownloadingImage || !editablePoem} variant="outline" className="w-full xs:w-auto grow sm:grow-0">
            <FileImage className={`mr-2 h-4 w-4 ${isDownloadingImage ? 'animate-spin' : ''}`} />
            {isDownloadingImage ? 'Downloading...' : 'Download as Image'}
        </Button>
        <Button onClick={onStartOver} variant="default" className="w-full xs:w-auto grow sm:grow-0" disabled={isDownloadingImage}>
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>

      {/* Hidden div for rendering the image to be downloaded */}
      <div 
        ref={poemImageRef} 
        style={{ 
            position: 'absolute', 
            left: '-9999px', 
            top: '-9999px', 
            zIndex: -10, 
            // Ensure the theme variables are available if not directly inherited
            // This might be tricky if html-to-image doesn't pick up CSS vars from non-rendered elements easily.
            // Explicitly setting them via JS might be more robust if issues arise.
        }}
        className={document.documentElement.classList.contains('dark') ? 'dark' : ''} // Apply dark/light class for HSL vars
      >
        {/* 
          This component will be rendered here but off-screen.
          Its content will be updated with the current poem/image before capture.
        */}
        {editablePoem && ( // Only render if there's a poem to avoid issues with html-to-image on empty content
           <PoemImageOutput
            imageDataUrl={imageDataUrl}
            poemText={editablePoem}
            LogoComponent={PhotoVerseLogo}
            siteName="PhotoVerse"
          />
        )}
      </div>
    </Card>
  );
}
