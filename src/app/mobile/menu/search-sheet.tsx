'use client';

import { Sheet, SheetContent, SheetHeader, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = ['Pizza', 'Burger', 'Red Velvet', 'Sides', 'Drinks', 'Pasta'];

export function SearchSheet({ isOpen, onOpenChange }: SearchSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full h-full p-0 bg-white flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="Search menu items..."
              className="h-10 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              autoFocus
            />
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h3 className="font-bold text-gray-800">Popular Searches</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((term) => (
              <Button key={term} variant="outline" className="rounded-full bg-gray-100 border-gray-200 text-gray-700 font-semibold">
                {term}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
