
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
import { AppStep, PoemSettings, PoemLength, LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';
import { Loader2, ArrowLeft, Info, ShieldCheck, Lightbulb, Sparkles, HelpCircle, Wand2 } from 'lucide-react';
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
      dataUrl = imageSource; // It's already a data URL (from webcam)
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
      setIsDescriptionEditable(false); // AI description is initial, user confirms or edits
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
    setIsDescriptionEditable(false); // Confirmed, so not editable by default in customize screen unless no image
  }, []);

  const handleSkipToCustomize = useCallback((currentDesc: string = "") => {
    // If an image was uploaded, use currentDesc (which might be edited AI desc, or empty if user cleared it)
    // If no image was ever uploaded, this path is for "Write Description Manually"
    if (imageDataUrl) {
        setImageDescription(currentDesc || "A beautiful scene"); // Default if cleared
    } else {
        // This is the "Write Description Manually" path from upload step
        setImageDescription(currentDesc || ""); // Start with empty or passed desc
    }
    setCurrentStep('customize');
    setIsDescriptionEditable(true); // Always editable if skipping or manual entry
  }, [imageDataUrl]);


  const handleGeneratePoem = useCallback(async () => {
    if (!imageDescription.trim()) {
      toast({ variant: "destructive", title: "Missing Description", description: "Please provide an image description or subject for the poem." });
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
        poemLength: poemSettings.poemLength,
        customInstruction: poemSettings.customInstruction || '',
      };
      const result: GeneratePoemOutput = await generatePoem(poemInput);
      setGeneratedPoem(result.poem);
      setCurrentStep('display');
    } catch (error) {
      console.error("Error generating poem:", error);
      toast({ variant: "destructive", title: "Poem Generation Failed", description: "Could not generate the poem. Please try again or adjust your settings." });
    } finally {
      setIsPoemLoading(false);
    }
  }, [imageDescription, poemSettings, toast]);

  const handleSurprisePoem = useCallback(async () => {
    setIsPoemLoading(true); // Show loader immediately
    setGeneratedPoem(null); // Clear previous poem
    setImageDataUrl(null); // No image for this flow

    const randomLanguage = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    const randomLength = LENGTHS[Math.floor(Math.random() * LENGTHS.length)];

    const surpriseSettings: PoemSettings = {
      language: randomLanguage,
      style: randomStyle,
      tone: randomTone,
      poemLength: randomLength,
      customInstruction: '', // No custom instruction for a pure surprise
    };
    
    const surpriseDescription = "A delightful burst of spontaneous creativity!";
    
    setImageDescription(surpriseDescription); // Set the description state
    setPoemSettings(surpriseSettings); // Set the poem settings state
    setIsDescriptionEditable(false); // Description is fixed for this initial surprise poem

    try {
      const poemInput: GeneratePoemInput = {
        imageDescription: surpriseDescription,
        language: surpriseSettings.language,
        style: surpriseSettings.style,
        tone: surpriseSettings.tone,
        poemLength: surpriseSettings.poemLength,
        customInstruction: surpriseSettings.customInstruction || '',
      };
      const result: GeneratePoemOutput = await generatePoem(poemInput);
      setGeneratedPoem(result.poem);
      setCurrentStep('display');
    } catch (error) {
      console.error("Error generating surprise poem:", error);
      toast({ variant: "destructive", title: "Surprise Poem Failed", description: "Could not generate the surprise poem. Please try again." });
       // If fails, maybe reset to upload or stay on current screen (upload)
      setCurrentStep('upload'); // Go back to upload on failure of surprise
    } finally {
      setIsPoemLoading(false);
    }
  }, [toast]);

  const handleResetPoemSettingsToDefault = useCallback(() => {
    setPoemSettings(defaultPoemSettings);
    toast({ title: "Settings Reset", description: "Poem options have been reset to defaults." });
  }, [toast]);

  const handleBack = () => {
    if (currentStep === 'display') {
      setCurrentStep('customize');
      // If it was a surprise poem (no image data), description should be editable on customize screen
      if (!imageDataUrl) {
        setIsDescriptionEditable(true);
      } else {
        // If there was an image, the description shown in customize was the confirmed one, not typically editable unless skipped to
         setIsDescriptionEditable(false); // Or maintain previous isDescriptionEditable state if more complex logic is needed
      }
    }
    else if (currentStep === 'customize') {
        if (imageDataUrl) { // If there was an image, go back to describe
            setCurrentStep('describe');
            setIsDescriptionEditable(false); // AI description is not editable by default on describe screen
        } else { // No image was ever uploaded (e.g. manual desc or surprise poem flow)
            resetState(); // Go back to upload and clear everything
        }
    }
    else if (currentStep === 'describe') { // Came from upload with an image
      resetState(); // Go back to upload and clear image/description
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

  const faqTitle = (
    <div className="flex items-center">
      <HelpCircle className="mr-3 h-5 w-5 text-primary" />
      Frequently Asked Questions
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-8 font-body">
      <header className="w-full max-w-3xl text-center mb-8 sm:mb-12 relative">
         <div className="absolute top-0 right-0 sm:top-4 sm:right-4 z-10 flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
               <Button size="sm">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
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
            onSkip={handleSkipToCustomize} // Passes current description
            onFetchDescriptionRequest={handleFetchAIDescription}
          />
        )}

        {currentStep === 'customize' && (
          <PoemCustomizationForm
            initialDescription={imageDescription}
            isDescriptionEditable={isDescriptionEditable || !imageDataUrl} 
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
            onRegenerate={handleGeneratePoem} // Uses current imageDescription and poemSettings
            onStartOver={resetState}
          />
        )}

        {(isDescriptionLoading || isPoemLoading) && currentStep !== 'display' && (
          <div className="fixed inset-0 bg-background/80 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
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
                <div>PhotoVerse is designed to be an intuitive and inspiring tool. Here's a breakdown of how you can create your own AI-generated poems:</div>
                <ol className="list-decimal list-inside space-y-3 pl-4">
                  <li><strong>Provide Your Inspiration (Image, Text, or Surprise!):</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Upload an Image:</strong> Choose a photo from your device or capture a new one using your webcam. For best results, use clear, well-focused images that convey a distinct subject or mood. The AI will "see" this image to generate its initial description.</li>
                        <li><strong>Or, Just Use Words:</strong> Don't have an image, or prefer to start differently? No problem! Select the option to "Write Description Manually." You can then directly type or paste a description of any scene, emotion, idea, or memory you'd like the poem to be about.</li>
                        <li><strong>Feeling Lucky? Try "Surprise Me with a Poem!":</strong> For a spontaneous poetic spark, click this button on the first screen. PhotoVerse will instantly generate a poem with random settings and a delightful, generic theme.</li>
                    </ul>
                  </li>
                  <li><strong>Review & Refine the Description (if not a "Surprise Poem"):</strong>
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>AI-Generated (if image uploaded):</strong> If you provided an image, our advanced AI will analyze its content and generate a textual description.</li>
                        <li><strong>Your Input is Key:</strong> This description is crucial as it forms the primary input for the poem generation AI. You can (and are encouraged to!) review this description, edit it for accuracy or emphasis, or even replace it entirely. The more evocative, detailed,and accurate the description, the richer and more relevant your poem will be!</li>
                    </ul>
                  </li>
                  <li><strong>Customize Your Poem's Voice:</strong> Tailor the poem to your liking by selecting:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Language:</strong> Choose from English, Hindi, or Hinglish.</li>
                        <li><strong>Poetic Style:</strong> Select a style like Haiku, Free Verse, Romantic, etc. Each style has its own structural and thematic conventions.</li>
                        <li><strong>Tone/Mood:</strong> Set the emotional feel of the poem, such as Joyful, Calm, Melancholic, etc.</li>
                        <li><strong>Poem Length:</strong> Indicate whether you'd prefer a Short, Medium, or Long poem.</li>
                        <li><strong>Custom Instruction (Optional):</strong> Add a specific note for the AI, like "make it rhyme" or "focus on nature."</li>
                        <li><strong>"Surprise Me!" (Settings):</strong> On the customization screen, this button shuffles language, style, tone, and length for new creative combinations.</li>
                    </ul>
                  </li>
                  <li><strong>Generate & Iterate:</strong> Once you're happy with the description and settings, click "Generate Poem." Our AI will then craft a unique piece of poetry based on your inputs.
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                        <li><strong>Not quite right?</strong> Don't hesitate to regenerate the poem! You can also go back, tweak the description, or change any of the settings and try again. Experimentation often leads to the most delightful results.</li>
                        <li><strong>Edit the Result:</strong> Once generated, you can directly edit the poem in the provided text area before copying or downloading.</li>
                    </ul>
                  </li>
                </ol>
                <div className="flex items-start mt-3 p-3 bg-accent/10 rounded-md">
                  <Lightbulb className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Tips for Best Results:</h4>
                    <ul className="list-disc list-inside space-y-2 mt-1">
                      <li><strong>Image Quality (if used):</strong> Use clear, well-lit images. The better the AI can "see" the image, the better the initial description.</li>
                      <li><strong>Detailed Descriptions are Key:</strong> Whether AI-generated, edited, or written from scratch, be specific! The more detail you provide (objects, colors, emotions, actions, a story), the more material the AI has for crafting a rich poem.
                        <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                          <li>If a poem is too abstract, try adding more concrete nouns and actions to your description.</li>
                          <li>If the poem misses the mark emotionally, ensure your description explicitly mentions the desired feelings or atmosphere.</li>
                        </ul>
                      </li>
                      <li><strong>Experiment with Settings:</strong> Don't be afraid to try different combinations of languages, styles, and tones. A "Romantic" style will interpret your description differently than a "Haiku."
                         <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                           <li>If a "Free Verse" poem feels too unstructured, try a "Sonnet" or another style with more defined rules (but ensure your description is rich enough).</li>
                           <li>If a "Short" poem feels incomplete, try "Medium" or "Long" for more development.</li>
                         </ul>
                      </li>
                       <li><strong>Master the Custom Instruction:</strong> Use this field for specific requests. Examples:
                         <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                           <li>"Make it rhyme" (though the AI might attempt this based on style too).</li>
                           <li>"Focus on the theme of hope."</li>
                           <li>"Include a metaphor about a flowing river."</li>
                           <li>"Ensure the poem has a narrative arc."</li>
                           <li>"Avoid using the word 'love'."</li>
                         </ul>
                       </li>
                       <li><strong>Iterate, Iterate, Iterate:</strong> The first poem might not be perfect. Use the "Regenerate" button. Go back and tweak the description. Change one setting at a time to see its effect. Editing the AI's initial description is often a powerful step.</li>
                       <li><strong>Use "Surprise Me!":</strong> Both the initial "Surprise Me with a Poem!" and the "Surprise Me!" for settings on the customization page are great for breaking creative blocks or discovering unexpected combinations.</li>
                       <li><strong>Edit the Final Poem:</strong> Remember, the AI's output is a starting point. You have full control to edit the generated poem in the text area to make it truly yours.</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {faqTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-4 p-2">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">What kind of images work best?</h4>
                  <div>Clear, well-focused images with distinct subjects or moods tend to yield the most evocative descriptions and poems. High-contrast images or those with interesting compositions can also inspire more creative AI output.</div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Can I use PhotoVerse without an image?</h4>
                  <div>Absolutely! If you don't have an image or prefer to start with an idea, simply choose the "Write Description Manually" option on the first step. You can also try the "Surprise Me with a Poem!" button for instant inspiration without any initial input from you.</div>
                </div>
                 <div>
                  <h4 className="font-semibold text-foreground mb-1">What is the "Surprise Me with a Poem!" feature?</h4>
                  <div>This button on the starting page lets you instantly generate a poem. PhotoVerse will pick random settings (language, style, tone, length) and use a generic creative prompt to give you a unique poem without needing an image or manual description. It's great for quick inspiration or seeing what the AI can do!</div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">How is the AI image description generated?</h4>
                  <div>When you upload an image, PhotoVerse uses an advanced AI vision model to analyze its content, identifying objects, scenes, colors, and potential emotions or themes. This analysis is then translated into a textual description.</div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">What if I don't like the generated poem?</h4>
                  <div>Poetry is subjective! If the first result isn't quite what you're looking for:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                      <li>Try clicking "Regenerate Poem" with the same settings; the AI might offer a different take.</li>
                      <li>Go back and edit the image description. Adding more detail, changing the focus, or adjusting the tone of the description can significantly impact the poem. Refer to our "Tips for Best Results."</li>
                      <li>Experiment with different "Poem Options" (language, style, tone, length). Use the "Surprise Me!" button on the customization page for random settings.</li>
                      <li>Use the "Custom Instruction" field to give the AI more specific guidance.</li>
                      <li>Once a poem is generated, you can directly edit it in the text area provided to perfect it.</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Are my images and poems stored?</h4>
                  <div>Please refer to our "Your Data, Your Privacy" section for details. Generally, for guest users, images are processed for description and then discarded from our active servers. Poems are generated based on your input and are not stored permanently unless you are signed in and a future "save" feature is used explicitly. Your privacy is important to us.</div>
                </div>
                 <div>
                  <h4 className="font-semibold text-foreground mb-1">What languages, styles, and tones are available?</h4>
                  <div>PhotoVerse offers a variety of options! You can select different languages (e.g., English, Hindi, Hinglish), poetic styles (e.g., Haiku, Free Verse, Sonnet, Romantic), tones (e.g., Joyful, Melancholic, Reflective), and poem lengths (Short, Medium, Long). Explore the dropdown menus in the "Customize Your Poem" step to see all available choices.</div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="creative-spark">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {creativeSparkTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <div>PhotoVerse was born from a passion for connecting the visual with the lyrical, the image with the word. It's more than just an AI tool; it's an invitation to explore your creativity in new ways.</div>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Find Poetry Everywhere:</strong> We believe that every image, every scene, every fleeting thought holds the seed of a poem. PhotoVerse is here to help you nurture that seed, or even surprise you with one!</li>
                  <li><strong>Your Unique Voice:</strong> Experiment with different styles, tones, and languages. The AI provides the canvas, but your choices paint the masterpiece.</li>
                  <li><strong>A Tool for Inspiration:</strong> Whether you're a seasoned poet looking for a new spark or someone curious about expressing themselves through verse, PhotoVerse is designed to be an inspiring companion.</li>
                  <li><strong>Crafted with Care:</strong> Developed by Om Prakash, PhotoVerse is a project built with the hope of bringing a little more art and beauty into the digital world.</li>
                </ul>
                <div className="mt-2">We're continuously working to enhance PhotoVerse and bring you even more creative possibilities. Happy poem-crafting!</div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="privacy">
              <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline">
                {privacyTitle}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3 p-2">
                <div>We take your privacy seriously. Here’s how we handle your data when you use PhotoVerse:</div>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li><strong>Image Handling (if uploaded):</strong> When you upload an image, it is securely transmitted to our AI service solely for the purpose of generating a description. This image data is processed in memory and is <strong>not stored permanently on our servers</strong> after the description is generated and your current session ends.</li>
                  <li><strong>Description & Poem Settings:</strong> The image description (whether AI-generated, from your image, or manually entered by you) and your chosen poem preferences (language, style, tone, length, custom instructions) are sent to another secure AI service to craft your unique poem. This information is also processed in memory for the duration of the generation and is <strong>not stored permanently</strong> associated with you unless you choose to save it via an account feature (if available and you are logged in). Currently, poems are not saved to user accounts automatically.</li>
                  <li><strong>"Surprise Me" Poem Generation:</strong> When you use the "Surprise Me with a Poem!" feature, no image is uploaded. A generic creative prompt and randomly selected poem settings are used for generation. This process adheres to the same data handling principles as other poem generations.</li>
                  <li><strong>User Accounts (if you sign in):</strong> If you create an account or sign in (e.g., via Google or other Clerk-supported methods), we will store your basic profile information provided by the authentication provider (like name, email, profile picture) to identify you. Any poems or settings you explicitly choose to save to your account (a feature planned for the future) will be stored in our secure database, associated with your account. At present, logging in provides a personalized experience but does not automatically save your creations.</li>
                  <li><strong>No Personal Data Collection (Beyond Input & Account):</strong> PhotoVerse does not request, collect, or store any personal identifiable information (PII) beyond what's necessary for account functioning and the inputs you provide for poem generation. You are responsible for the content of the images you choose to upload and the text you provide; please be mindful and avoid uploading/entering sensitive personal information if you have privacy concerns.</li>
                  <li><strong>Secure Transmission:</strong> We use industry-standard HTTPS encryption for all data transmitted between your browser and our services. This ensures that your image data, text inputs, and account information are protected during transit.</li>
                  <li><strong>No Third-Party Sharing (Beyond Essential AI & Auth Services):</strong> Your inputs are only shared with the specific AI models required for generating image descriptions and poems, and with the authentication provider (e.g., Clerk) if you sign in. We do not sell, rent, or share your data with any other third parties for advertising, marketing, or other purposes.</li>
                  <li><strong>Ephemeral Creative Sessions (for guests):</strong> Think of your time on PhotoVerse as a creative session. If you are not logged in, once you close your browser tab or use the "Start New" button, the specific data from that session (image, description, poem) is not retained by our application.</li>
                </ul>
                <div className="mt-2">Our goal is to provide a fun, creative tool while respecting your privacy. If you have any questions, please feel free to reach out (though specific contact info isn't part of this UI build).</div>
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
    
