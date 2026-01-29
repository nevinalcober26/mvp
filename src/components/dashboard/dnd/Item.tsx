'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

type ItemProps = {
  id: UniqueIdentifier;
  name: string;
  onClick?: () => void;
  isOver?: boolean;
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ id, name, onClick, isOver }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
          "p-3 flex items-center justify-between cursor-pointer bg-card transition-all",
          isOver && "ring-2 ring-primary bg-primary/10"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="cursor-grab touch-none">
         <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
        </div>
      </div>
    </Card>
  );
});

Item.displayName = "Item";
