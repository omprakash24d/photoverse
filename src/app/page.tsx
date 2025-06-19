
"use client";

import React, { useState, useCallback } from 'react';
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
import { Loader2, ArrowLeft, Info, ShieldCheck, Lightbulb } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    if (typeof imageSource === 'string') { 
      dataUrl = imageSource;
    } else { 
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
      setImageDescription(""); 
      toast({
        variant: "destructive",
        title: "AI Description Failed",
        description: "Could not generate an AI description. Please write one manually.",
      });
    } finally {
      setIsDescriptionLoading(false);
      setIsDescriptionEditable(false); 
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
    setIsDescriptionEditable(false); 
  }, []);

  const handleSkipDescription = useCallback((currentDesc: string) => {
    setImageDescription(currentDesc); 
    setCurrentStep('customize');
    setIsDescriptionEditable(true); 
  }, []);

  const handleGeneratePoem = useCallback(async () => {
    if (!imageDescription.trim()) {
      toast({ variant: "destructive", title: "Missing Description", description: "Please provide an image description." });
      return;
    }
    setIsPoemLoading(true);
    setGeneratedPoem(null); 
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
      setImageDataUrl(null);
      setImageDescription('');
      setCurrentStep('upload');
    }
  };

  const howItWorksTitle = (
    <div className="flex items-center">
      <Info className="mr-3 h-5 w-5 text-primary" />
      How PhotoVerse Works & Tips
    </div>
  );

  const privacyTitle = (
    <div className="flex items-center">
      <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
      Your Data, Your Privacy
    </div>
  );

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

        <section className="mt-12 w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {howItWorksTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <p>PhotoVerse transforms your images into poetry through a simple three-step AI-powered process:</p>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                  <li><strong>Upload Your Image:</strong> Start by uploading a photo from your device or capture one using your webcam. Clear, well-focused images generally lead to more detailed and relevant AI descriptions.</li>
                  <li><strong>AI Describes Your Image:</strong> Our advanced AI analyzes your uploaded image and generates a textual description. You have the opportunity to review this description, edit it to better match your vision, or even write your own from scratch if you prefer. The more evocative and accurate the description, the richer and more personalized your poem will be!</li>
                  <li><strong>Customize & Generate Poem:</strong> Choose your desired language (English, Hindi, or Hinglish), select a poetic style (like Haiku, Free Verse, Romantic, etc.), and set the tone (e.g., Joyful, Reflective, Humorous). Once you're ready, click "Generate Poem" and watch as PhotoVerse crafts a unique piece of poetry inspired by your image and preferences.</li>
                </ol>
                <div className="flex items-start mt-3 p-3 bg-accent/10 rounded-md">
                  <Lightbulb className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Tips for Best Results:</h4>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li><strong>Image Quality:</strong> Use clear, well-lit images. The better the AI can "see" the image, the better the description.</li>
                      <li><strong>Detailed Descriptions:</strong> If you edit or write your own description, be specific! The more detail you provide, the more material the AI has to work with for the poem.</li>
                      <li><strong>Experiment:</strong> Don't be afraid to try different combinations of languages, styles, and tones. You might be surprised by the variety of poems you can create from a single image!</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {privacyTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <p>We take your privacy seriously. Here’s how we handle your data when you use PhotoVerse:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Image Handling:</strong> When you upload an image, it is securely transmitted to our AI service solely for the purpose of generating a description. This image data is processed in memory and is <strong>not stored permanently on our servers</strong> after the description is generated and your current session ends. We only use it to create the initial description for your poem.</li>
                  <li><strong>Description & Poem Settings:</strong> The image description (whether AI-generated or manually entered by you) and your chosen poem preferences (language, style, tone) are sent to another secure AI service to craft your unique poem. This information is also processed in memory for the duration of the generation and is <strong>not stored permanently</strong> associated with you.</li>
                  <li><strong>No Personal Data Collection (Beyond Image Content):</strong> PhotoVerse does not request, collect, or store any personal identifiable information (PII) such as your name, email address, or location. You are responsible for the content of the images you choose to upload; please be mindful and avoid uploading images that contain sensitive personal information if you have privacy concerns.</li>
                  <li><strong>Secure Transmission:</strong> We use industry-standard HTTPS encryption for all data transmitted between your browser and our services. This ensures that your image data and poem preferences are protected during transit.</li>
                  <li><strong>No Third-Party Sharing (Beyond Essential AI Services):</strong> Your images and text are only shared with the specific AI models required for generating image descriptions and poems. We do not sell, rent, or share your data with any other third parties for advertising, marketing, or other purposes.</li>
                  <li><strong>Ephemeral Creative Sessions:</strong> Think of your time on PhotoVerse as a creative session. Once you close your browser tab or use the "Start New" button, the specific data from that session (image, description, poem) is not retained by our application in a way that is tied to you.</li>
                </ul>
                <p className="mt-2">Our goal is to provide a fun, creative tool while respecting your privacy. If you have any questions, please feel free to reach out (though specific contact info isn't part of this UI build).</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
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

    