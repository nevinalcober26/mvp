'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import { Clock, Eye, Info } from "lucide-react";
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const balancesData = [
  { waiter: 'John', amount: 22.50, openTables: 1, oldestAge: "45m", recoveredVsLost: "$50 / $5" },
  { waiter: 'David', amount: 40.80, openTables: 2, oldestAge: "1h 15m", recoveredVsLost: "$20 / $15" },
  { waiter: 'Maria', amount: 5.50, openTables: 1, oldestAge: "8m", recoveredVsLost: "$10 / $0" },
];

const balanceCards: StatCardData[] = [
    { title: "0-10 min", value: "$5.50", icon: Clock, color: 'green', tooltipText: 'Total outstanding balance from orders that have been open for less than 10 minutes.' },
    { title: "10-30 min", value: "$0.00", icon: Clock, color: 'orange', tooltipText: 'Total outstanding balance from orders that have been open for 10 to 30 minutes.' },
    { title: "30+ min", value: "$63.30", icon: Clock, color: 'pink', tooltipText: 'Total outstanding balance from orders that have been open for more than 30 minutes.' }
];


export function Balances() {
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Outstanding Balances by Waiter</CardTitle>
                    <CardDescription>Monitor waiters with open balances.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <StatCards cards={balanceCards} />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waiter</TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Outstanding Amount <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The total unpaid amount currently assigned to the waiter.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1"># Open Tables <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The number of tables with open balances assigned to the waiter.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Oldest Balance Age <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The age of the longest-standing open balance for the waiter.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Recovered vs Lost <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>A ratio of successfully collected balances versus those written off as lost.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {balancesData.map((row) => (
                                    <TableRow key={row.waiter} className={cn(row.amount > 25 && "bg-destructive/10")}>
                                        <TableCell className="font-medium">{row.waiter}</TableCell>
                                        <TableCell className="font-semibold text-destructive">${row.amount.toFixed(2)}</TableCell>
                                        <TableCell>{row.openTables}</TableCell>
                                        <TableCell>{row.oldestAge}</TableCell>
                                        <TableCell>{row.recoveredVsLost}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-5 w-5" />
                                                <span className="sr-only">View open tables</span>
                                            </Button>
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
