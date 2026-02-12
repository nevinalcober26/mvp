'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';

const popularItemsData = [
  {
    id: 'classic-cheese-burger',
    name: 'Classic Cheese Burger',
    orders: 142,
    revenue: 1240,
  },
  {
    id: 'caesar-salad',
    name: 'Caesar',
    orders: 98,
    revenue: 890,
  },
  {
    id: 'red-velvet-cupcake',
    name: 'Red Velvet',
    orders: 76,
    revenue: 645,
  },
  {
    id: 'red-velvet-cupcake-2',
    name: 'Red Velvet',
    orders: 76,
    revenue: 645,
  },
];

export function PopularItems() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const popularItems = popularItemsData.map((item) => {
    const placeholder = PlaceHolderImages.find((p) => p.id === item.id);
    return { ...item, ...placeholder };
  });

  return (
    <Card className="border-0 shadow-smooth">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-[#142424]">Popular Items</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          A list of the most recent open and in-progress tickets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {popularItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={item.imageUrl || "https://picsum.photos/seed/placeholder/100/100"}
                alt={item.name}
                fill
                className="object-cover"
                data-ai-hint={item.imageHint || "food item"}
              />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="font-bold text-base text-[#142424] truncate">{item.name}</p>
              <p className="text-sm text-gray-400 font-medium">
                {item.orders} orders
              </p>
            </div>
            <p className="font-bold text-lg text-[#142424]">
              ${item.revenue.toLocaleString()}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center border-t border-dashed pt-4">
        <Button variant="link" className="text-[#18B4A6] hover:text-[#149d94] font-bold gap-2 no-underline">
          <ArrowDown className="h-4 w-4" />
          View All Items
        </Button>
      </CardFooter>
    </Card>
  );
}
