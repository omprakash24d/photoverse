
"use client";

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, ShieldCheck, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { LANGUAGES, STYLES, TONES, LENGTHS } from '@/lib/types';

export function InfoAccordion() {
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
                    <li><strong>Upload an Image:</strong> Choose a photo from your device or capture a new one using your webcam. The AI will "see" this image to generate an initial description.</li>
                    <li><strong>Or, Just Use Words:</strong> Don't have an image? No problem! Select "Write Description Manually" to type any scene, emotion, or idea for your poem's subject.</li>
                    <li><strong>Feeling Lucky? Try "Surprise Me!":</strong> For a spontaneous spark, click this. PhotoVerse will take you to the next step with a creative prompt and random settings to get you started quickly.</li>
                </ul>
              </li>
              <li><strong>Craft the Perfect Poem Subject:</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                    <li>This step is crucial, as the description is the primary input for the AI.</li>
                    <li>If you uploaded an image, the AI will generate a description for you. If you chose "Surprise Me," a creative prompt will be pre-filled.</li>
                    <li>You are encouraged to **review, edit, or completely replace** this text. The more evocative and detailed the description, the richer your poem will be!</li>
                </ul>
              </li>
              <li><strong>Customize Your Poem's Voice:</strong> Tailor the poem to your liking by selecting:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                    <li><strong>Language, Poetic Style, Tone/Mood, and Poem Length.</strong></li>
                    <li><strong>Custom Instruction (Optional):</strong> Add a specific note for the AI, like "make it rhyme" or "focus on nature."</li>
                    <li><strong>"Randomize Options" Button:</strong> Use this to shuffle the main settings for new creative combinations.</li>
                </ul>
              </li>
              <li><strong>Generate & Iterate:</strong> Once you're happy, click "Generate Poem." Our AI will craft a unique piece of poetry.
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                    <li><strong>Not quite right?</strong> Don't hesitate to use the "Regenerate Poem" button. You can also go back, tweak the description or settings, and try again.</li>
                    <li><strong>Edit the Result:</strong> You can directly edit the final poem in the text area before copying or downloading.</li>
                </ul>
              </li>
            </ol>
            <div className="flex items-start mt-3 p-3 bg-accent/10 rounded-md">
              <Lightbulb className="mr-3 h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground">Tips for Best Results:</h4>
                <ul className="list-disc list-inside space-y-2 mt-1">
                  <li><strong>Image Quality (if used):</strong> Use clear, well-lit images. The better the AI can "see" the image, the better the initial description.</li>
                  <li><strong>Detailed Descriptions are Key:</strong> Be specific! The more detail you provide (objects, colors, emotions, actions, a story), the more material the AI has for crafting a rich poem.
                    <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                      <li>If a poem is too abstract, try adding more concrete nouns and actions to your description.</li>
                      <li>If the poem misses the mark emotionally, ensure your description explicitly mentions the desired feelings or atmosphere.</li>
                    </ul>
                  </li>
                  <li><strong>Experiment with Settings:</strong> Don't be afraid to try different combinations. A "Romantic" style will interpret your description differently than a "Haiku."
                     <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                       <li>If a "Free Verse" poem feels too unstructured, try a "Sonnet" or another style with more defined rules.</li>
                       <li>If a "Short" poem feels incomplete, try "Medium" or "Long" for more development.</li>
                     </ul>
                  </li>
                   <li><strong>Master the Custom Instruction:</strong> Use this field for specific requests. Examples:
                     <ul className="list-circle list-inside pl-4 mt-1 space-y-1 text-sm">
                       <li>"Make it rhyme."</li>
                       <li>"Focus on the theme of hope."</li>
                       <li>"Include a metaphor about a flowing river."</li>
                     </ul>
                   </li>
                   <li><strong>Iterate, Iterate, Iterate:</strong> The first poem might not be perfect. Use the "Regenerate" button. Go back and tweak the description. Editing the AI's initial description is often the most powerful step.</li>
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
              <div>This button on the starting page is a shortcut to inspiration! It will pre-fill the poem customization form with a creative prompt and random settings for language, style, and tone. You can then review these settings, adjust them to your liking, or just hit "Generate Poem" for a fun surprise.</div>
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
                  <li>Experiment with different "Poem Options" (language, style, tone, length). Use the "Randomize Options" button on the customization page for random settings.</li>
                  <li>Use the "Custom Instruction" field to give the AI more specific guidance.</li>
                  <li>Once a poem is generated, you can directly edit it in the text area provided to perfect it.</li>
                </ul>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Are my images and poems stored?</h4>
              <div>Please refer to our "Your Data, Your Privacy" section for details. Generally, images are processed for description and then discarded from our active servers. Poems are generated based on your input and are not stored permanently. Your privacy is important to us.</div>
            </div>
             <div>
              <h4 className="font-semibold text-foreground mb-1">What languages, styles, and tones are available?</h4>
              <div className="space-y-1">
                  <div>PhotoVerse offers a variety of options to customize your poem. You can explore them in the dropdown menus, but here's a current list:</div>
                  <div className="text-sm"><strong>Languages:</strong> {LANGUAGES.join(', ')}.</div>
                  <div className="text-sm"><strong>Poetic Styles:</strong> {STYLES.join(', ')}.</div>
                  <div className="text-sm"><strong>Tones/Moods:</strong> {TONES.join(', ')}.</div>
                  <div className="text-sm"><strong>Poem Lengths:</strong> {LENGTHS.join(', ')}.</div>
              </div>
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
              <li><strong>Description & Poem Settings:</strong> The image description (whether AI-generated, from your image, or manually entered by you) and your chosen poem preferences are sent to another secure AI service to craft your unique poem. This information is also processed in memory for the duration of the generation and is <strong>not stored permanently</strong>.</li>
              <li><strong>"Surprise Me" Poem Generation:</strong> When you use the "Surprise Me with a Poem!" feature, no image is uploaded. A generic creative prompt and randomly selected poem settings are used for generation. This process adheres to the same data handling principles as other poem generations.</li>
              <li><strong>No Personal Data Collection:</strong> PhotoVerse does not request, collect, or store any personally identifiable information (PII) beyond the inputs you provide for poem generation. You are responsible for the content of the images you choose to upload and the text you provide; please be mindful and avoid uploading/entering sensitive personal information.</li>
              <li><strong>Secure Transmission:</strong> We use industry-standard HTTPS encryption for all data transmitted between your browser and our services. This ensures that your image data and text inputs are protected during transit.</li>
              <li><strong>No Third-Party Sharing (Beyond Essential AI Services):</strong> Your inputs are only shared with the specific AI models required for generating image descriptions and poems. We do not sell, rent, or share your data with any other third parties for advertising, marketing, or other purposes.</li>
              <li><strong>Ephemeral Creative Sessions:</strong> Think of your time on PhotoVerse as a creative session. Once you close your browser tab or use the "Start New" button, the specific data from that session (image, description, poem) is not retained by our application.</li>
            </ul>
            <div className="mt-2">Our goal is to provide a fun, creative tool while respecting your privacy. If you have any questions, please feel free to reach out.</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
