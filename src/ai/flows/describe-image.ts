
// DescribeImage flow implementation
'use server';
/**
 * @fileOverview AI-powered image description flow.
 *
 * - describeImage - A function that generates a text description of an image.
 * - DescribeImageInput - The input type for the describeImage function.
 * - DescribeImageOutput - The return type for the describeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DescribeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DescribeImageInput = z.infer<typeof DescribeImageInputSchema>;

const DescribeImageOutputSchema = z.object({
  description: z.string().describe('A textual description of the image, rich in detail and evocative language suitable for inspiring a poem.'),
});
export type DescribeImageOutput = z.infer<typeof DescribeImageOutputSchema>;

export async function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'YOUR_GOOGLE_AI_API_KEY') {
    throw new Error('Google AI API key is not configured. Please add it to your .env file.');
  }
  return describeImageFlow(input);
}

const describeImagePrompt = ai.definePrompt({
  name: 'describeImagePrompt',
  input: {schema: DescribeImageInputSchema},
  output: {schema: DescribeImageOutputSchema},
  prompt: `You are an AI expert in understanding images, tasked with creating a vivid and evocative description that will serve as inspiration for a poem.

Focus on:
- Key objects and subjects: Identify them clearly.
- Scene and setting: Describe the environment, time of day, and location.
- Colors and lighting: Detail the prominent colors and how light influences the scene.
- Textures and patterns: Note any interesting textures or visual patterns.
- Atmosphere and mood: Capture the overall feeling or emotion the image conveys (e.g., serene, chaotic, joyful, mysterious).
- Sensory details: If possible, infer other sensory details that the image might suggest (e.g., the warmth of the sun, the sound of waves, a particular scent).

Your description should be detailed, engaging, and provide a strong foundation for poetic interpretation.

Image: {{media url=photoDataUri}}`,
});

const describeImageFlow = ai.defineFlow(
  {
    name: 'describeImageFlow',
    inputSchema: DescribeImageInputSchema,
    outputSchema: DescribeImageOutputSchema,
  },
  async input => {
    const {output} = await describeImagePrompt(input);
    return output!;
  }
);
