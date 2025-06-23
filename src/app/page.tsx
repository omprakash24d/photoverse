
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { describeImage, DescribeImageInput, DescribeImageOutput } from '@/ai/flows/describe-image';
import { generatePoem, GeneratePoemInput, GeneratePoemOutput } from '@/ai/flows/generate-poem';
import { generateImage, GenerateImageInput, GenerateImageOutput } from '@/ai/flows/generate-image';
import { textToSpeech, TextToSpeechInput, TextToSpeechOutput } from '@/ai/flows/text-to-speech';
import { AppStep, PoemSettings, PoemLength, LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';
import { ArrowLeft, Loader2, FileImage } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { PhotoUpload } from '@/components/photo-upload';
import { ImageDescriptionForm } from '@/components/image-description-form';
import { PoemCustomizationForm } from '@/components/poem-customization-form';
import { PoemResultDisplay } from '@/components/poem-result-display';
import { InfoAccordion } from '@/components/info-accordion';
import { PageFooter } from '@/components/page-footer';
import { ProTips } from '@/components/pro-tips';


const defaultPoemSettings: PoemSettings = {
  language: 'English',
  style: 'Free Verse',
  tone: 'Reflective',
  poemLength: 'Medium',
  customInstruction: '',
  poeticDevices: '',
};

const MAX_IMAGE_DIMENSION = 1024; // Max width or height of 1024px

const inferMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream'; // Fallback
  }
};


const processAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    let fileType = file.type;
    // If the browser provides a generic MIME type, try to infer a better one from the file extension.
    if (fileType === 'application/octet-stream') {
        const inferredType = inferMimeType(file.name);
        if (inferredType !== 'application/octet-stream') {
            fileType = inferredType;
        } else {
            // If we still can't determine the type, reject it.
            return reject(new Error('Invalid file type. Could not determine image format.'));
        }
    }

    if (!fileType.startsWith('image/')) {
        return reject(new Error('Invalid file type. Please upload an image.'));
    }
      
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        
        // If image is already small enough, no need to resize.
        if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
          // Resolve with the original data URI, but ensure it has the correct MIME type
          let originalDataUrl = e.target?.result as string;
          if (originalDataUrl.startsWith('data:application/octet-stream')) {
             originalDataUrl = `data:${fileType};base64,${originalDataUrl.split(',')[1]}`;
          }
          resolve(originalDataUrl);
          return;
        }

        // Determine new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > MAX_IMAGE_DIMENSION) {
            height = Math.round(height * (MAX_IMAGE_DIMENSION / width));
            width = MAX_IMAGE_DIMENSION;
          }
        } else {
          if (height > MAX_IMAGE_DIMENSION) {
            width = Math.round(width * (MAX_IMAGE_DIMENSION / height));
            height = MAX_IMAGE_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return reject(new Error('Could not get canvas context for image resizing.'));
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the resized image to a JPEG data URL for better compression.
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(resizedDataUrl);
      };

      img.onerror = () => {
        reject(new Error("Could not load the image file for processing. It may be corrupt."));
      };

      // Set the image source to the file reader result
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Could not read the image file."));
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
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);

  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [isPoemLoading, setIsPoemLoading] = useState<boolean>(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState<boolean>(false);
  const [isImageGenerating, setIsImageGenerating] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);


  const { toast } = useToast();

  const resetState = useCallback(() => {
    setCurrentStep('upload');
    setImageDataUrl(null);
    setImageDescription('');
    setPoemSettings(defaultPoemSettings);
    setGeneratedPoem(null);
    setGeneratedImageUrl(null);
    setAudioDataUrl(null);
    setIsDescriptionLoading(false);
    setIsPoemLoading(false);
    setIsImageGenerating(false);
    setIsAudioLoading(false);
    setIsDescriptionEditable(false);
  }, []);

  const handleImageSelected = useCallback(async (imageSource: File | string) => {
    let dataUrl: string;
    if (typeof imageSource === 'string') {
      dataUrl = imageSource; // From webcam, already correctly sized
    } else {
      try {
        // Use the new resizing and processing function
        dataUrl = await processAndResizeImage(imageSource);
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
        description: (error as Error).message,
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
        description: (error as Error).message,
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

  const handleSkipToCustomize = useCallback(() => {
    if (imageDataUrl) { 
      // User is on 'describe' page and wants to write their own description
      setImageDescription(""); // Clear description for fresh input
      setIsDescriptionEditable(true); 
    } else { 
      // User is on 'upload' page and clicked "Write Description Manually"
      setImageDescription(""); 
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
    setAudioDataUrl(null);
    
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

      // After poem is generated, kick off image and audio generation in parallel
      const enhancementPromises = [];

      // Task 1: Generate audio for the poem
      setIsAudioLoading(true);
      const audioPromise = textToSpeech(result.poem)
        .then(audioResult => setAudioDataUrl(audioResult.audioDataUri))
        .catch(audioError => {
            console.error("Error generating audio:", audioError);
            // Non-blocking, so just log it. A toast might be too noisy.
        })
        .finally(() => setIsAudioLoading(false));
      enhancementPromises.push(audioPromise);

      // Task 2: If user started with text, generate an image for them
      if (!imageDataUrl) {
        setIsImageGenerating(true);
        const imagePromise = generateImage({ description: imageDescription })
          .then(imageResult => setGeneratedImageUrl(imageResult.imageDataUri))
          .catch(imageError => {
            console.error("Error generating image:", imageError);
            toast({
              variant: "destructive",
              title: "AI Image Failed",
              description: (imageError as Error).message,
            });
          })
          .finally(() => setIsImageGenerating(false));
        enhancementPromises.push(imagePromise);
      }
      
      // We don't need to await these here as the UI will update when they complete
      // Promise.allSettled(enhancementPromises);

    } catch (error) {
      console.error("Error generating poem:", error);
      toast({ variant: "destructive", title: "Poem Generation Failed", description: (error as Error).message });
      setIsPoemLoading(false);
    }
  }, [imageDescription, poemSettings, toast, imageDataUrl]);

  const handleRequestSurprisePoem = useCallback(() => {
    setImageDataUrl(null);
    setGeneratedImageUrl(null);
    setAudioDataUrl(null);

    const randomLanguage = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    const randomLength = LENGTHS[Math.floor(Math.random() * LENGTHS.length)];

    const surpriseSettings: PoemSettings = {
      ...defaultPoemSettings, // Start with defaults to ensure all fields are present
      language: randomLanguage,
      style: randomStyle,
      tone: randomTone,
      poemLength: randomLength,
    };
    
    const surpriseDescription = "A delightful burst of spontaneous creativity!";
    
    setImageDescription(surpriseDescription); 
    setPoemSettings(surpriseSettings); 
    setIsDescriptionEditable(true);
    setCurrentStep('customize');
    
    toast({
        title: "Surprise Settings Applied!",
        description: "We've picked some random options for you. Feel free to adjust them or generate your poem!",
    });
  }, [toast]);

  const handleResetPoemSettingsToDefault = useCallback(() => {
    setPoemSettings(defaultPoemSettings);
    toast({ title: "Settings Reset", description: "Poem options have been reset to defaults." });
  }, [toast]);

  const handleBack = () => {
    if (currentStep === 'display') {
      setGeneratedPoem(null);
      setGeneratedImageUrl(null);
      setAudioDataUrl(null);
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
            onSkipToDescription={() => handleSkipToCustomize()}
            onSurprisePoemRequest={handleRequestSurprisePoem}
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
            audioDataUrl={audioDataUrl}
            isGeneratingPoem={isPoemLoading}
            isGeneratingImage={isImageGenerating}
            isGeneratingAudio={isAudioLoading}
            onRegenerate={handleGeneratePoem} 
            onStartOver={resetState}
          />
        )}
        
        {currentStep !== 'display' && <ProTips />}
        <InfoAccordion />
      </main>

      <PageFooter />
    </div>
  );
}
