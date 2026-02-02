'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, UserCheck, ShieldAlert } from 'lucide-react';

export function AiInsightsStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="animated-gradient-border relative rounded-lg bg-gradient-to-r from-teal-50/60 to-blue-100/60 p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold flex items-center gap-2 text-card-foreground">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            AI Anomalies
          </h3>
          <Badge variant="destructive">High Risk</Badge>
        </div>
        <div className="mt-2 flex-grow">
          <p className="text-sm text-muted-foreground">Unusual unpaid balances, high refund frequency, and repeated partial payments detected.</p>
        </div>
      </div>
      <div className="animated-gradient-border relative rounded-lg bg-gradient-to-r from-teal-50/60 to-blue-100/60 p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold flex items-center gap-2 text-card-foreground">
            <TrendingUp className="h-5 w-5 text-green-600" />
            AI Tip Insights
          </h3>
        </div>
        <div className="mt-2 flex-grow">
          <p className="text-sm text-muted-foreground">Tip presets can be optimized to increase earnings. Projected improvement: +8.5%.</p>
        </div>
      </div>
      <div className="animated-gradient-border relative rounded-lg bg-gradient-to-r from-teal-50/60 to-blue-100/60 p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold flex items-center gap-2 text-card-foreground">
            <UserCheck className="h-5 w-5 text-blue-600" />
            AI Waiter Score
          </h3>
          <span className="text-xl font-bold text-blue-600">8.2/10</span>
        </div>
        <div className="mt-2 flex-grow">
          <p className="text-sm text-muted-foreground">Top performer: Alex. Needs coaching: David. Based on speed, tips, and balance closure.</p>
        </div>
      </div>
    </div>
  );
}
