'use client';

import { cn } from '@/lib/utils';
import {
  Sparkles,
  BarChart,
  Wallet,
  RotateCw,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'ai-overview', label: 'AI Overview', icon: Sparkles },
  { id: 'waiter-sales', label: 'Waiter Sales', icon: BarChart },
  { id: 'tips', label: 'Tips', icon: Wallet },
  { id: 'turnover', label: 'Turnover', icon: RotateCw },
  { id: 'balances', label: 'Balances', icon: AlertCircle },
  { id: 'shift-summary', label: 'Shift Summary', icon: Clock },
  { id: 'leakage', label: 'Leakage', icon: ShieldAlert },
];

interface StaffPerformanceSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function StaffPerformanceSidebar({ activeSection, setActiveSection }: StaffPerformanceSidebarProps) {
  return (
    <div className="p-4 space-y-1">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => setActiveSection(item.id)}
          className={cn(
            'w-full justify-start relative text-sm',
            activeSection === item.id
              ? 'bg-primary/10 text-primary font-bold'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          {activeSection === item.id && (
            <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
          )}
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </div>
  );
}
