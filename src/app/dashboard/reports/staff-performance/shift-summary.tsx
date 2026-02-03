'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from 'lucide-react';
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const shiftData = [
  { waiter: 'Alex', shift: "Morning", tables: 12, sales: 450.75, tips: 55.20, openBalances: 0, voids: 0, notes: "All tables closed." },
  { waiter: 'Maria', shift: "Morning", tables: 10, sales: 380.20, tips: 45.50, openBalances: 0, voids: 1, notes: "T5 disputed charge." },
  { waiter: 'John', shift: "Afternoon", tables: 14, sales: 512.50, tips: 50.10, openBalances: 22.50, voids: 0, notes: "T12 waiting for payment." },
];

export function ShiftSummary() {
    return (
        <Card>
            <CardHeader>
                 <CardTitle>Waiter Shift Summary</CardTitle>
                <div className="flex items-center space-x-2 pt-4">
                    <Select defaultValue="today">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Shifts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Shifts</SelectItem>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
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
                                <TableHead>Shift</TableHead>
                                <TableHead>Tables</TableHead>
                                <TableHead>Sales</TableHead>
                                <TableHead>Tips</TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Open Balances <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>Total amount of unpaid bills at the end of the shift.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>
                                    <UiTooltip>
                                        <UiTooltipTrigger className="flex items-center gap-1">Voids/Refunds <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                        <UiTooltipContent><p>Number of orders voided or refunded during the shift.</p></UiTooltipContent>
                                    </UiTooltip>
                                </TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shiftData.map((row) => (
                                <TableRow key={row.waiter} className="cursor-pointer">
                                    <TableCell className="font-medium">{row.waiter}</TableCell>
                                    <TableCell>{row.shift}</TableCell>
                                    <TableCell>{row.tables}</TableCell>
                                    <TableCell>${row.sales.toFixed(2)}</TableCell>
                                    <TableCell>${row.tips.toFixed(2)}</TableCell>
                                    <TableCell className={row.openBalances > 0 ? "text-destructive" : ""}>${row.openBalances.toFixed(2)}</TableCell>
                                    <TableCell>{row.voids}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{row.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
