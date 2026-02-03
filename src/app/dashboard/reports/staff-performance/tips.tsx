'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Trophy, Zap, Scale, GitCompareArrows, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const tipsData = [
    { waiter: 'Alex', total: 55.20, perTable: 4.60, perOrder: 3.68, perPayment: 3.68, avgPercent: 18.2, digitalVsCash: "80/20" },
    { waiter: 'Maria', total: 45.50, perTable: 4.55, perOrder: 3.79, perPayment: 3.79, avgPercent: 19.5, digitalVsCash: "90/10" },
    { waiter: 'John', total: 50.10, perTable: 3.58, perOrder: 2.78, perPayment: 2.78, avgPercent: 15.1, digitalVsCash: "70/30" },
    { waiter: 'Sarah', total: 60.80, perTable: 5.53, perOrder: 4.68, perPayment: 4.68, avgPercent: 20.1, digitalVsCash: "95/5" },
    { waiter: 'David', total: 25.40, perTable: 2.82, perOrder: 2.54, perPayment: 2.54, avgPercent: 12.5, digitalVsCash: "60/40" },
];

export function Tips() {
    const sortedTips = [...tipsData].sort((a, b) => b.total - a.total);

    const advancedMetrics: StatCardData[] = [
        { title: "Tip Volatility", value: "12.5%", icon: Zap, color: 'pink', change: "-2.1%", changeDescription: "Lower is better", tooltipText: 'Measures the consistency of tip percentages. A lower value indicates more predictable tipping behavior.' },
        { title: "Normalization Index", value: "8.5/10", icon: Scale, color: 'orange', change: "+0.5", changeDescription: "vs. restaurant avg.", tooltipText: 'A score indicating how a waiter\'s tip performance compares to the restaurant average, adjusted for factors like bill size.' },
        { title: "Fairness Score", value: "92%", icon: GitCompareArrows, color: 'teal', changeDescription: "Based on Gini Coefficient", tooltipText: 'Measures the equality of tip distribution among staff. A higher score indicates a more even distribution.' },
    ];

    const getRankComponent = (rank: number) => {
        if (rank === 0) {
            return <Trophy className="h-7 w-7 text-yellow-400" fill="currentColor" />;
        }
        if (rank === 1) {
            return <Trophy className="h-7 w-7 text-slate-400" fill="currentColor" />;
        }
        if (rank === 2) {
            return <Trophy className="h-7 w-7 text-amber-600" fill="currentColor" />;
        }
        return <span className="font-bold text-xl text-muted-foreground w-7 text-center">{rank + 1}</span>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Metrics</CardTitle>
                    <CardDescription>Metrics on tip normalization, volatility, and fairness.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StatCards cards={advancedMetrics} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Top 5 Staff by Tips</CardTitle>
                            <CardDescription>Leaderboard of top-earning waiters.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                   <div className="space-y-2">
                       {sortedTips.map((row, index) => (
                           <div 
                                key={row.waiter} 
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                                    index === 0 && 'border-yellow-400/50 bg-yellow-50/50',
                                    index === 1 && 'border-slate-400/50 bg-slate-50/50',
                                    index === 2 && 'border-amber-600/50 bg-amber-50/50',
                                )}
                            >
                               <div className="flex h-8 w-8 items-center justify-center">
                                   {getRankComponent(index)}
                               </div>
                               <div className="flex-1">
                                   <p className="font-semibold text-base">{row.waiter}</p>
                                   <p className="text-sm text-muted-foreground">Avg Tip: {row.avgPercent.toFixed(1)}%</p>
                               </div>
                               <div className="text-right">
                                   <p className="font-bold text-lg text-foreground">${row.total.toFixed(2)}</p>
                                   <p className="text-xs text-muted-foreground">{row.digitalVsCash} (Digital/Cash)</p>
                               </div>
                           </div>
                       ))}
                   </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tips Breakdown</CardTitle>
                    <CardDescription>Analyze tip performance for each waiter.</CardDescription>
                     <div className="flex justify-between items-center pt-4">
                        <Input placeholder="Search waiter..." className="max-w-xs" />
                        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waiter</TableHead>
                                    <TableHead>Total Tips</TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Tips/Table <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The average tip amount received per table served.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Avg Tip % <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The average tip as a percentage of the total bill.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Digital vs Cash <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The ratio of tips received through digital payments versus cash.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tipsData.map((row) => (
                                    <TableRow key={row.waiter} className="cursor-pointer">
                                        <TableCell className="font-medium">{row.waiter}</TableCell>
                                        <TableCell>${row.total.toFixed(2)}</TableCell>
                                        <TableCell>${row.perTable.toFixed(2)}</TableCell>
                                        <TableCell>{row.avgPercent.toFixed(1)}%</TableCell>
                                        <TableCell>{row.digitalVsCash}</TableCell>
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
