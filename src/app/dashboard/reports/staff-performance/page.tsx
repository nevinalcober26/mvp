'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Download } from 'lucide-react';
import { DateRangePicker } from '@/components/dashboard/reports/date-range-picker';
import { type DateRange } from 'react-day-picker';
import { subDays, isWithinInterval, endOfDay } from 'date-fns';
import { mockOrders, mockBranches } from '@/lib/mock-data-store';
import type { Order } from '@/app/dashboard/orders/types';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type StaffPerformanceData = {
  staffName: string;
  totalSales: number;
  totalOrders: number;
  totalTips: number;
  avgTipPercentage: number;
};

const avatarColors = [
  'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600', 'bg-orange-100 text-orange-600',
  'bg-teal-100 text-teal-600', 'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600'
];

const getAvatarColorClass = (name: string) => {
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[charCodeSum % avatarColors.length];
};

const chartConfig = {
  totalSales: { label: 'Total Sales', color: 'hsl(var(--chart-1))' },
  totalTips: { label: 'Total Tips', color: 'hsl(var(--chart-2))' },
};

export default function StaffPerformancePage() {
  const [filters, setFilters] = useState({
    dateRange: { from: subDays(new Date(), 29), to: new Date() } as DateRange | undefined,
    branch: 'all',
  });
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    setAllOrders(mockOrders);
  }, []);

  const handleFilterChange = (filterName: string, value: string | DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const staffPerformanceData = useMemo(() => {
    const filteredOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.orderTimestamp);
      const matchesDate = filters.dateRange?.from && filters.dateRange?.to
          ? isWithinInterval(orderDate, { start: filters.dateRange.from, end: endOfDay(filters.dateRange.to) })
          : true;
      const matchesBranch = filters.branch === 'all' || order.branch === filters.branch;
      return matchesDate && matchesBranch;
    });

    const staffData: { [key: string]: StaffPerformanceData } = {};

    filteredOrders.forEach((order) => {
      const { staffName, totalAmount, payments } = order;
      if (!staffData[staffName]) {
        staffData[staffName] = { staffName, totalSales: 0, totalOrders: 0, totalTips: 0, avgTipPercentage: 0 };
      }
      staffData[staffName].totalSales += totalAmount;
      staffData[staffName].totalOrders += 1;
      const orderTips = payments.reduce((acc, p) => acc + (p.tip || 0), 0);
      staffData[staffName].totalTips += orderTips;
    });

    return Object.values(staffData).map(staff => {
      staff.avgTipPercentage = staff.totalSales > 0 ? (staff.totalTips / staff.totalSales) * 100 : 0;
      return staff;
    }).sort((a, b) => b.totalSales - a.totalSales);
  }, [allOrders, filters]);

  const topPerformers = useMemo(() => staffPerformanceData.slice(0, 5), [staffPerformanceData]);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Performance</h1>
            <p className="text-muted-foreground">Analyze sales, orders, and tips by staff member.</p>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Filters</CardTitle>
              <div className="flex flex-wrap items-center gap-4">
                <DateRangePicker
                  dateRange={filters.dateRange}
                  onDateRangeChange={(range) => handleFilterChange('dateRange', range)}
                />
                <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Branch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {mockBranches.map(b => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Top Staff by Sales</CardTitle>
                <CardDescription>A visual breakdown of top-performing staff members by total sales and tips.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart data={topPerformers} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                        <XAxis dataKey="staffName" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <ChartTooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar yAxisId="left" dataKey="totalSales" fill="var(--color-totalSales)" radius={[4, 4, 0, 0]} name="Total Sales" />
                        <Bar yAxisId="right" dataKey="totalTips" fill="var(--color-totalTips)" radius={[4, 4, 0, 0]} name="Total Tips" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Staff Report</CardTitle>
            <CardDescription>Comprehensive performance metrics for each staff member.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">Total Tips</TableHead>
                  <TableHead className="text-right">Avg. Tip %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffPerformanceData.map((staff) => (
                  <TableRow key={staff.staffName}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className={cn("font-bold", getAvatarColorClass(staff.staffName))}>
                            {staff.staffName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{staff.staffName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">AED {staff.totalSales.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{staff.totalOrders}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">AED {staff.totalTips.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">{staff.avgTipPercentage.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {staffPerformanceData.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No data available for the selected filters.
                </p>
              )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
