'use client';

import { Wand, RefreshCw, X } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { summarizeData } from '@/ai/flows/summarize-data-flow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AiSummaryProps {
  data: any[];
  context: string;
}

export function AiSummary({ data, context }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(true);
  const isLoadingRef = useRef(false);
  const lastDataHashRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const generateSummary = useCallback((force = false) => {
    if (isLoadingRef.current) return;

    if (data.length > 0) {
      // Limit data items to prevent massive payloads and summarize significantly
      const dataSample = data.slice(0, 20);
      const dataString = JSON.stringify(dataSample);
      
      // Skip if data hasn't changed or isn't forced
      if (!force && dataString === lastDataHashRef.current) {
        return;
      }

      isLoadingRef.current = true;
      setStatus('loading');
      setSummary('');

      summarizeData({ data: dataString, context })
        .then((result) => {
          setSummary(result.summary);
          setStatus('success');
          lastDataHashRef.current = dataString;
        })
        .catch((err) => {
          console.error('AI Summary Component Error:', err);
          // Fallback message
          setSummary(`AI Insights are currently taking a breath. Found **${data.length} items** in **${context}**.`);
          setStatus('success');
        })
        .finally(() => {
          isLoadingRef.current = false;
        });
    } else {
      setStatus('idle');
      setSummary('');
    }
  }, [data, context]);

  // Implement debouncing to prevent hitting AI limits during rapid filtering/typing
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      generateSummary();
    }, 1500); // 1.5s delay after last change

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [generateSummary]);

  const handleRefresh = () => {
    generateSummary(true);
  };

  const renderSummaryWithBold = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!isVisible || (status === 'idle' && data.length === 0)) {
    return null;
  }

  return (
    <div className="animated-gradient-border relative rounded-lg bg-gradient-to-r from-teal-50/60 to-blue-100/60 p-6 shadow-sm">
      <div className="relative z-10 flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/50">
            <Wand className="h-6 w-6 text-teal-500" />
          </div>
        </div>
        <div className="flex-grow">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1">
            AI Operational Pulse
          </p>
          {status === 'loading' ? (
            <div className="flex items-center gap-2 text-sm text-gray-600 animate-pulse">
              <RefreshCw className="h-4 w-4 animate-spin text-teal-500" />
              <span>Analyzing latest metrics...</span>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">
              {renderSummaryWithBold(summary)}
            </p>
          )}
        </div>
        <div className="flex items-start gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/50 transition-colors"
            onClick={handleRefresh}
            disabled={status === 'loading'}
          >
            <RefreshCw className={cn("h-4 w-4 text-muted-foreground", status === 'loading' && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/50 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
