'use server';
/**
 * @fileOverview Diagnoses if the provided word is valid for the Spanish dictionary API.
 *
 * - diagnoseDictionaryApi - A function that checks if a given Spanish word is valid for the dictionary API.
 * - DiagnoseDictionaryApiInput - The input type for the diagnoseDictionaryApi function.
 * - DiagnoseDictionaryApiOutput - The return type for the diagnoseDictionaryApi function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const DiagnoseDictionaryApiInputSchema = z.object({
  word: z.string().describe('The Spanish word to check for validity in the dictionary API.'),
});
export type DiagnoseDictionaryApiInput = z.infer<typeof DiagnoseDictionaryApiInputSchema>;

const DiagnoseDictionaryApiOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the word is a valid Spanish word that the dictionary API would recognize.'),
  reason: z.string().optional().describe('If the word is not valid, the reason why.'),
});
export type DiagnoseDictionaryApiOutput = z.infer<typeof DiagnoseDictionaryApiOutputSchema>;

export async function diagnoseDictionaryApi(
  input: DiagnoseDictionaryApiInput
): Promise<DiagnoseDictionaryApiOutput> {
  return diagnoseDictionaryApiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseDictionaryApiPrompt',
  input: {
    schema: z.object({
      word: z.string().describe('The Spanish word to check for validity in the dictionary API.'),
    }),
  },
  output: {
    schema: z.object({
      isValid: z.boolean().describe('Whether the word is a valid Spanish word that the dictionary API would recognize.'),
      reason: z.string().optional().describe('If the word is not valid, the reason why.'),
    }),
  },
  prompt: `You are a language expert specializing in Spanish vocabulary.
  Your task is to determine whether the given word is a valid Spanish word that a dictionary API would recognize.
  Consider common misspellings, variations in accents, and whether the word is likely to be found in a standard Spanish dictionary.

  Word: {{{word}}}

  Determine if the word is a valid Spanish word. If not, provide a reason.`,
});

const diagnoseDictionaryApiFlow = ai.defineFlow<
  typeof DiagnoseDictionaryApiInputSchema,
  typeof DiagnoseDictionaryApiOutputSchema
>(
  {
    name: 'diagnoseDictionaryApiFlow',
    inputSchema: DiagnoseDictionaryApiInputSchema,
    outputSchema: DiagnoseDictionaryApiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


