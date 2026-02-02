'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";

const kpis: StatCardData[] = [
    { title: "Risky Tables", value: "3", icon: AlertTriangle, color: 'pink' },
    { title: "Revenue at Risk", value: "$245.50", icon: DollarSign, color: 'orange' },
    { title: "Tips Trend (7d)", value: "+5.2%", icon: TrendingUp, color: 'green', change: "+5.2%" },
];

const alerts = [
    { type: "High-risk Table", timestamp: "2m ago", reference: "Waiter: John, Table: T5", severity: "High" },
    { type: "Unusual Tip Drop", timestamp: "1h ago", reference: "Waiter: Maria", severity: "Medium" },
    { type: "Ending Shift with Open Balance", timestamp: "8h ago", reference: "Waiter: David", severity: "Low" },
]

export function AiOverview() {
    return (
        <div className="space-y-6">
            <StatCards cards={kpis} />

            <Card>
                <CardHeader>
                    <CardTitle>Notable AI Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.map((alert, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{alert.type}</TableCell>
                                    <TableCell>{alert.timestamp}</TableCell>
                                    <TableCell>{alert.reference}</TableCell>
                                    <TableCell><Badge variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'secondary' : 'outline'}>{alert.severity}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" size="sm">View details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
