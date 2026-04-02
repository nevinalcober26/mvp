
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isCustomisable?: boolean;
  options?: {
    title: string;
    required: boolean;
    items: string[];
  };
  category: string;
};

export const MenuItemCard = ({
  item,
  onAdd,
  quantity,
  onIncrement,
  onDecrement,
  isPurchasingEnabled
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  quantity: number;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  isPurchasingEnabled: boolean;
}) => {

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(item);
  };

  const handleIncrementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIncrement(item.id);
  };

  const handleDecrementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecrement(item.id);
  };

  return (
    <div className="flex items-start p-3 bg-white rounded-2xl shadow-sm border border-gray-100/80" onClick={() => isPurchasingEnabled && onAdd(item)}>
      <div className="flex-1 pr-3">
        <h3 className="font-bold text-gray-800 leading-snug">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center mt-3">
          <span className="font-bold text-gray-900 text-lg ml-1">AED {item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="relative w-28 h-28 flex-shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" data-ai-hint={item.name.toLowerCase()} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
        <div className="absolute bottom-2 right-2 left-2 flex flex-col items-center">
            {isPurchasingEnabled ? (
              quantity > 0 ? (
                <div className="flex items-center justify-between w-full h-9 rounded-lg bg-white font-bold text-sm shadow-md px-1">
                  <Button size="icon" variant="ghost" className="h-full w-8 rounded-l-lg text-red-500" onClick={handleDecrementClick}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-lg text-gray-800">{quantity}</span>
                  <Button size="icon" variant="ghost" className="h-full w-8 rounded-r-lg text-teal-500" onClick={handleIncrementClick}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                      className="w-full h-9 rounded-lg bg-teal-500 text-white font-bold text-sm shadow-md hover:bg-teal-600"
                      onClick={handleAddClick}
                  >
                      Add
                  </Button>
                  {item.isCustomisable && (
                      <p className="text-center text-white text-[10px] font-semibold mt-1">Customisable</p>
                  )}
                </>
              )
            ) : (
              <Button
                  className="w-full h-9 rounded-lg bg-gray-400 text-white font-bold text-sm cursor-not-allowed"
                  disabled
              >
                  <Lock className="h-4 w-4 mr-1.5" />
                  Ordering Disabled
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};
