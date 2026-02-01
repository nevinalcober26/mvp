'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const turnoverData = [
  { waiter: 'Alex', tables: 12, avgTime: "18m", dwellTime: "45m", splitVsNonSplit: "-5m" },
  { waiter: 'Maria', tables: 10, avgTime: "15m", dwellTime: "42m", splitVsNonSplit: "+2m" },
  { waiter: 'John', tables: 14, avgTime: "22m", dwellTime: "55m", splitVsNonSplit: "+8m" },
  { waiter: 'Sarah', tables: 11, avgTime: "16m", dwellTime: "40m", splitVsNonSplit: "-3m" },
  { waiter: 'David', tables: 9, avgTime: "25m", dwellTime: "60m", splitVsNonSplit: "+10m" },
];

const chartData = turnoverData.map(d => ({ name: d.waiter, time: parseInt(d.avgTime) }));

export function Turnover() {
    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Table Turnover Performance</CardTitle>
                    <CardDescription>Analyze how quickly tables are being turned over by staff.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Avg. Time to First Payment</p>
                        <p className="text-2xl font-bold">8m 30s</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Avg. Time to Fully Paid</p>
                        <p className="text-2xl font-bold">18m 15s</p>
                    </div>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waiter</TableHead>
                                <TableHead>Tables Served</TableHead>
                                <TableHead>Avg. Turnover Time</TableHead>
                                <TableHead>Avg. Dwell Time</TableHead>
                                <TableHead>Split vs. Non-split</TableHead>
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
                </CardContent>
            </Card>
        </div>
    );
}
