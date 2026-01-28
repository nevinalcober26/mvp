import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatCardData = {
  title: string;
  value: string;
  change?: string;
  changeDescription?: string;
  icon: React.ElementType;
  color: string;
};

function StatCard({ title, value, change, changeDescription, icon: Icon, color }: StatCardData) {
  return (
    <Card className={cn("relative overflow-hidden border-0 shadow-lg", `before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-${color}-400`)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={cn("p-2 rounded-lg", `bg-${color}-100`)}>
            <Icon className={cn("h-5 w-5", `text-${color}-600`)} />
          </div>
        </div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-2 flex items-center">
          {change && <TrendingUp className="h-4 w-4 mr-1 text-green-500" />}
          {change && <span className="text-green-500 font-semibold">{change}</span>}
          <span className="ml-1">{changeDescription}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCards({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
