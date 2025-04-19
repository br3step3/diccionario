'use server';
/**
 * @fileOverview Generates a definition for a given Spanish word using AI.
 *
 * - generateDefinition - A function that generates a definition for a given Spanish word.
 * - GenerateDefinitionInput - The input type for the generateDefinition function.
 * - GenerateDefinitionOutput - The return type for the generateDefinition function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateDefinitionInputSchema = z.object({
  spanishWord: z.string().describe('The Spanish word to generate a definition for.'),
});
export type GenerateDefinitionInput = z.infer<typeof GenerateDefinitionInputSchema>;

const GenerateDefinitionOutputSchema = z.object({
  definition: z.string().describe('A definition of the Spanish word.'),
});
export type GenerateDefinitionOutput = z.infer<typeof GenerateDefinitionOutputSchema>;

export async function generateDefinition(
  input: GenerateDefinitionInput
): Promise<GenerateDefinitionOutput> {
  return generateDefinitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDefinitionPrompt',
  input: {
    schema: z.object({
      spanishWord: z.string().describe('The Spanish word to generate a definition for.'),
    }),
  },
  output: {
    schema: z.object({
      definition: z.string().describe('A definition of the Spanish word.'),
    }),
  },
  prompt: `You are a Spanish language expert. Provide a concise definition for the word: {{{spanishWord}}}.`,
});

const generateDefinitionFlow = ai.defineFlow<
  typeof GenerateDefinitionInputSchema,
  typeof GenerateDefinitionOutputSchema
>(
  {
    name: 'generateDefinitionFlow',
    inputSchema: GenerateDefinitionInputSchema,
    outputSchema: GenerateDefinitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
