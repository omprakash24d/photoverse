
"use client";

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Copy, RotateCcw, Pencil, FileImage, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toPng } from 'html-to-image';
import { PoemImageOutput, type ThemeColors } from './poem-image-output'; // Import ThemeColors type
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
  const [imageExportThemeColors, setImageExportThemeColors] = useState<ThemeColors | null>(null);


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

    // Create a temporary div to accurately compute styles based on the current theme
    const tempDiv = document.createElement('div');
    tempDiv.style.visibility = 'hidden'; // Keep it off-screen effectively
    document.body.appendChild(tempDiv);
    const isDark = document.documentElement.classList.contains('dark');
    tempDiv.className = isDark ? 'dark' : 'light'; // Apply the theme class

    const computed = getComputedStyle(tempDiv);
    const resolvedColors: ThemeColors = {
      background: computed.backgroundColor, // Already a full CSS color string e.g., "rgb(30, 41, 59)"
      foreground: computed.color,           // Already a full CSS color string e.g., "rgb(226, 232, 240)"
      primary: `hsl(${computed.getPropertyValue('--primary').trim()})`, // Construct HSL string
      border: `hsl(${computed.getPropertyValue('--border').trim()})`,     // Construct HSL string
    };
    document.body.removeChild(tempDiv); // Clean up the temporary div

    setImageExportThemeColors(resolvedColors); // Set state to trigger re-render of PoemImageOutput

    // Delay to allow React to re-render PoemImageOutput with new props
    setTimeout(async () => {
      if (!poemImageRef.current) {
        setIsDownloadingImage(false);
        setImageExportThemeColors(null);
        toast({ variant: "destructive", title: "Error", description: "Image generation component not found after delay." });
        return;
      }

      try {
        const dataUrl = await toPng(poemImageRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          // No need to set backgroundColor here if PoemImageOutput sets its own background
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
          description: `Could not generate the image. Error: ${(error as Error).message}. Ensure browser allows canvas data extraction.`,
        });
      } finally {
        setIsDownloadingImage(false);
        setImageExportThemeColors(null); // Reset for next time
      }
    }, 100); // 100ms delay, adjust if needed
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
            {isDownloadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileImage className="mr-2 h-4 w-4" />}
            {isDownloadingImage ? 'Downloading...' : 'Download as Image'}
        </Button>
        <Button onClick={onStartOver} variant="default" className="w-full xs:w-auto grow sm:grow-0" disabled={isDownloadingImage}>
          <RotateCcw className="mr-2 h-4 w-4" /> Start New
        </Button>
      </CardFooter>

      {/* This div is captured by html-to-image. It's rendered off-screen. */}
      <div 
        ref={poemImageRef} 
        style={{ 
            position: 'absolute', 
            left: '-9999px', 
            top: '-9999px',
            zIndex: -10,
        }}
      >
        {/* Conditionally render PoemImageOutput only when themeColors are available and we are attempting to download */}
        {editablePoem && imageExportThemeColors && ( 
           <PoemImageOutput
            imageDataUrl={imageDataUrl}
            poemText={editablePoem}
            LogoComponent={PhotoVerseLogo}
            siteName="PhotoVerse"
            themeColors={imageExportThemeColors}
          />
        )}
      </div>
    </Card>
  );
}
