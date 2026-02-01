'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

const tipsData = [
    { waiter: 'Alex', total: 55.20, perTable: 4.60, perOrder: 3.68, perPayment: 3.68, avgPercent: 18.2, digitalVsCash: "80/20" },
    { waiter: 'Maria', total: 45.50, perTable: 4.55, perOrder: 3.79, perPayment: 3.79, avgPercent: 19.5, digitalVsCash: "90/10" },
    { waiter: 'John', total: 50.10, perTable: 3.58, perOrder: 2.78, perPayment: 2.78, avgPercent: 15.1, digitalVsCash: "70/30" },
    { waiter: 'Sarah', total: 60.80, perTable: 5.53, perOrder: 4.68, perPayment: 4.68, avgPercent: 20.1, digitalVsCash: "95/5" },
    { waiter: 'David', total: 25.40, perTable: 2.82, perOrder: 2.54, perPayment: 2.54, avgPercent: 12.5, digitalVsCash: "60/40" },
];

export function Tips() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Tips by Waiter</CardTitle>
                            <CardDescription>Analyze tip performance for each waiter.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                     <div className="flex items-center space-x-2 pt-4">
                        <Input placeholder="Search waiter..." className="max-w-xs" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waiter</TableHead>
                                <TableHead>Total Tips</TableHead>
                                <TableHead>Tips/Table</TableHead>
                                <TableHead>Avg Tip %</TableHead>
                                <TableHead>Digital vs Cash</TableHead>
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
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Advanced Metrics</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    <p>Advanced metrics on tip normalization, volatility, and fairness coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
