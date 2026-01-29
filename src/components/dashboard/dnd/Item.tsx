'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { UniqueIdentifier } from '@dnd-kit/core';

type ItemProps = {
  id: UniqueIdentifier;
  name: string;
  onClick?: () => void;
};

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ id, name, onClick }, ref) => {
  return (
    <Card
      ref={ref}
      className="p-3 flex items-center justify-between cursor-pointer bg-card"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        <div>
          <p className="font-medium text-sm">{name}</p>
        </div>
      </div>
    </Card>
  );
});

Item.displayName = "Item";
