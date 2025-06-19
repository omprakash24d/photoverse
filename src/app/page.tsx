
"use client";

import React, { useState, useCallback } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { PhotoVerseLogo } from '@/components/photo-verse-logo';
import { PhotoUpload } from '@/components/photo-upload';
import { ImageDescriptionForm } from '@/components/image-description-form';
import { PoemCustomizationForm } from '@/components/poem-customization-form';
import { PoemResultDisplay } from '@/components/poem-result-display';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { describeImage, DescribeImageInput, DescribeImageOutput } from '@/ai/flows/describe-image';
import { generatePoem, GeneratePoemInput, GeneratePoemOutput } from '@/ai/flows/generate-poem';
import type { AppStep, PoemSettings, PoemLength } from '@/lib/types'; 
import { Loader2, ArrowLeft, Info, ShieldCheck, Lightbulb, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const defaultPoemSettings: PoemSettings = {
  language: 'English',
  style: 'Free Verse',
  tone: 'Reflective',
  poemLength: 'Medium', 
  customInstruction: '', 
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
  const [poemSettings, setPoemSettings] = useState<PoemSettings>(defaultPoemSettings);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);

  const [isDescriptionLoading, setIsDescriptionLoading] = useState<boolean>(false);
  const [isPoemLoading, setIsPoemLoading] = useState<boolean>(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState<boolean>(false);

  const { toast } = useToast();

  const resetState = useCallback(() => {
    setCurrentStep('upload');
    setImageDataUrl(null);
    setImageDescription('');
    setPoemSettings(defaultPoemSettings);
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
    } else { 
        setImageDescription(currentDesc || "A creative thought"); 
    }
    setCurrentStep('customize');
    setIsDescriptionEditable(true); 
  }, [imageDataUrl]);


  const handleGeneratePoem = useCallback(async () => {
    if (!imageDescription.trim()) {
      toast({ variant: "destructive", title: "Missing Description", description: "Please provide an image description or subject for the poem." });
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
        poemLength: poemSettings.poemLength,
        customInstruction: poemSettings.customInstruction || '', 
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

  const handleResetPoemSettingsToDefault = useCallback(() => {
    setPoemSettings(defaultPoemSettings);
    toast({ title: "Settings Reset", description: "Poem options have been reset to defaults." });
  }, [toast]);

  const handleBack = () => {
    if (currentStep === 'display') setCurrentStep('customize');
    else if (currentStep === 'customize') {
        if (imageDataUrl) {
            setCurrentStep('describe');
            setIsDescriptionEditable(false); 
        } else {
            resetState(); 
        }
    }
    else if (currentStep === 'describe') {
      setImageDataUrl(null); 
      setImageDescription('');
      setCurrentStep('upload');
      setIsDescriptionEditable(false);
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

  const creativeSparkTitle = (
    <div className="flex items-center">
      <Sparkles className="mr-3 h-5 w-5 text-primary" />
      The Creative Spark: Why PhotoVerse?
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative">
         <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div className="flex justify-center items-center gap-3 mb-2 pt-12 sm:pt-0">
          <PhotoVerseLogo className="h-12 w-12 sm:h-16 sm:w-16" />
          <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-tight">
            PhotoVerse
          </h1>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your photos (or just your words!) into emotionally resonant, AI-generated poems.
        </p>
      </header>

      <main className="w-full max-w-3xl flex-grow">
        {currentStep !== 'upload' && (
          <Button variant="ghost" onClick={handleBack} className="mb-6 text-primary hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}

        {currentStep === 'upload' && (
          <PhotoUpload 
            onImageSelected={handleImageSelected} 
            isLoading={isDescriptionLoading}
            onSkipToDescription={() => handleSkipToCustomize("")} 
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
              {isDescriptionLoading
                ? "Analyzing your masterpiece..."
                : isPoemLoading
                  ? `Weaving your ${poemSettings.poemLength.toLowerCase()} ${poemSettings.style.toLowerCase()} poem in ${poemSettings.language}...`
                  : "Processing..."
              }
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
                <p>PhotoVerse is designed to be an intuitive and inspiring tool. Here's a breakdown of how you can create your own AI-generated poems:</p>
                <ol className="list-decimal list-inside space-y-3 pl-4">
                  <li><strong>Provide Your Inspiration (Image or Text):</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Upload an Image:</strong> Choose a photo from your device or capture a new one using your webcam. For best results, use clear, well-focused images that convey a distinct subject or mood. The AI will "see" this image to generate its initial description.</li>
                        <li><strong>Or, Just Use Words:</strong> Don't have an image, or prefer to start differently? No problem! Select the option to "Write Description Manually." You can then directly type or paste a description of any scene, emotion, idea, or memory you'd like the poem to be about.</li>
                    </ul>
                  </li>
                  <li><strong>Review & Refine the Description:</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>AI-Generated (if image uploaded):</strong> If you provided an image, our advanced AI will analyze its content and generate a textual description.</li>
                        <li><strong>Your Input is Key:</strong> This description is crucial as it forms the primary input for the poem generation AI. You can (and are encouraged to!) review this description, edit it for accuracy or emphasis, or even replace it entirely. The more evocative, detailed, and accurate the description, the richer and more relevant your poem will be!</li>
                    </ul>
                  </li>
                  <li><strong>Customize Your Poem's Voice:</strong> Tailor the poem to your liking by selecting:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Language:</strong> Choose from English, Hindi, or Hinglish.</li>
                        <li><strong>Poetic Style:</strong> Select a style like Haiku, Free Verse, Romantic, etc. Each style has its own structural and thematic conventions.</li>
                        <li><strong>Tone/Mood:</strong> Set the emotional feel of the poem, such as Joyful, Calm, Melancholic, etc.</li>
                        <li><strong>Poem Length:</strong> Indicate whether you'd prefer a Short, Medium, or Long poem.</li>
                        <li><strong>Custom Instruction (Optional):</strong> Add a specific note for the AI, like "make it rhyme" or "focus on nature."</li>
                    </ul>
                  </li>
                  <li><strong>Generate & Iterate:</strong> Once you're happy with the description and settings, click "Generate Poem." Our AI will then craft a unique piece of poetry based on your inputs.
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Not quite right?</strong> Don't hesitate to regenerate the poem! You can also go back, tweak the description, or change any of the settings and try again. Experimentation often leads to the most delightful results. Use the "Surprise Me!" button for a random combination of settings!</li>
                        <li><strong>Edit the Result:</strong> Once generated, you can directly edit the poem before copying or downloading.</li>
                    </ul>
                  </li>
                </ol>
                <div className="flex items-start mt-3 p-3 bg-accent/10 rounded-md">
                  <Lightbulb className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Tips for Best Results:</h4>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li><strong>Image Quality (if used):</strong> Use clear, well-lit images. The better the AI can "see" the image, the better the description.</li>
                      <li><strong>Detailed Descriptions:</strong> Whether AI-generated, edited, or written from scratch, be specific! The more detail you provide (objects, colors, emotions, actions), the more material the AI has for the poem.</li>
                      <li><strong>Experiment:</strong> Don't be afraid to try different combinations of languages, styles, and tones. You might be surprised by the variety of poems you can create from a single image or idea! Regenerate if you're curious.</li>
                       <li><strong>Edit the AI's Description:</strong> The AI provides a good starting point, but your personal touch can make the resulting poem even more meaningful. Feel free to heavily edit or completely rewrite the description.</li>
                       <li><strong>Use Custom Instructions:</strong> If you have a specific idea in mind (e.g., "include a metaphor about the sea"), use the custom instruction field.</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creative-spark">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {creativeSparkTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <p>PhotoVerse was born from a passion for connecting the visual with the lyrical, the image with the word. It's more than just an AI tool; it's an invitation to explore your creativity in new ways.</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Find Poetry Everywhere:</strong> We believe that every image, every scene, every fleeting thought holds the seed of a poem. PhotoVerse is here to help you nurture that seed.</li>
                  <li><strong>Your Unique Voice:</strong> Experiment with different styles, tones, and languages. The AI provides the canvas, but your choices paint the masterpiece.</li>
                  <li><strong>A Tool for Inspiration:</strong> Whether you're a seasoned poet looking for a new spark or someone curious about expressing themselves through verse, PhotoVerse is designed to be an inspiring companion.</li>
                  <li><strong>Crafted with Care:</strong> Developed by Om Prakash, PhotoVerse is a project built with the hope of bringing a little more art and beauty into the digital world.</li>
                </ul>
                <p className="mt-2">We're continuously working to enhance PhotoVerse and bring you even more creative possibilities. Happy poem-crafting!</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {privacyTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <p>We take your privacy seriously. Here’s how we handle your data when you use PhotoVerse:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Image Handling (if uploaded):</strong> When you upload an image, it is securely transmitted to our AI service solely for the purpose of generating a description. This image data is processed in memory and is <strong>not stored permanently on our servers</strong> after the description is generated and your current session ends.</li>
                  <li><strong>Description & Poem Settings:</strong> The image description (whether AI-generated, from your image, or manually entered by you) and your chosen poem preferences (language, style, tone, length, custom instructions) are sent to another secure AI service to craft your unique poem. This information is also processed in memory for the duration of the generation and is <strong>not stored permanently</strong> associated with you unless you choose to save it via an account feature (if available and you are logged in). Currently, poems are not saved to user accounts automatically.</li>
                  <li><strong>User Accounts (if you sign in):</strong> If you create an account or sign in (e.g., via Google or other Clerk-supported methods), we will store your basic profile information provided by the authentication provider (like name, email, profile picture) to identify you. Any poems or settings you explicitly choose to save to your account (a feature planned for the future) will be stored in our secure database, associated with your account. At present, logging in provides a personalized experience but does not automatically save your creations.</li>
                  <li><strong>No Personal Data Collection (Beyond Input & Account):</strong> PhotoVerse does not request, collect, or store any personal identifiable information (PII) beyond what's necessary for account functioning and the inputs you provide for poem generation. You are responsible for the content of the images you choose to upload and the text you provide; please be mindful and avoid uploading/entering sensitive personal information if you have privacy concerns.</li>
                  <li><strong>Secure Transmission:</strong> We use industry-standard HTTPS encryption for all data transmitted between your browser and our services. This ensures that your image data, text inputs, and account information are protected during transit.</li>
                  <li><strong>No Third-Party Sharing (Beyond Essential AI & Auth Services):</strong> Your inputs are only shared with the specific AI models required for generating image descriptions and poems, and with the authentication provider (e.g., Clerk) if you sign in. We do not sell, rent, or share your data with any other third parties for advertising, marketing, or other purposes.</li>
                  <li><strong>Ephemeral Creative Sessions (for guests):</strong> Think of your time on PhotoVerse as a creative session. If you are not logged in, once you close your browser tab or use the "Start New" button, the specific data from that session (image, description, poem) is not retained by our application.</li>
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
          PhotoVerse: An AI-powered tool to transform images and ideas into poetry.
        </p>
      </footer>
    </div>
  );
}

    

    