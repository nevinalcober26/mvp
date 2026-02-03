'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCards, type StatCardData } from "@/components/dashboard/stat-cards";
import { AlertTriangle, DollarSign, TrendingUp, Eye, Info } from "lucide-react";
import { OrderDetailsSheet } from '@/app/dashboard/orders/order-details-sheet';
import type { Order } from '@/app/dashboard/orders/types';
import { mockDataStore } from '@/lib/mock-data-store';
import { useToast } from '@/hooks/use-toast';
import {
    TooltipProvider,
    Tooltip as UiTooltip,
    TooltipContent as UiTooltipContent,
    TooltipTrigger as UiTooltipTrigger,
  } from '@/components/ui/tooltip';

const kpis: StatCardData[] = [
    { title: "Risky Tables", value: "3", icon: AlertTriangle, color: 'pink', tooltipText: 'Tables with unusual payment behavior, such as long pending times or multiple failed payments.' },
    { title: "Revenue at Risk", value: "$245.50", icon: DollarSign, color: 'orange', tooltipText: 'The total outstanding amount on tables identified as having risky payment behavior.' },
    { title: "Tips Trend (7d)", value: "+5.2%", icon: TrendingUp, color: 'green', change: "+5.2%", tooltipText: 'The percentage increase or decrease in the average tip amount over the last 7 days.' },
];

const alerts = [
    { type: "High-risk Table", timestamp: "2m ago", reference: "Waiter: John, Table: T5", severity: "High", orderId: "#3214" },
    { type: "Unusual Tip Drop", timestamp: "1h ago", reference: "Waiter: Maria", severity: "Medium", orderId: "#3211" },
    { type: "Ending Shift with Open Balance", timestamp: "8h ago", reference: "Waiter: David", severity: "Low", orderId: "#3210" },
];

export function AiOverview() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setOrders(mockDataStore.orders);
    }, []);

    const handleViewDetails = (orderId: string) => {
        const order = orders.find(o => o.orderId === orderId);
        if (order) {
            setSelectedOrder(order);
            setIsSheetOpen(true);
        } else {
            toast({
                variant: "destructive",
                title: "Order Details Not Found",
                description: `Could not find the details for order ${orderId}.`,
            });
        }
    };

    return (
        <>
            <div className="space-y-6">
                <StatCards cards={kpis} />

                <Card>
                    <CardHeader>
                        <CardTitle>Notable AI Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <UiTooltip>
                                                <UiTooltipTrigger className="flex items-center gap-1">Type <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                                <UiTooltipContent><p>The category of the detected anomaly or insight.</p></UiTooltipContent>
                                            </UiTooltip>
                                        </TableHead>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>
                                            <UiTooltip>
                                                <UiTooltipTrigger className="flex items-center gap-1">Reference <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                                <UiTooltipContent><p>The waiter, table, or entity related to the alert.</p></UiTooltipContent>
                                            </UiTooltip>
                                        </TableHead>
                                        <TableHead>
                                            <UiTooltip>
                                                <UiTooltipTrigger className="flex items-center gap-1">Severity <Info className="h-3 w-3 text-muted-foreground" /></UiTooltipTrigger>
                                                <UiTooltipContent><p>The potential impact level of the alert.</p></UiTooltipContent>
                                            </UiTooltip>
                                        </TableHead>
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
                                                <Button variant="ghost" size="icon" onClick={() => handleViewDetails(alert.orderId)}>
                                                    <Eye className="h-5 w-5" />
                                                    <span className="sr-only">View details</span>
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
            <OrderDetailsSheet
                order={selectedOrder}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </>
    )
}
