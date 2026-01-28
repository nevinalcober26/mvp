'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Printer,
  Calendar,
  CreditCard,
  MapPin,
  Hash,
  User,
  Info,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { DashboardHeader } from '@/components/dashboard/header';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Payment = {
  method: string;
  amount: string;
  date: string;
  transactionId: string;
};

type Order = {
  orderId: string;
  branch: string;
  table: string;
  orderType: 'Post-Paid' | 'Prepaid';
  orderStatus: 'Draft' | 'Open' | 'Paid' | 'Cancelled' | 'Refunded';
  paymentState: 'Unpaid' | 'Partial' | 'Fully Paid';
  totalAmount: number;
  paidAmount: number;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  orderDate: string;
  payments: Payment[];
};

const initialOrders: Order[] = [
  {
    orderId: '#3210',
    branch: 'Ras Al Khaimah',
    table: 'T5',
    orderType: 'Post-Paid',
    orderStatus: 'Paid',
    paymentState: 'Fully Paid',
    totalAmount: 55.5,
    paidAmount: 55.5,
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    customerAvatar: 'https://picsum.photos/seed/alice/100/100',
    orderDate: '2024-07-23 10:30 AM',
    items: [
      { id: '1', name: 'Classic Pancakes', quantity: 1, price: 12.5 },
      { id: '2', name: 'Orange Juice', quantity: 2, price: 5.0 },
      { id: '3', name: 'Espresso', quantity: 1, price: 3.5 },
    ],
    payments: [
      {
        method: 'Credit Card',
        amount: '55.50',
        date: '2024-07-23 10:32 AM',
        transactionId: 'txn_12345',
      },
    ],
  },
  {
    orderId: '#3209',
    branch: 'Ras Al Khaimah',
    table: 'T2',
    orderType: 'Prepaid',
    orderStatus: 'Open',
    paymentState: 'Partial',
    totalAmount: 30.0,
    paidAmount: 15.0,
    customerName: 'Bob Williams',
    customerEmail: 'bob@example.com',
    customerAvatar: 'https://picsum.photos/seed/bob/100/100',
    orderDate: '2024-07-23 09:45 AM',
    items: [
      { id: '4', name: 'Avocado Toast', quantity: 1, price: 15.0 },
      { id: '5', name: 'Latte', quantity: 1, price: 5.5 },
    ],
    payments: [
      {
        method: 'Cash',
        amount: '15.00',
        date: '2024-07-23 09:46 AM',
        transactionId: 'txn_67890',
      },
    ],
  },
  {
    orderId: '#3208',
    branch: 'Ras Al Khaimah',
    table: 'T12',
    orderType: 'Post-Paid',
    orderStatus: 'Draft',
    paymentState: 'Unpaid',
    totalAmount: 89.9,
    paidAmount: 0.0,
    customerName: 'Charlie Brown',
    customerEmail: 'charlie@example.com',
    customerAvatar: 'https://picsum.photos/seed/charlie/100/100',
    orderDate: '2024-07-22 08:15 PM',
    items: [
      { id: '6', name: 'Ribeye Steak', quantity: 1, price: 45.0 },
      { id: '7', name: 'Red Wine', quantity: 1, price: 12.0 },
      { id: '8', name: 'Cheesecake', quantity: 1, price: 8.9 },
    ],
    payments: [],
  },
  {
    orderId: '#3207',
    branch: 'Dubai Mall',
    table: 'T8',
    orderType: 'Post-Paid',
    orderStatus: 'Cancelled',
    paymentState: 'Unpaid',
    totalAmount: 25.0,
    paidAmount: 0.0,
    customerName: 'Diana Prince',
    customerEmail: 'diana@example.com',
    customerAvatar: 'https://picsum.photos/seed/diana/100/100',
    orderDate: '2024-07-22 07:00 PM',
    items: [{ id: '9', name: 'Margherita Pizza', quantity: 1, price: 20.0 }],
    payments: [],
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'fully paid':
      return 'default';
    case 'open':
    case 'partial':
      return 'secondary';
    case 'cancelled':
    case 'unpaid':
    case 'refunded':
      return 'destructive';
    case 'draft':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = (
    orderId: string,
    newStatus: Order['orderStatus']
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const handleSheetOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOrder(null);
    }
  }, []);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              View and manage all recent orders.
            </CardDescription>
            <div className="mt-4 flex items-center gap-4">
              <Input
                placeholder="Search by Order ID, Table..."
                className="max-w-xs"
              />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="rak">Ras Al Khaimah</SelectItem>
                  <SelectItem value="dubai">Dubai Mall</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment State</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>{order.branch}</TableCell>
                    <TableCell>{order.table}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.orderType === 'Prepaid' ? 'secondary' : 'outline'
                        }
                      >
                        {order.orderType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.paymentState)}>
                        {order.paymentState}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      ${order.paidAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ${(order.totalAmount - order.paidAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Update Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(order.orderId, 'Draft')
                                  }
                                >
                                  Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(order.orderId, 'Open')
                                  }
                                >
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(order.orderId, 'Paid')
                                  }
                                >
                                  Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(order.orderId, 'Cancelled')
                                  }
                                >
                                  Cancelled
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(order.orderId, 'Refunded')
                                  }
                                >
                                  Refunded
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1</strong> to <strong>{orders.length}</strong> of{' '}
              <strong>{orders.length}</strong> orders
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Sheet
        open={!!selectedOrder}
        onOpenChange={handleSheetOpenChange}
      >
        <SheetContent className="sm:max-w-lg w-full p-0">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 border-b bg-muted/50">
                <SheetTitle className="text-2xl">
                  Order {selectedOrder.orderId}
                </SheetTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedOrder.orderDate}</span>
                </div>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={selectedOrder.customerAvatar}
                        alt={selectedOrder.customerName}
                        data-ai-hint="person face"
                      />
                      <AvatarFallback>
                        {selectedOrder.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedOrder.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Branch</span>
                      <span>{selectedOrder.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Table</span>
                      <span>{selectedOrder.table}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Type</span>
                      <Badge
                        variant={
                          selectedOrder.orderType === 'Prepaid'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {selectedOrder.orderType}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Status</span>
                      <Badge
                        variant={getStatusBadgeVariant(selectedOrder.orderStatus)}
                      >
                        {selectedOrder.orderStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment State
                      </span>
                      <Badge
                        variant={getStatusBadgeVariant(selectedOrder.paymentState)}
                      >
                        {selectedOrder.paymentState}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Items Ordered ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-mono">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span>$0.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <h4 className="font-semibold mb-3">Payment History</h4>
                    <div className="space-y-4">
                      {selectedOrder.payments.length > 0 ? (
                        selectedOrder.payments.map((payment, index) => (
                          <div key={index} className="flex items-center">
                            <div className="flex-grow">
                              <p className="font-medium">
                                Paid ${payment.amount} via {payment.method}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {payment.date}
                              </p>
                            </div>
                            <Badge variant="default">Success</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No payments have been made for this order yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <SheetFooter className="p-6 border-t bg-background flex-row justify-between w-full">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" /> Print Receipt
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
