'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import { Clock, Info } from "lucide-react";
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const turnoverData = [
  { waiter: 'Alex', tables: 12, avgTime: "18m", dwellTime: "45m", splitVsNonSplit: "-5m" },
  { waiter: 'Maria', tables: 10, avgTime: "15m", dwellTime: "42m", splitVsNonSplit: "+2m" },
  { waiter: 'John', tables: 14, avgTime: "22m", dwellTime: "55m", splitVsNonSplit: "+8m" },
  { waiter: 'Sarah', tables: 11, avgTime: "16m", dwellTime: "40m", splitVsNonSplit: "-3m" },
  { waiter: 'David', tables: 9, avgTime: "25m", dwellTime: "60m", splitVsNonSplit: "+10m" },
];

const chartData = turnoverData.map(d => ({ name: d.waiter, time: parseInt(d.avgTime) }));

const turnoverCards: StatCardData[] = [
    { title: "Avg. Time to First Payment", value: "8m 30s", icon: Clock, color: 'teal', tooltipText: 'The average time from when an order is opened to when the first payment is attempted.' },
    { title: "Avg. Time to Fully Paid", value: "18m 15s", icon: Clock, color: 'orange', tooltipText: 'The average time from when an order is opened until it is fully paid and closed.' },
];

export function Turnover() {
    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Table Turnover Performance</CardTitle>
                    <CardDescription>Analyze how quickly tables are being turned over by staff.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StatCards cards={turnoverCards} />
                </CardContent>
            </Card>
            
            <Card>
                 <CardHeader>
                    <CardTitle>Average Turnover Time by Waiter</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="time" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Turnover Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Waiter</TableHead>
                                    <TableHead>Tables Served</TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Avg. Turnover Time <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The average time a waiter takes to serve a table and close the bill.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Avg. Dwell Time <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The average time customers spend at a table from seating to departure.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                    <TableHead>
                                        <UiTooltip>
                                            <UiTooltipTrigger className="flex items-center gap-1">Split vs. Non-split <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                            <UiTooltipContent><p>The difference in average turnover time between bills that were split and those that were not.</p></UiTooltipContent>
                                        </UiTooltip>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {turnoverData.map((row) => (
                                    <TableRow key={row.waiter}>
                                        <TableCell className="font-medium">{row.waiter}</TableCell>
                                        <TableCell>{row.tables}</TableCell>
                                        <TableCell>{row.avgTime}</TableCell>
                                        <TableCell>{row.dwellTime}</TableCell>
                                        <TableCell className={row.splitVsNonSplit.startsWith('+') ? "text-destructive" : "text-green-600"}>{row.splitVsNonSplit}</TableCell>
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
