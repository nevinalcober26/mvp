'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';

export function AiInsightsStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            AI Anomalies
          </CardTitle>
          <Badge variant="destructive">High Risk</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Unusual unpaid balances, high refund frequency, and repeated partial payments detected.</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            AI Tip Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Tip presets can be optimized to increase earnings. Projected improvement: +8.5%.</p>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            AI Waiter Score
          </CardTitle>
          <span className="text-xl font-bold text-blue-600">8.2/10</span>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Top performer: Alex. Needs coaching: David. Based on speed, tips, and balance closure.</p>
        </CardContent>
      </Card>
    </div>
  );
}
