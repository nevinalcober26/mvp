import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart } from 'lucide-react';

export function PerformanceSummary() {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <BarChart className="h-5 w-5" />
          This Week Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-3xl font-bold">$12,450</p>
          <p className="text-xs text-green-400 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15.3%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Avg. Order Value</p>
          <p className="text-3xl font-bold">$28.50</p>
          <p className="text-xs text-green-400 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.7%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
