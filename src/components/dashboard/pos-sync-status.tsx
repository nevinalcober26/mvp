'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

export function PosSyncStatus() {
  const [hasError, setHasError] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('just now');

  // Update the 'time ago' string every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(lastSync, { addSuffix: true }));
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval);
  }, [lastSync]);

  const handleRetry = () => {
    setHasError(false);
    const newSyncTime = new Date();
    setLastSync(newSyncTime);
    setTimeAgo('just now');
  };

  const simulateError = () => {
    setHasError(true);
  };
  
  if (hasError) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/50 p-2 text-sm text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div className="flex-grow">
                <p className="font-semibold">Sync Failed</p>
                <p className="text-xs">Could not connect to POS server.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleRetry}>Retry</Button>
        </div>
    );
  }

  return (
    <div 
        className="flex items-center gap-2 rounded-lg bg-secondary p-2.5 text-sm text-muted-foreground cursor-pointer"
        onClick={simulateError}
        title="Click to simulate a sync error"
    >
        <RefreshCw
            className="h-4 w-4 text-green-500 animate-spin"
            style={{ animationDuration: '2s' }}
        />
        <div>
            <span className="font-medium text-foreground">POS Synced</span>
            <span className="ml-2">Last sync: {timeAgo}</span>
        </div>
    </div>
  );
}
