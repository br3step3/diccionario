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
  correctedWord: z.string().describe('The corrected Spanish word if needed, or the original word if no correction was necessary.'),
  definition: z.string().describe('A definition of the Spanish word.'),
  examples: z.array(z.string()).describe('Example sentences using the word.')
});
export type GenerateDefinitionOutput = z.infer<typeof GenerateDefinitionOutputSchema>;

export async function generateDefinition(
   input: GenerateDefinitionInput
): Promise<GenerateDefinitionOutput & { rawResponse?: string }> {
  const result = await generateDefinitionFlow(input);
  return {
    ...result,
    rawResponse: result.rawResponse
  };
}

const prompt = ai.definePrompt({
  name: 'generateDefinitionPrompt',
  input: {
    schema: z.object({
      spanishWord: z.string().describe('The Spanish word to generate a definition for.'),
    }),
  },
  output: {
    schema: GenerateDefinitionOutputSchema,
  },
  prompt: `You are a Spanish language expert. For the given word {{{spanishWord}}}, please:
1. First correct the word if needed (if it's already correct, return it as is)
2. Provide a short, clear definition
3. Generate 2-3 example sentences using the word

Respond in JSON format with correctedWord, definition, and examples fields.`,
});

const generateDefinitionFlow = ai.defineFlow<
  typeof GenerateDefinitionInputSchema,
  typeof GenerateDefinitionOutputSchema & { rawResponse?: string }
>(
  {
    name: 'generateDefinitionFlow',
    inputSchema: GenerateDefinitionInputSchema,
    outputSchema: GenerateDefinitionOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    return {
      ...response.output!,
      rawResponse: JSON.stringify(response, null, 2)
    };
  }
);
