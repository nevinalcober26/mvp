'use client';

import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Heart,
  X,
  LayoutGrid,
  Code2,
  Headset,
  Megaphone,
  KanbanSquare,
  Diamond,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const suites = [
  {
    title: 'Product',
    icon: KanbanSquare,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description:
      'Manage all aspects of your sales cycle and customer data in one central place',
    features: ['feature1', 'feature2', 'feature3'],
    extra: '+3',
  },
  {
    title: 'Product 2',
    icon: Code2,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    description:
      'monday dev gives product development teams everything they need to plan, build and launch new products in one place',
    features: ['featureA', 'featureB', 'featureC'],
    extra: '+3',
  },
  {
    title: 'Service',
    icon: Headset,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    description:
      'Transform service operations with streamlined cross-departmental collaborators, connected projects, and AI automations.',
  },
  {
    title: 'campaigns',
    icon: Megaphone,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    description:
      'Create, automate, and optimize email campaigns that drive engagement and conversions',
  },
];

const FeatureIcons = () => (
    <div className="flex items-center gap-1">
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-yellow-100 text-yellow-700 text-xs font-bold">Y</div>
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-red-100 text-red-700 text-xs font-bold">E</div>
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-blue-100 text-blue-600 text-xs font-bold">B</div>
    </div>
);

const FeatureIcons2 = () => (
     <div className="flex items-center">
        <div className="h-5 w-5 rounded-full bg-blue-100 border-2 border-card"></div>
        <div className="h-5 w-5 rounded-full bg-green-100 border-2 border-card -ml-2"></div>
        <div className="h-5 w-5 rounded-full bg-purple-100 border-2 border-card -ml-2"></div>
    </div>
)


const SuiteCard = ({ suite }: { suite: (typeof suites)[0] }) => (
  <Card className="flex flex-col shadow-md hover:shadow-xl transition-shadow">
    <CardHeader>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-lg',
            suite.iconBg
          )}
        >
          <suite.icon className={cn('h-6 w-6', suite.iconColor)} />
        </div>
        <CardTitle className="text-lg font-bold capitalize">
          {suite.title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground text-sm">{suite.description}</p>
      {(suite.features || suite.extra) && (
        <div className="flex items-center gap-2 mt-4">
          {suite.title === 'Product' && <FeatureIcons />}
          {suite.title === 'Product 2' && <FeatureIcons2 />}
          {suite.extra && (
            <span className="text-sm text-muted-foreground">
              {suite.extra}
            </span>
          )}
        </div>
      )}
    </CardContent>
    <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Diamond className="h-4 w-4" />
        <span>14 day free trial</span>
      </div>
      <Button variant="outline">Explore product</Button>
    </CardFooter>
  </Card>
);

export function ProductStoreDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-6 w-6" />
            <h2 className="text-xl font-semibold">
              Product <span className="font-normal">store</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Heart className="h-4 w-4" /> Feedback
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </div>
        <div className="p-8 bg-muted/30">
          <h3 className="text-2xl font-semibold mb-6">
            Explore more eMenu Suites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suites.map((suite) => (
              <SuiteCard key={suite.title} suite={suite} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
