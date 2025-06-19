// src/ai/flows/generate-poem.ts
'use server';
/**
 * @fileOverview Generates a poem based on an image description, language, style, and tone.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  imageDescription: z.string().describe('A description of the image.'),
  language: z.enum(['English', 'Hindi', 'Hinglish']).describe('The language of the poem.'),
  style: z.string().describe('The style of the poem (e.g., Haiku, Free Verse, Romantic).'),
  tone: z.string().describe('The tone/mood of the poem (e.g., Joyful, Calm, Melancholic).'),
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
  prompt: `You are a poet. Generate a poem based on the following image description, language, style, and tone.

Image Description: {{{imageDescription}}}
Language: {{{language}}}
Style: {{{style}}}
Tone: {{{tone}}}

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
