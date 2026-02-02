'use client';

import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, AlertTriangle, BarChart } from 'lucide-react';
import { Badge } from '../ui/badge';
import React from 'react';
import { cn } from '@/lib/utils';

const notificationsData = [
  {
    id: '1',
    icon: ShoppingCart,
    title: 'New Order #4321',
    description: 'Table T5, 4 items, $56.00',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    icon: Star,
    title: 'New 5-Star Review',
    description: '"The best pasta I have ever had!"',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    icon: AlertTriangle,
    title: 'Low Stock: Tomatoes',
    description: 'Only 5kg remaining in inventory.',
    time: '3h ago',
    read: true,
  },
  {
    id: '4',
    icon: BarChart,
    title: 'Daily Sales Summary',
    description: 'Total revenue: $2,450.00',
    time: 'Yesterday',
    read: true,
  },
];

export function NotificationMenu() {
  const [notifications, setNotifications] = React.useState(notificationsData);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenuContent align="end" className="w-80 md:w-96 p-0">
      <div className="flex items-center justify-between p-3 border-b">
        <DropdownMenuLabel className="p-0 text-base font-semibold">
          Notifications
          {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} New</Badge>}
        </DropdownMenuLabel>
        {unreadCount > 0 && <Button variant="link" size="sm" className="text-primary h-auto p-0" onClick={markAllAsRead}>Mark all as read</Button>}
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
            notifications.map((notification) => (
                <div key={notification.id} className="border-b last:border-b-0">
                    <div className="flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors w-full">
                        <div className={cn('mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full', !notification.read ? 'bg-primary/10' : 'bg-muted')}>
                            <notification.icon className={cn('h-4 w-4', !notification.read ? 'text-primary' : 'text-muted-foreground')} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className={cn('text-sm', !notification.read && 'font-semibold text-foreground')}>{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                            <div title="Mark as read">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1" />
                            </div>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>No new notifications</p>
            </div>
        )}
      </div>

      <div className="p-2 border-t">
        <Button variant="ghost" className="w-full">
            View all notifications
        </Button>
      </div>
    </DropdownMenuContent>
  );
}
