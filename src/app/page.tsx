
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { describeImage, DescribeImageInput, DescribeImageOutput } from '@/ai/flows/describe-image';
import { generatePoem, GeneratePoemInput, GeneratePoemOutput } from '@/ai/flows/generate-poem';
import { generateImage, GenerateImageInput, GenerateImageOutput } from '@/ai/flows/generate-image';
import { AppStep, PoemSettings, PoemLength, LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';
import { ArrowLeft, Loader2, FileImage } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { PhotoUpload } from '@/components/photo-upload';
import { ImageDescriptionForm } from '@/components/image-description-form';
import { PoemCustomizationForm } from '@/components/poem-customization-form';
import { PoemResultDisplay } from '@/components/poem-result-display';
import { LoadingOverlay } from '@/components/loading-overlay';
import { InfoAccordion } from '@/components/info-accordion';
import { PageFooter } from '@/components/page-footer';


const defaultPoemSettings: PoemSettings = {
  language: 'English',
  style: 'Free Verse',
  tone: 'Reflective',
  poemLength: 'Medium',
  customInstruction: '',
  poeticDevices: '',
};

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => {
      console.error("Error converting file to data URI:", error);
      reject(new Error("Could not process the image file."));
    };
    reader.readAsDataURL(file);
  });
};

export default function PhotoVersePage() {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>('');
  const [poemSettings, setPoemSettings] = useState<PoemSettings>(defaultPoemSettings);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [isPoemLoading, setIsPoemLoading] = useState<boolean>(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState<boolean>(false);
  const [isImageGenerating, setIsImageGenerating] = useState<boolean>(false);


  const { toast } = useToast();

  const resetState = useCallback(() => {
    setCurrentStep('upload');
    setImageDataUrl(null);
    setImageDescription('');
    setPoemSettings(defaultPoemSettings);
    setGeneratedPoem(null);
    setGeneratedImageUrl(null);
    setIsDescriptionLoading(false);
    setIsPoemLoading(false);
    setIsImageGenerating(false);
    setIsDescriptionEditable(false);
  }, []);

  const handleImageSelected = useCallback(async (imageSource: File | string) => {
    let dataUrl: string;
    if (typeof imageSource === 'string') {
      dataUrl = imageSource; 
    } else {
      try {
        dataUrl = await fileToDataUri(imageSource);
      } catch (error) {
        toast({ variant: "destructive", title: "Image Processing Error", description: (error as Error).message });
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
      setImageDescription("Could not generate AI description. Please write one manually or try again.");
      toast({
        variant: "destructive",
        title: "AI Description Failed",
        description: "Could not generate an AI description. Please write one manually or try regenerating.",
      });
    } finally {
      setIsDescriptionLoading(false);
      setIsDescriptionEditable(false); 
    }
  }, [toast]);

  const handleFetchAIDescription = useCallback(async () => {
    if (!imageDataUrl) {
        toast({ variant: "destructive", title: "No Image", description: "No image available to describe."});
        return;
    }
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
    setIsDescriptionEditable(false); 
  }, []);

  const handleSkipToCustomize = useCallback((currentDesc: string = "") => {
    if (imageDataUrl) { 
        setImageDescription(currentDesc || "A beautiful scene"); 
        setIsDescriptionEditable(true); 
    } else { 
        setImageDescription(currentDesc || ""); 
        setIsDescriptionEditable(true); 
    }
    setCurrentStep('customize');
  }, [imageDataUrl]);

  const handleGeneratePoem = useCallback(async () => {
    if (!imageDescription.trim()) {
      toast({ variant: "destructive", title: "Missing Description", description: "Please provide an image description or subject for the poem." });
      return;
    }
    setIsPoemLoading(true);
    setGeneratedPoem(null); 
    setGeneratedImageUrl(null);
    
    try {
      const poemInput: GeneratePoemInput = {
        imageDescription,
        language: poemSettings.language,
        style: poemSettings.style,
        tone: poemSettings.tone,
        poemLength: poemSettings.poemLength,
        customInstruction: poemSettings.customInstruction || '',
        poeticDevices: poemSettings.poeticDevices || '',
      };
      const result: GeneratePoemOutput = await generatePoem(poemInput);
      setGeneratedPoem(result.poem);
      setCurrentStep('display');
      setIsPoemLoading(false);

      // If user started with text, generate an image for them
      if (!imageDataUrl) {
        setIsImageGenerating(true);
        try {
          const imageResult = await generateImage({ description: imageDescription });
          setGeneratedImageUrl(imageResult.imageDataUri);
        } catch (imageError) {
          console.error("Error generating image:", imageError);
          toast({
            variant: "destructive",
            title: "AI Image Failed",
            description: "Could not generate an accompanying image, but your poem is ready!",
          });
        } finally {
          setIsImageGenerating(false);
        }
      }

    } catch (error) {
      console.error("Error generating poem:", error);
      toast({ variant: "destructive", title: "Poem Generation Failed", description: "Could not generate the poem. Please try again or adjust your settings." });
      setIsPoemLoading(false);
    }
  }, [imageDescription, poemSettings, toast, imageDataUrl]);

  const handleSurprisePoem = useCallback(async () => {
    setIsPoemLoading(true); 
    setGeneratedPoem(null); 
    setImageDataUrl(null); 
    setGeneratedImageUrl(null);

    const randomLanguage = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    const randomLength = LENGTHS[Math.floor(Math.random() * LENGTHS.length)];

    const surpriseSettings: PoemSettings = {
      language: randomLanguage,
      style: randomStyle,
      tone: randomTone,
      poemLength: randomLength,
      customInstruction: '', 
      poeticDevices: '',
    };
    
    const surpriseDescription = "A delightful burst of spontaneous creativity!";
    
    setImageDescription(surpriseDescription); 
    setPoemSettings(surpriseSettings); 
    setIsDescriptionEditable(false);

    try {
      const poemInput: GeneratePoemInput = {
        imageDescription: surpriseDescription,
        language: surpriseSettings.language,
        style: surpriseSettings.style,
        tone: surpriseSettings.tone,
        poemLength: surpriseSettings.poemLength,
        customInstruction: surpriseSettings.customInstruction || '',
        poeticDevices: surpriseSettings.poeticDevices || '',
      };
      const result: GeneratePoemOutput = await generatePoem(poemInput);
      setGeneratedPoem(result.poem);
      setCurrentStep('display');
      setIsPoemLoading(false);

      // Also generate an image for the surprise poem
      setIsImageGenerating(true);
      try {
        const imageResult = await generateImage({ description: "Spontaneous creativity, abstract art" });
        setGeneratedImageUrl(imageResult.imageDataUri);
      } catch (imageError) {
        console.error("Error generating surprise image:", imageError);
        // Don't toast here, it's a bonus
      } finally {
        setIsImageGenerating(false);
      }
      
    } catch (error) {
      console.error("Error generating surprise poem:", error);
      toast({ variant: "destructive", title: "Surprise Poem Failed", description: "Could not generate the surprise poem. Please try again." });
      setCurrentStep('upload'); 
      setIsPoemLoading(false);
    }
  }, [toast]);

  const handleResetPoemSettingsToDefault = useCallback(() => {
    setPoemSettings(defaultPoemSettings);
    toast({ title: "Settings Reset", description: "Poem options have been reset to defaults." });
  }, [toast]);

  const handleBack = () => {
    if (currentStep === 'display') {
      setGeneratedPoem(null);
      setGeneratedImageUrl(null);
      setCurrentStep('customize');
      setIsDescriptionEditable(!imageDataUrl); 
    }
    else if (currentStep === 'customize') {
        if (imageDataUrl) { 
            setCurrentStep('describe');
            setIsDescriptionEditable(false); 
        } else { 
            resetState(); 
        }
    }
    else if (currentStep === 'describe') { 
      resetState(); 
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <PageHeader />

      <main className="w-full max-w-3xl flex-grow">
        {currentStep !== 'upload' && (
          <Button variant="ghost" onClick={handleBack} className="mb-6 text-primary hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}

        {currentStep === 'upload' && (
          <PhotoUpload
            onImageSelected={handleImageSelected}
            isLoading={isDescriptionLoading || isPoemLoading}
            onSkipToDescription={() => handleSkipToCustomize("")}
            onSurprisePoemRequest={handleSurprisePoem}
          />
        )}

        {currentStep === 'describe' && imageDataUrl && (
          <ImageDescriptionForm
            imageDataUrl={imageDataUrl}
            initialDescription={imageDescription}
            isFetchingDescription={isDescriptionLoading}
            onDescriptionConfirm={handleDescriptionConfirm}
            onSkip={handleSkipToCustomize} 
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
            onResetSettingsRequest={handleResetPoemSettingsToDefault}
          />
        )}

        {currentStep === 'display' && (
          <PoemResultDisplay
            imageUrl={imageDataUrl || generatedImageUrl}
            poem={generatedPoem}
            isGeneratingPoem={isPoemLoading}
            isGeneratingImage={isImageGenerating}
            onRegenerate={handleGeneratePoem} 
            onStartOver={resetState}
          />
        )}

        {(isDescriptionLoading || (isPoemLoading && currentStep !== 'display')) && (
           <LoadingOverlay 
                isDescriptionLoading={isDescriptionLoading}
                isPoemLoading={isPoemLoading}
                poemSettings={poemSettings}
           />
        )}
        
        <InfoAccordion />
      </main>

      <PageFooter />
    </div>
  );
}
