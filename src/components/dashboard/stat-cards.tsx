'use client';
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
    <Card className="relative overflow-hidden shadow-sm">
      <div className={cn("absolute right-0 top-0 bottom-0 w-1.5 rounded-r-lg", `bg-${color}-400`)} />
      <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
        <div className="flex justify-between items-start">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className={cn("p-2 rounded-lg", `bg-${color}-100`)}>
                <Icon className={cn("h-5 w-5", `text-${color}-600`)}/>
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold">{value}</p>
            {(change || changeDescription) && (
                 <div className="text-xs text-muted-foreground mt-1 flex items-center">
                 {change ? (
                   <>
                     <TrendingUp className={cn("h-4 w-4 mr-1", change.startsWith('+') ? 'text-green-500' : 'text-red-500')} />
                     <span className={cn("font-semibold", change.startsWith('+') ? 'text-green-500' : 'text-red-500')}>{change}</span>
                     {changeDescription && <span className="ml-1">{changeDescription}</span>}
                   </>
                 ) : (
                   changeDescription && <span>{changeDescription}</span>
                 )}
               </div>
            )}
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
