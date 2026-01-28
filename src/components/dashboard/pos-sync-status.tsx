'use client';

import { useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PosSyncStatus() {
  const [hasError, setHasError] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  // Function to simulate a sync error
  const toggleError = () => {
    setHasError(!hasError);
    if(hasError) {
        setLastSync(new Date());
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-sm text-muted-foreground" onClick={toggleError}>
            {hasError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
                <RefreshCw className="h-4 w-4 text-green-500 animate-spin" style={{ animationDuration: '2s' }} />
            )}
            <span>
              {hasError ? 'Sync Failed' : 'Synced'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {hasError ? (
            <div>
                <p>Last attempt failed.</p>
                <p className='font-bold'>Error: Connection timed out.</p>
            </div>
          ) : (
            <div>
              <p>Last successful sync: {lastSync.toLocaleTimeString()}</p>
              <p>Click to simulate an error.</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
