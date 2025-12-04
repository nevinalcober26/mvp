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
    name: 'Caesar Salad',
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
    <Card>
      <CardHeader>
        <CardTitle>Popular Items</CardTitle>
        <CardDescription>
          A list of the most popular items based on recent sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {popularItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-md object-cover h-16 w-16"
                data-ai-hint={item.imageHint}
              />
            )}
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.orders} orders
              </p>
            </div>
            <p className="font-semibold">${item.revenue.toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <Button variant="link" className="text-teal-600">
          <ArrowDown className="mr-2 h-4 w-4" />
          View All Items
        </Button>
      </CardFooter>
    </Card>
  );
}
