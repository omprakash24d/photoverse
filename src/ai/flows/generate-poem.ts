
// src/ai/flows/generate-poem.ts
'use server';
/**
 * @fileOverview Generates a poem based on an image description, language, style, tone, length, and custom instructions.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PoemLength } from '@/lib/types'; // Import PoemLength type

const GeneratePoemInputSchema = z.object({
  imageDescription: z.string().describe('A description of the image or the subject of the poem.'),
  language: z.enum(['English', 'Hindi', 'Hinglish']).describe('The language of the poem.'),
  style: z.string().describe('The style of the poem (e.g., Haiku, Free Verse, Romantic).'),
  tone: z.string().describe('The tone/mood of the poem (e.g., Joyful, Calm, Melancholic).'),
  poemLength: z.enum(['Short', 'Medium', 'Long'] as [PoemLength, ...PoemLength[]]).describe('The desired length of the poem (Short, Medium, Long).'),
  customInstruction: z.string().optional().describe('Optional custom instruction for the poem generation (e.g., focus on a specific theme, include a certain word).'),
});

export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});

export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const generatePoemPrompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: GeneratePoemInputSchema},
  output: {schema: GeneratePoemOutputSchema},
  prompt: `You are an acclaimed poet, a master of words and emotion, renowned for your ability to craft verses that are both evocative and deeply moving. Your task is to generate a unique and high-quality poem.

Let the provided image description or subject be your primary inspiration. Immerse yourself in its details, seeking to capture its essence, mood, and most striking elements. Weave these into your poetic lines using vivid imagery, rich sensory details, and compelling metaphors or similes.

Adhere to the following creative parameters:

Language: Craft your poem beautifully in {{{language}}}. If Hinglish is selected, blend Hindi and English naturally, ensuring it sounds authentic and expressive.

Poetic Style: The poem should embody the {{{style}}} style.
- For Haiku: Strictly follow the 5-7-5 syllable structure per line.
- For Sonnet: Aim for 14 lines with a recognizable rhyme scheme (e.g., Shakespearean or Petrarchan).
- For Free Verse: Embrace rhythmic freedom and expressive line breaks, focusing on the flow of ideas and emotions.
- For other styles like {{{style}}}: Capture the characteristic structure, meter (if applicable), and thematic focus associated with it.

Tone/Mood: Infuse the poem with a palpable {{{tone}}} tone. Let this feeling guide your vocabulary, rhythm, and overall atmosphere.

Desired Length: The poem should be of {{{poemLength}}} length.
- Short: Aim for conciseness and impact (e.g., 3-5 stanzas or 10-20 lines, style permitting).
- Medium: Explore themes with more depth (e.g., 5-8 stanzas or 20-40 lines, style permitting).
- Long: Develop narratives or elaborate imagery (e.g., 8+ stanzas or 40+ lines, style permitting).

{{#if customInstruction}}
Special Instruction: Pay close attention to this custom instruction and integrate it thoughtfully into your creation: "{{{customInstruction}}}"
{{/if}}

Strive for originality, emotional depth, and lyrical beauty. Avoid clichés. Ensure the poem connects meaningfully with the provided description.

Now, present your poem:
Poem:`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const {output} = await generatePoemPrompt(input);
    return output!;
  }
);
