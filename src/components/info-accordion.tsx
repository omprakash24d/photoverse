
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';

export function InfoAccordion() {
  const howItWorksTitle = (
    <div className="flex items-center">
      <Info className="mr-2 h-4 w-4 text-primary" />
      How PhotoVerse Works
    </div>
  );

  const privacyTitle = (
    <div className="flex items-center">
      <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
      Your Data, Your Privacy
    </div>
  );

  const creativeSparkTitle = (
    <div className="flex items-center">
      <Sparkles className="mr-2 h-4 w-4 text-primary" />
      The Creative Spark
    </div>
  );

  const faqTitle = (
    <div className="flex items-center">
      <HelpCircle className="mr-2 h-4 w-4 text-primary" />
      Frequently Asked Questions
    </div>
  );

  return (
    <section className="mt-8 w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="how-it-works">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-2">
            {howItWorksTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-3 px-2 pb-2">
            <p>Welcome! Here’s a simple guide to creating your first AI-powered poem.</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>
                <strong>Start with Inspiration:</strong> Choose your path! Upload a photo, use your webcam, start with just words, or click "Surprise Me!" for an instant creative prompt.
              </li>
              <li>
                <strong>Refine Your Subject:</strong> This is key! Review the AI-generated or manually written description. The more detail, emotion, and color you add, the better your poem will be.
              </li>
               <li>
                <strong>Customize Your Poem:</strong> Choose the Language, Style, Tone, and Length. Use the optional fields for specific instructions or to include certain poetic devices.
              </li>
              <li>
                <strong>Generate & Perfect:</strong> Click "Generate Poem"! If you don't love the first result, hit Regenerate or go back to tweak your description. You can also edit the final poem directly.
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-2">
            {faqTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-4 px-2 pb-2">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Do I need an image?</h4>
              <div>Not at all! Choose "Write Description Manually" to start with any idea, or click "Surprise Me with a Poem!" for an instant, random prompt.</div>
            </div>
             <div>
              <h4 className="font-semibold text-foreground mb-1">What if I don't like the poem?</h4>
              <div>Poetry is a process! Click "Regenerate Poem" for a new version, or go back and edit your description and settings for a different result.</div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">What customization options are available?</h4>
              <div className="space-y-1 mt-1">
                  <div>You can tailor your poem with a variety of options:</div>
                  <div className="text-sm"><strong>Languages:</strong> {LANGUAGES.join(', ')}.</div>
                  <div className="text-sm"><strong>Poetic Styles:</strong> {STYLES.join(', ')}.</div>
                  <div className="text-sm"><strong>Tones/Moods:</strong> {TONES.join(', ')}.</div>
                  <div className="text-sm"><strong>Poem Lengths:</strong> {LENGTHS.join(', ')}.</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="creative-spark">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-2">
            {creativeSparkTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-3 px-2 pb-2">
            <p>We believe poetry isn't just for poets—it's for everyone. It’s in the photo on your phone, a memory you cherish, or a simple idea.</p>
            <p>PhotoVerse is your creative partner. It’s here to help you find the words when you're stuck, explore new styles, and turn your unique perspective into a beautiful piece of art.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy" className="border-b-0">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-2">
            {privacyTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-3 px-2 pb-2">
             <ul className="list-none space-y-2">
              <li>
                <strong className="text-foreground">Do you save my images?</strong>
                <p className="pl-4">No. Your photo is sent to the AI for analysis and then immediately discarded. It is never stored on our servers.</p>
              </li>
              <li>
                <strong className="text-foreground">Do you save my poems?</strong>
                <p className="pl-4">No. Your descriptions and the poems they generate are processed in the moment and are not stored.</p>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
