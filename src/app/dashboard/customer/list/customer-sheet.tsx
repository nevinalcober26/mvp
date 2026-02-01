'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Hash, Users, Edit } from 'lucide-react';
import type { Customer, Payment } from './types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface CustomerSheetProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) => (
  <div className="flex items-center gap-4 rounded-lg border p-4 bg-muted/50">
    <Icon className="h-6 w-6 text-muted-foreground" />
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

const getPaymentStatusVariant = (status: Payment['status']) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Failed': return 'destructive';
    case 'Refunded': return 'secondary';
    default: return 'outline';
  }
};

const getVisitStatusVariant = (status: Customer['visits'][0]['paymentStatus']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Partial': return 'secondary';
      case 'Unpaid': return 'destructive';
      default: return 'outline';
    }
  };

export function CustomerSheet({
  customer,
  open,
  onOpenChange,
}: CustomerSheetProps) {
  const allPayments = useMemo(() => {
    if (!customer) return [];
    return customer.visits.flatMap(visit => 
      visit.payments.map(p => ({ ...p, orderId: visit.orderId }))
    );
  }, [customer]);

  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-2xl">{customer.name}</SheetTitle>
                <SheetDescription>{customer.email} &bull; {customer.phone}</SheetDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <StatCard title="Total Spent" value={`$${customer.totalSpent.toFixed(2)}`} icon={DollarSign} />
                <StatCard title="Total Visits" value={customer.totalVisits.toString()} icon={Hash} />
                <StatCard title="Avg. Bill Value" value={`$${customer.avgBillValue.toFixed(2)}`} icon={Users} />
            </div>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            <Tabs defaultValue="visits" className="h-full">
              <TabsList className="w-full justify-start rounded-none border-b px-6 sticky top-0 bg-background z-10">
                <TabsTrigger value="visits">Visit History</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
              </TabsList>
              <TabsContent value="visits" className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All Visits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Tip</TableHead>
                                    <TableHead className="text-right">Split?</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.visits.map(visit => (
                                    <TableRow key={visit.orderId}>
                                        <TableCell className="font-medium">{visit.orderId}</TableCell>
                                        <TableCell>{visit.date}</TableCell>
                                        <TableCell>{visit.type}</TableCell>
                                        <TableCell><Badge variant={getVisitStatusVariant(visit.paymentStatus)}>{visit.paymentStatus}</Badge></TableCell>
                                        <TableCell className="text-right font-mono">${visit.tip.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{visit.isSplit ? 'Yes' : 'No'}</TableCell>
                                        <TableCell className="text-right font-mono">${visit.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments" className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>All Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Tip</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allPayments.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.orderId}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell><Badge variant={getPaymentStatusVariant(payment.status)}>{payment.status}</Badge></TableCell>
                                    <TableCell className="text-right font-mono">${payment.tip.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono">${payment.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <SheetFooter className="p-6 border-t bg-background flex-row justify-between w-full">
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Customer</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
