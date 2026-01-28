'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tables = [
  { id: 'T1', status: 'Vacant' },
  { id: 'T2', status: 'Occupied - Unpaid' },
  { id: 'T3', status: 'Vacant' },
  { id: 'T4', status: 'Occupied - Partially Paid' },
  { id: 'T5', status: 'Occupied - Fully Paid' },
  { id: 'T6', status: 'Vacant' },
  { id: 'T7', status: 'Occupied - Unpaid' },
  { id: 'T8', status: 'Vacant' },
  { id: 'T9', status: 'Vacant' },
  { id: 'T10', status: 'Occupied - Partially Paid' },
  { id: 'T11', status: 'Vacant' },
  { id: 'T12', status: 'Occupied - Unpaid' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Vacant':
      return 'border-green-500 bg-green-50';
    case 'Occupied - Unpaid':
      return 'border-red-500 bg-red-50';
    case 'Occupied - Partially Paid':
      return 'border-yellow-500 bg-yellow-50';
    case 'Occupied - Fully Paid':
      return 'border-blue-500 bg-blue-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
};

const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Vacant':
        return 'text-green-700';
      case 'Occupied - Unpaid':
        return 'text-red-700';
      case 'Occupied - Partially Paid':
        return 'text-yellow-700';
      case 'Occupied - Fully Paid':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
}


export default function TablesPage() {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 lg:px-8 justify-between">
        <h1 className="text-xl font-semibold">Table States</h1>
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-green-500"></div>Vacant</span>
            <span className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-red-500"></div>Unpaid</span>
            <span className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-yellow-500"></div>Partial</span>
            <span className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-blue-500"></div>Paid</span>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {tables.map((table) => (
            <Card
              key={table.id}
              className={cn(
                'cursor-pointer hover:shadow-lg transition-shadow border-2',
                getStatusColor(table.status)
              )}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <CardTitle className="text-3xl font-bold">{table.id}</CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-2',
                     getStatusColor(table.status),
                     getStatusTextColor(table.status),
                     "border-current"
                  )}
                >
                  {table.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
