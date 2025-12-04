import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const lowStockItems = [
  { name: 'Chicken Stock', remaining: '5kg', level: 'critical' },
  { name: 'Fresh Vegetables', remaining: 'Low stock warning', level: 'warning' },
];

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Inventory Alerts
        </CardTitle>
        <Button variant="ghost" size="sm">
          View Inventory
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between rounded-lg p-3 ${
              item.level === 'critical'
                ? 'bg-red-50'
                : 'bg-yellow-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full ${
                  item.level === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                }`}
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Only {item.remaining}
                </p>
              </div>
            </div>
            <Button
              variant="link"
              className={`font-semibold ${
                item.level === 'critical' ? 'text-red-600' : 'text-yellow-700'
              }`}
            >
              {item.level === 'critical' ? 'Reorder' : 'Review'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
