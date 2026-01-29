'use client';

import { Lightbulb } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { summarizeData } from '@/ai/flows/summarize-data-flow';

interface AiSummaryProps {
  data: any[];
  context: string;
}

export function AiSummary({ data, context }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(true);
      const dataString = JSON.stringify(data.slice(0, 20)); // Limit data for performance
      
      // Simulate thinking time for a better UX
      const timer = setTimeout(() => {
          summarizeData({ data: dataString, context })
            .then((result) => {
              setSummary(result.summary);
            })
            .catch((error) => {
              console.error('AI Summary Error:', error);
              setSummary(`Could not generate summary for ${context}.`);
            })
            .finally(() => {
              setIsLoading(false);
            });
      }, 1000); // Minimum 1 second "thinking" time

      return () => clearTimeout(timer);

    } else {
        setIsLoading(false);
        setSummary(`Not enough data to generate a summary for ${context}.`);
    }
  }, [data, context]);

  const renderSummaryWithBold = (text: string) => {
    if (!text) return null;
    // Split by the bold delimiter, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      // If the part is wrapped in **, render it as a strong tag
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-blue-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Otherwise, render it as plain text
      return part;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-100 p-4 text-sm border border-blue-200/50 shadow-sm">
        <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
        <div className="flex-grow">
            <p className="font-semibold text-blue-900">AI is analyzing your data</p>
            <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-100 p-4 text-sm text-blue-900/90 border border-blue-200/50 shadow-sm">
      <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
      <p>
        <strong className="font-semibold text-blue-900">AI Summary:</strong>{' '}
        {renderSummaryWithBold(summary)}
      </p>
    </div>
  );
}
