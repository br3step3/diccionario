'use server';
/**
 * @fileOverview Generates example sentences for a given Spanish word using AI.
 *
 * - generateExampleSentences - A function that generates example sentences for a given Spanish word.
 * - GenerateExampleSentencesInput - The input type for the generateExampleSentences function.
 * - GenerateExampleSentencesOutput - The return type for the generateExampleSentences function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateExampleSentencesInputSchema = z.object({
  spanishWord: z.string().describe('The Spanish word to generate example sentences for.'),
});
export type GenerateExampleSentencesInput = z.infer<typeof GenerateExampleSentencesInputSchema>;

const GenerateExampleSentencesOutputSchema = z.object({
  exampleSentences: z.array(
    z.string().describe('An example sentence using the Spanish word.')
  ).describe('A list of example sentences using the Spanish word.'),
});
export type GenerateExampleSentencesOutput = z.infer<typeof GenerateExampleSentencesOutputSchema>;

export async function generateExampleSentences(
  input: GenerateExampleSentencesInput
): Promise<GenerateExampleSentencesOutput> {
  return generateExampleSentencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExampleSentencesPrompt',
  input: {
    schema: z.object({
      spanishWord: z.string().describe('The Spanish word to generate example sentences for.'),
    }),
  },
  output: {
    schema: z.object({
      exampleSentences: z.array(
        z.string().describe('An example sentence using the Spanish word.')
      ).describe('A list of example sentences using the Spanish word.'),
    }),
  },
  prompt: `You are a Spanish language expert.  Generate 3 example sentences using the word {{{spanishWord}}}. Return the sentences as a JSON array of strings.`, 
});

const generateExampleSentencesFlow = ai.defineFlow<
  typeof GenerateExampleSentencesInputSchema,
  typeof GenerateExampleSentencesOutputSchema
>(
  {
    name: 'generateExampleSentencesFlow',
    inputSchema: GenerateExampleSentencesInputSchema,
    outputSchema: GenerateExampleSentencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
