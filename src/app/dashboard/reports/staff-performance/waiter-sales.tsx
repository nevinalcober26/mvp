'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Info } from "lucide-react";
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const salesData = [
  { waiter: 'Alex', tables: 12, orders: 15, gross: 450.75, collected: 450.75, outstanding: 0, avgBill: 30.05, splitPercent: 10 },
  { waiter: 'Maria', tables: 10, orders: 12, gross: 380.20, collected: 380.20, outstanding: 0, avgBill: 31.68, splitPercent: 25 },
  { waiter: 'John', tables: 14, orders: 18, gross: 512.50, collected: 490.00, outstanding: 22.50, avgBill: 28.47, splitPercent: 40 },
  { waiter: 'Sarah', tables: 11, orders: 13, gross: 410.00, collected: 410.00, outstanding: 0, avgBill: 31.54, splitPercent: 15 },
  { waiter: 'David', tables: 9, orders: 10, gross: 290.80, collected: 250.00, outstanding: 40.80, avgBill: 29.08, splitPercent: 50 },
];

export function WaiterSales() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Waiter Sales Performance</CardTitle>
                        <CardDescription>Review sales metrics for each waiter.</CardDescription>
                    </div>
                     <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                </div>
                 <div className="flex items-center space-x-2 pt-4">
                    <Input placeholder="Search waiter..." className="max-w-xs" />
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waiter</TableHead>
                                <TableHead>Tables</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Gross Sales <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>The total value of all orders served by the waiter.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Collected <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>The total amount of money collected from the waiter's sales.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Outstanding <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>The total amount of unpaid balances from the waiter's sales.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Avg. Bill <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>The average value of each bill handled by the waiter.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">% Split Bills <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>The percentage of the waiter's bills that were split.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salesData.map((row) => (
                                <TableRow key={row.waiter} className="cursor-pointer">
                                    <TableCell className="font-medium">{row.waiter}</TableCell>
                                    <TableCell>{row.tables}</TableCell>
                                    <TableCell>{row.orders}</TableCell>
                                    <TableCell>${row.gross.toFixed(2)}</TableCell>
                                    <TableCell>${row.collected.toFixed(2)}</TableCell>
                                    <TableCell className={row.outstanding > 0 ? "text-destructive" : ""}>${row.outstanding.toFixed(2)}</TableCell>
                                    <TableCell>${row.avgBill.toFixed(2)}</TableCell>
                                    <TableCell>{row.splitPercent}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
