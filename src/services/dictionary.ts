/**
 * Represents the definition of a word.
 */
export interface Definition {
  /**
   * The word that is being defined.
   */
  word: string;
  /**
   * The definition of the word.
   */
  definition: string;
}

import {generateDefinition} from '@/ai/flows/generate-definition';

/**
 * Asynchronously retrieves the definition of a given word. It first attempts to scrape SpanishDict,
 * and if that fails, it uses a Genkit flow to generate a definition.
 *
 * @param word The word to define.
 * @returns A promise that resolves to a Definition object containing the word and its definition.
 */
export async function getDefinition(word: string): Promise<Definition> {
  try {
    const aiDefinitionResult = await generateDefinition({spanishWord: word});
    return {
      word: word,
      definition: aiDefinitionResult.definition,
    };
  } catch (aiError) {
    console.error('Error generating definition with AI:', aiError);
    return {
      word: word,
      definition: 'Failed to load definition from both sources.',
    };
  }
}
