'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/header';

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
  { id: 'T13', status: 'Vacant' },
  { id: 'T14', status: 'Occupied - Unpaid' },
  { id: 'T15', status: 'Vacant' },
  { id: 'T16', status: 'Occupied - Partially Paid' },
  { id: 'T17', status: 'Occupied - Fully Paid' },
  { id: 'T18', status: 'Vacant' },
  { id: 'T19', status: 'Occupied - Unpaid' },
  { id: 'T20', status: 'Vacant' },
  { id: 'T21', status: 'Occupied - Fully Paid' },
  { id: 'T22', status: 'Vacant' },
  { id: 'T23', status: 'Occupied - Unpaid' },
  { id: 'T24', status: 'Vacant' },
];

const getStatusColor = (status: string) => {
  if (status.startsWith('Occupied')) {
    if (status.includes('Unpaid')) return 'border-red-500 bg-red-50/80';
    if (status.includes('Partially Paid'))
      return 'border-yellow-500 bg-yellow-50/80';
    if (status.includes('Fully Paid')) return 'border-blue-500 bg-blue-50/80';
    return 'border-gray-500 bg-gray-50/80';
  }
  if (status === 'Vacant') return 'border-green-500 bg-green-50/80';
  return 'border-gray-300 bg-gray-50';
};

const getStatusTextColor = (status: string) => {
  if (status.startsWith('Occupied')) {
    if (status.includes('Unpaid')) return 'text-red-700';
    if (status.includes('Partially Paid')) return 'text-yellow-700';
    if (status.includes('Fully Paid')) return 'text-blue-700';
    return 'text-gray-700';
  }
  if (status === 'Vacant') return 'text-green-700';
  return 'text-gray-700';
};

const filterOptions = [
  { name: 'All', color: 'bg-gray-500' },
  { name: 'Vacant', color: 'bg-green-500' },
  { name: 'Occupied', color: 'bg-orange-500' },
  { name: 'Unpaid', status: 'Occupied - Unpaid', color: 'bg-red-500' },
  {
    name: 'Partial',
    status: 'Occupied - Partially Paid',
    color: 'bg-yellow-500',
  },
  { name: 'Paid', status: 'Occupied - Fully Paid', color: 'bg-blue-500' },
];

export default function TablesPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Occupied') return table.status !== 'Vacant';
      const filterOption = filterOptions.find((f) => f.name === activeFilter);
      if (filterOption && filterOption.status) {
        return table.status === filterOption.status;
      }
      return table.status === activeFilter;
    });
  }, [activeFilter]);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl font-semibold">Table States</h1>
          <div className="flex items-center flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => setActiveFilter(option.name)}
                className={cn(
                  'flex items-center gap-2 text-sm py-1.5 px-3 rounded-full transition-colors border',
                  activeFilter === option.name
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted/50 border-transparent'
                )}
              >
                <div
                  className={cn('h-2.5 w-2.5 rounded-full', option.color)}
                ></div>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
          {filteredTables.map((table) => (
            <Card
              key={table.id}
              className={cn(
                'cursor-pointer hover:shadow-lg transition-shadow border-2',
                getStatusColor(table.status)
              )}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center h-28">
                <CardTitle className="text-2xl font-bold">
                  {table.id}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-2 text-center text-xs whitespace-normal',
                    getStatusColor(table.status),
                    getStatusTextColor(table.status),
                    'border-current'
                  )}
                >
                  {table.status.replace('Occupied - ', '')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}