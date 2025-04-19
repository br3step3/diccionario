'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {generateExampleSentences} from '@/ai/flows/generate-example-sentences';
import {generateDefinition} from '@/ai/flows/generate-definition';
import {Sparkles} from 'lucide-react';

export default function Home() {
  const [spanishWord, setSpanishWord] = useState('');
  const [definition, setDefinition] = useState<string | null>(null);
  const [exampleSentences, setExampleSentences] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear previous data when the Spanish word changes
    setDefinition(null);
    setExampleSentences(null);
  }, [spanishWord]);

  const handleDefineWord = async () => {
    setIsLoading(true);
    try {
      const definitionResult = await generateDefinition({spanishWord});
      setDefinition(definitionResult.definition);

      const exampleSentencesResult = await generateExampleSentences({spanishWord});
      setExampleSentences(exampleSentencesResult.exampleSentences);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDefinition('No se pudo cargar la definición.');
      setExampleSentences(['No se pudieron cargar las oraciones de ejemplo.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpanishWord(e.target.value);
  };

   const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleDefineWord();
    }
  };


  return (
    <>
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-white">
      <h1 className="text-4xl font-extrabold text-teal-800 mb-8 flex items-center">
        Español Esencial
        <Sparkles className="ml-2 h-6 w-6 animate-pulse text-yellow-500" />
      </h1>
      <div className="w-full max-w-md space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Introduce una palabra en español"
            value={spanishWord}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            className="flex-1 text-2xl"
            ref={inputRef}
          />
          <Button onClick={handleDefineWord} disabled={isLoading || !spanishWord}>
            {isLoading ? (
              'Definiendo...'
            ) : (
              'Definir'
            )}
          </Button>
        </div>

        {definition && (
          <Card className="bg-gray-100 shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Definición</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{definition}</p>
            </CardContent>
          </Card>
        )}

        {exampleSentences && (
          <Card className="bg-gray-100 shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Oraciones de Ejemplo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {exampleSentences.map((sentence, index) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
     </>
  );
}


