
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, ShieldCheck, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';

export function InfoAccordion() {
  const howItWorksTitle = (
    <div className="flex items-center">
      <Info className="mr-3 h-4 w-4 text-primary" />
      How PhotoVerse Works & Tips
    </div>
  );

  const privacyTitle = (
    <div className="flex items-center">
      <ShieldCheck className="mr-3 h-4 w-4 text-primary" />
      Your Data, Your Privacy
    </div>
  );

  const creativeSparkTitle = (
    <div className="flex items-center">
      <Sparkles className="mr-3 h-4 w-4 text-primary" />
      The Creative Spark: Why PhotoVerse?
    </div>
  );

  const faqTitle = (
    <div className="flex items-center">
      <HelpCircle className="mr-3 h-4 w-4 text-primary" />
      Frequently Asked Questions
    </div>
  );

  return (
    <section className="mt-8 w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="how-it-works">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-3">
            {howItWorksTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-4 px-2 pb-2">
            <p>Welcome! Here’s a simple guide to creating your first AI-powered poem.</p>
            <ol className="list-decimal list-inside space-y-3 pl-4">
              <li>
                <strong>Start with Inspiration</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                  <li><strong>Use an Image:</strong> Upload a photo or use your webcam. Our AI will generate a description for you.</li>
                  <li><strong>Use Your Words:</strong> Click "Write Description Manually" to start with any idea, scene, or feeling.</li>
                  <li><strong>Get a Surprise:</strong> Click "Surprise Me!" for a random creative prompt and settings to kickstart your poem.</li>
                </ul>
              </li>
              <li>
                <strong>Refine Your Subject</strong>
                <p className="pl-4 mt-1">This is the most important step! The description is what the AI uses to write the poem. Review the text, add more detail, emotion, and color. The better the description, the better the poem.</p>
              </li>
               <li>
                <strong>Customize Your Poem</strong>
                 <p className="pl-4 mt-1">Choose the <strong>Language, Style, Tone, and Length</strong> from the dropdowns. Use the optional fields to give the AI specific instructions.</p>
              </li>
              <li>
                <strong>Generate and Perfect</strong>
                <p className="pl-4 mt-1">Click "Generate Poem"! If you don't love the first result, hit <strong>Regenerate</strong> or go back to tweak your description. You can also edit the final poem directly in the text box to make it perfect.</p>
              </li>
            </ol>
             <div className="flex items-start mt-3 p-3 bg-accent/10 rounded-md">
              <Lightbulb className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground">Pro-Tips for Great Poems</h4>
                <ul className="list-disc list-inside space-y-2 mt-1">
                  <li><strong>Be Specific:</strong> Instead of "a tree," try "a lonely oak tree on a misty hill at dawn."</li>
                  <li><strong>Add Emotion:</strong> Mention feelings in your description, like "a joyful, sunny beach" or "a melancholic, rainy street."</li>
                  <li><strong>Iterate!</strong> The best results often come after trying a few different descriptions or settings.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-3">
            {faqTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-4 px-2 pb-2">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Do I need an image to create a poem?</h4>
              <div>Not at all! Choose "Write Description Manually" to start with any idea, or click "Surprise Me with a Poem!" for an instant, random prompt.</div>
            </div>
             <div>
              <h4 className="font-semibold text-foreground mb-1">What if I don't like the generated poem?</h4>
              <div>Poetry is a process! Click "Regenerate Poem" for a new version, or go back to edit your description and settings for a different result. The best poems often come after a few tries.</div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Can I edit the poem after it's generated?</h4>
              <div>Absolutely. The final poem appears in an editable text box. Feel free to tweak it to perfection before you copy or download it.</div>
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
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-3">
            {creativeSparkTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-3 px-2 pb-2">
            <p>We believe poetry isn't just for poets—it's for everyone. It's in the photo on your phone, a memory you cherish, or a simple idea that pops into your head.</p>
            <p>PhotoVerse is your creative partner. It’s here to help you find the words when you're stuck, explore new styles, and turn your unique perspective into a beautiful piece of art. It’s a tool to help unlock the poetry that's already inside you.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy" className="border-b-0">
          <AccordionTrigger className="text-lg font-headline hover:no-underline focus:no-underline py-3">
            {privacyTitle}
          </AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground space-y-3 px-2 pb-2">
            <p>Your creations are yours. We designed PhotoVerse with your privacy as a top priority. Here's our simple promise to you:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>We do not save your images.</strong> Your photo is sent to the AI for analysis and then immediately discarded. It is never stored on our servers.</li>
              <li><strong>We do not save your poems.</strong> Your descriptions and the poems they generate are processed in the moment and are not stored.</li>
              <li><strong>Your session is private.</strong> All data is handled securely during your creative session. Once you leave, it's gone.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
