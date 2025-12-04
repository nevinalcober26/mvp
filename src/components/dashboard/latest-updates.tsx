import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, FileEdit, Percent, Star, Package } from 'lucide-react';

const updates = [
  {
    icon: Package,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'New product added',
    description: 'Spicy Chicken Wings added to Appetizers',
    time: '2 hours ago',
  },
  {
    icon: FileEdit,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Menu updated',
    description: "Bloomsbury's menu prices adjusted",
    time: '5 hours ago',
  },
  {
    icon: Percent,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Promotion activated',
    description: 'Happy Hour 20% off campaign started',
    time: '1 day ago',
  },
  {
    icon: Star,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'New review received',
    description: '5-star rating from customer feedback',
    time: '2 days ago',
  },
];

export function LatestUpdates() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <History className="h-5 w-5 text-gray-500" />
          Latest Updates
        </CardTitle>
        <Button variant="ghost" size="sm">
          View All Updates
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {updates.map((update, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${update.iconBg}`}
            >
              <update.icon className={`h-5 w-5 ${update.iconColor}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{update.title}</p>
              <p className="text-sm text-gray-600">{update.description}</p>
              <p className="text-xs text-gray-400 mt-1">{update.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
