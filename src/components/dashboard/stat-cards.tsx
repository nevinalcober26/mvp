'use client';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
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
    <Card className="relative overflow-hidden shadow-sm h-full">
      <div className={cn("absolute right-0 top-0 bottom-0 w-1.5 rounded-r-lg", `bg-${color}-400`)} />
      <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
        <div className="flex justify-between items-start gap-2">
            <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
            <div className={cn("p-1.5 rounded-md flex-shrink-0", `bg-${color}-100`)}>
                <Icon className={cn("h-4 w-4", `text-${color}-600`)}/>
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold truncate">{value}</p>
            {(change || changeDescription) && (
                 <div className="text-xs text-muted-foreground mt-0.5 flex items-center">
                 {change ? (
                   <>
                     {change.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1 text-green-500" /> : <TrendingDown className="h-4 w-4 mr-1 text-red-500" />}
                     <span className={cn("font-semibold", change.startsWith('+') ? 'text-green-500' : 'text-red-500')}>{change}</span>
                     {changeDescription && <span className="ml-1 truncate">{changeDescription}</span>}
                   </>
                 ) : (
                   changeDescription && <span className="truncate">{changeDescription}</span>
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
    <div className="flex flex-col md:flex-row gap-4">
      {cards.map((card) => (
        <div key={card.title} className="flex-1 md:min-w-0">
             <StatCard {...card} />
        </div>
      ))}
    </div>
  );
}
