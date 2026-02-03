'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import { DollarSign, FileText, AlertCircle, Info } from "lucide-react";
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const leakageData = [
  { id: "#3215", waiter: "John", type: "Closed w/o Settlement", amount: 22.50, status: "Unresolved" },
  { id: "#3211", waiter: "David", type: "Order w/o Payment", amount: 18.30, status: "Unresolved" },
  { id: "#3205", waiter: "Maria", type: "Tip Discrepancy", amount: 2.50, status: "Reviewed" },
];

const leakageKpiCards: StatCardData[] = [
    {
        title: 'Estimated Leakage',
        value: '$40.80',
        icon: DollarSign,
        color: 'pink',
        tooltipText: 'The total estimated revenue lost due to issues like unresolved bills or order discrepancies.'
    },
    {
        title: 'Tickets Involved',
        value: '2',
        icon: FileText,
        color: 'orange',
        tooltipText: 'The number of individual orders or tickets that are contributing to the estimated revenue leakage.'
    },
    {
        title: 'Leakage Types',
        value: '2',
        icon: AlertCircle,
        color: 'green',
        tooltipText: 'The number of different categories of issues (e.g., "Closed w/o Settlement") causing revenue leakage.'
    }
];

export function Leakage() {
    return (
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Leakage</CardTitle>
                    <CardDescription>Identify and track potential revenue loss.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StatCards cards={leakageKpiCards} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Waiter</TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Leak Type <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The specific reason for the potential revenue loss.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Amount at Risk <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The monetary value associated with the revenue leakage incident.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Status <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The current status of the investigation into the leakage incident.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leakageData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="font-medium">{row.id}</TableCell>
                                        <TableCell>{row.waiter}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell className="font-semibold text-destructive">${row.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={row.status === 'Unresolved' ? 'destructive' : 'outline'}>{row.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </div>
    );
}
