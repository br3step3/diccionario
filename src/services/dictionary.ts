/**
 * Represents the definition of a word.
 */
export interface Definition {
  /**
   * The original word that was queried.
   */
  originalWord: string;
  /**
   * The corrected word if needed, or the original word if no correction was necessary.
   */
  correctedWord: string;
  /**
   * The definition of the word.
   */
  definition: string;
  /**
   * Example sentences using the word.
   */
  examples: string[];
}

import {generateDefinition} from '@/ai/flows/generate-definition';

/**
 * Asynchronously retrieves the definition, correction, and examples for a given word using AI.
 *
 * @param word The word to define.
 * @returns A promise that resolves to a Definition object containing the word details.
 */
export async function getDefinition(word: string): Promise<Definition> {
  try {
    const aiDefinitionResult = await generateDefinition({spanishWord: word});
    return {
      originalWord: word,
      correctedWord: aiDefinitionResult.correctedWord,
      definition: aiDefinitionResult.definition,
      examples: aiDefinitionResult.examples,
    };
  } catch (aiError) {
    console.error('Error generating definition with AI:', aiError);
    return {
      originalWord: word,
      correctedWord: word,
      definition: 'Failed to generate definition.',
      examples: [],
    };
  }
}
