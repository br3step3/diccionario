'use client';

import React, {useState, useEffect, useRef} from 'react';
import { RawResponseDialog } from '@/components/ui/raw-response-dialog';
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
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [correctedWord, setCorrectedWord] = useState<string | null>(null);
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
      setExampleSentences(definitionResult.examples);
      setRawResponse(definitionResult.rawResponse || 'No raw response available');
      setCorrectedWord(definitionResult.correctedWord || spanishWord);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDefinition('No se pudo cargar la definición.');
      setExampleSentences(['No se pudieron cargar las oraciones de ejemplo.']);
      setCorrectedWord(spanishWord);
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
            placeholder="Introduce una palabra"
            value={spanishWord}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            className="flex-1 text-2xl text-gray-600"
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

        <div className="mb-4 text-center bg-teal-50 p-4 rounded-lg border border-teal-200">
          {definition || exampleSentences ? (
            <>
              <p className="text-4xl font-bold text-teal-800">{correctedWord}</p>
              {correctedWord && correctedWord !== spanishWord && (
                <p className="text-sm text-teal-600 mt-2">¿Querías decir?</p>
              )}
            </>
          ) : (
            <p className="text-lg text-teal-600">Definiciones sencillas de palabras</p>
          )}
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


