
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
  imageDescription: z.string().describe('A description of the image.'),
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
  prompt: `You are a poet. Generate a poem based on the following image description, language, style, tone, and desired length.
{{#if customInstruction}}
Follow this specific instruction: {{{customInstruction}}}
{{/if}}

Image Description: {{{imageDescription}}}
Language: {{{language}}}
Style: {{{style}}}
Tone: {{{tone}}}
Desired Length: {{{poemLength}}}

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
