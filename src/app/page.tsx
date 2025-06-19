
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { PhotoVerseLogo } from '@/components/photo-verse-logo';
import { PhotoUpload } from '@/components/photo-upload';
import { ImageDescriptionForm } from '@/components/image-description-form';
import { PoemCustomizationForm } from '@/components/poem-customization-form';
import { PoemResultDisplay } from '@/components/poem-result-display';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { describeImage, DescribeImageInput, DescribeImageOutput } from '@/ai/flows/describe-image';
import { generatePoem, GeneratePoemInput, GeneratePoemOutput } from '@/ai/flows/generate-poem';
import type { AppStep, PoemSettings } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';


const initialPoemSettings: PoemSettings = {
  language: 'English',
  style: 'Free Verse',
  tone: 'Reflective',
};

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function PhotoVersePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>('');
  const [poemSettings, setPoemSettings] = useState<PoemSettings>(initialPoemSettings);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);

  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [isPoemLoading, setIsPoemLoading] = useState<boolean>(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState<boolean>(false);

  const { toast } = useToast();

  const resetState = useCallback(() => {
    setCurrentStep('upload');
    setImageDataUrl(null);
    setImageDescription('');
    setPoemSettings(initialPoemSettings);
    setGeneratedPoem(null);
    setIsDescriptionLoading(false);
    setIsPoemLoading(false);
    setIsDescriptionEditable(false);
  }, []);

  const handleImageSelected = useCallback(async (imageSource: File | string) => {
    let dataUrl: string;
    if (typeof imageSource === 'string') { // Webcam data URL
      dataUrl = imageSource;
    } else { // File object
      try {
        dataUrl = await fileToDataUri(imageSource);
      } catch (error) {
        console.error("Error converting file to data URI:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not process the image file." });
        return;
      }
    }
    setImageDataUrl(dataUrl);
    setCurrentStep('describe');
    setIsDescriptionLoading(true);
    try {
      const describeInput: DescribeImageInput = { photoDataUri: dataUrl };
      const result: DescribeImageOutput = await describeImage(describeInput);
      setImageDescription(result.description);
    } catch (error) {
      console.error("Error describing image:", error);
      setImageDescription(""); // Allow manual input
      toast({
        variant: "destructive",
        title: "AI Description Failed",
        description: "Could not generate an AI description. Please write one manually.",
      });
    } finally {
      setIsDescriptionLoading(false);
      setIsDescriptionEditable(false); // AI tried, user can edit
    }
  }, [toast]);
  
  const handleFetchAIDescription = useCallback(async () => {
    if (!imageDataUrl) return;
    setIsDescriptionLoading(true);
    try {
      const describeInput: DescribeImageInput = { photoDataUri: imageDataUrl };
      const result: DescribeImageOutput = await describeImage(describeInput);
      setImageDescription(result.description);
       toast({ title: "Success", description: "AI description regenerated." });
    } catch (error) {
      console.error("Error re-describing image:", error);
      toast({
        variant: "destructive",
        title: "AI Description Failed",
        description: "Could not regenerate AI description.",
      });
    } finally {
      setIsDescriptionLoading(false);
    }
  }, [imageDataUrl, toast]);


  const handleDescriptionConfirm = useCallback((description: string) => {
    setImageDescription(description);
    setCurrentStep('customize');
    setIsDescriptionEditable(false); // Confirmed, not primarily editable in next step unless back button
  }, []);

  const handleSkipDescription = useCallback((currentDesc: string) => {
    setImageDescription(currentDesc); // Keep what user might have typed
    setCurrentStep('customize');
    setIsDescriptionEditable(true); // User explicitly wants to write/edit in customize step
  }, []);

  const handleGeneratePoem = useCallback(async () => {
    if (!imageDescription.trim()) {
      toast({ variant: "destructive", title: "Missing Description", description: "Please provide an image description." });
      return;
    }
    setIsPoemLoading(true);
    setGeneratedPoem(null); // Clear previous poem
    try {
      const poemInput: GeneratePoemInput = {
        imageDescription,
        language: poemSettings.language,
        style: poemSettings.style,
        tone: poemSettings.tone,
      };
      const result: GeneratePoemOutput = await generatePoem(poemInput);
      setGeneratedPoem(result.poem);
      setCurrentStep('display');
    } catch (error) {
      console.error("Error generating poem:", error);
      toast({ variant: "destructive", title: "Poem Generation Failed", description: "Could not generate the poem. Please try again." });
    } finally {
      setIsPoemLoading(false);
    }
  }, [imageDescription, poemSettings, toast]);

  const handleBack = () => {
    if (currentStep === 'display') setCurrentStep('customize');
    else if (currentStep === 'customize') setCurrentStep('describe');
    else if (currentStep === 'describe') {
      // Optionally clear image data or keep it if user just wants to re-describe
      // For simplicity, let's go back to upload and clear image
      setImageDataUrl(null);
      setImageDescription('');
      setCurrentStep('upload');
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative">
        <div className="absolute top-2 right-2 z-10">
          <ThemeToggle />
        </div>
        <div className="flex justify-center items-center gap-3 mb-2">
          <PhotoVerseLogo className="h-12 w-12 sm:h-16 sm:w-16" />
          <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-tight">
            PhotoVerse
          </h1>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground">
          Transform your photos into emotionally resonant, AI-generated poems.
        </p>
      </header>

      <main className="w-full max-w-3xl flex-grow">
        {currentStep !== 'upload' && (
          <Button variant="ghost" onClick={handleBack} className="mb-6 text-primary hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}

        {currentStep === 'upload' && (
          <PhotoUpload onImageSelected={handleImageSelected} isLoading={isDescriptionLoading} />
        )}

        {currentStep === 'describe' && imageDataUrl && (
          <ImageDescriptionForm
            imageDataUrl={imageDataUrl}
            initialDescription={imageDescription}
            isFetchingDescription={isDescriptionLoading}
            onDescriptionConfirm={handleDescriptionConfirm}
            onSkip={handleSkipDescription}
            onFetchDescriptionRequest={handleFetchAIDescription}
          />
        )}

        {currentStep === 'customize' && (
          <PoemCustomizationForm
            initialDescription={imageDescription}
            isDescriptionEditable={isDescriptionEditable}
            onDescriptionChange={setImageDescription}
            initialSettings={poemSettings}
            onSettingsChange={setPoemSettings}
            onGeneratePoem={handleGeneratePoem}
            isGeneratingPoem={isPoemLoading}
          />
        )}

        {currentStep === 'display' && (
          <PoemResultDisplay
            imageDataUrl={imageDataUrl}
            poem={generatedPoem}
            isGeneratingPoem={isPoemLoading}
            onRegenerate={handleGeneratePoem}
            onStartOver={resetState}
          />
        )}
        
        {(isDescriptionLoading || isPoemLoading) && currentStep !== 'display' && (
          <div className="fixed inset-0 bg-background/80 flex flex-col justify-center items-center z-50">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl font-headline text-primary">
              {isDescriptionLoading ? "Analyzing your masterpiece..." : "Weaving words of wonder..."}
            </p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl text-center mt-12 py-6 border-t border-border">
        <p className="text-sm text-muted-foreground font-body">
          Developed with <span className="text-accent">&hearts;</span> by Om Prakash.
        </p>
         <p className="text-xs text-muted-foreground/80 font-body mt-1">
          PhotoVerse: An AI-powered tool to transform images into poetry.
        </p>
      </footer>
    </div>
  );
}
