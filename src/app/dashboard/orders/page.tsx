'use client';

import { useState } from 'react';
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
import { MoreHorizontal } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DashboardHeader } from '@/components/dashboard/header';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  orderId: string;
  branch: string;
  table: string;
  orderType: 'Post-Paid' | 'Prepaid';
  orderStatus: 'Draft' | 'Open' | 'Paid' | 'Cancelled' | 'Refunded';
  paymentState: 'Unpaid' | 'Partial' | 'Fully Paid';
  totalAmount: string;
  paidAmount: string;
  pendingAmount: string;
  items: OrderItem[];
  customerName: string;
  orderDate: string;
};

const initialOrders: Order[] = [
  {
    orderId: '#3210',
    branch: 'Ras Al Khaimah',
    table: 'T5',
    orderType: 'Post-Paid',
    orderStatus: 'Paid',
    paymentState: 'Fully Paid',
    totalAmount: '$55.50',
    paidAmount: '$55.50',
    pendingAmount: '$0.00',
    customerName: 'Alice Johnson',
    orderDate: '2024-07-23 10:30 AM',
    items: [
      { id: '1', name: 'Classic Pancakes', quantity: 1, price: 12.5 },
      { id: '2', name: 'Orange Juice', quantity: 2, price: 5.0 },
      { id: '3', name: 'Espresso', quantity: 1, price: 3.5 },
    ],
  },
  {
    orderId: '#3209',
    branch: 'Ras Al Khaimah',
    table: 'T2',
    orderType: 'Prepaid',
    orderStatus: 'Open',
    paymentState: 'Partial',
    totalAmount: '$30.00',
    paidAmount: '$15.00',
    pendingAmount: '$15.00',
    customerName: 'Bob Williams',
    orderDate: '2024-07-23 09:45 AM',
    items: [
      { id: '4', name: 'Avocado Toast', quantity: 1, price: 15.0 },
      { id: '5', name: 'Latte', quantity: 1, price: 5.5 },
    ],
  },
  {
    orderId: '#3208',
    branch: 'Ras Al Khaimah',
    table: 'T12',
    orderType: 'Post-Paid',
    orderStatus: 'Draft',
    paymentState: 'Unpaid',
    totalAmount: '$89.90',
    paidAmount: '$0.00',
    pendingAmount: '$89.90',
    customerName: 'Charlie Brown',
    orderDate: '2024-07-22 08:15 PM',
    items: [
      { id: '6', name: 'Ribeye Steak', quantity: 1, price: 45.0 },
      { id: '7', name: 'Red Wine', quantity: 1, price: 12.0 },
      { id: '8', name: 'Cheesecake', quantity: 1, price: 8.9 },
    ],
  },
  {
    orderId: '#3207',
    branch: 'Dubai Mall',
    table: 'T8',
    orderType: 'Post-Paid',
    orderStatus: 'Cancelled',
    paymentState: 'Unpaid',
    totalAmount: '$25.00',
    paidAmount: '$0.00',
    pendingAmount: '$25.00',
    customerName: 'Diana Prince',
    orderDate: '2024-07-22 07:00 PM',
    items: [{ id: '9', name: 'Margherita Pizza', quantity: 1, price: 20.0 }],
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
                      {order.totalAmount}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {order.paidAmount}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {order.pendingAmount}
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

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.orderId}</DialogTitle>
              <DialogDescription>
                {selectedOrder.customerName} at {selectedOrder.branch} on table{' '}
                {selectedOrder.table}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <h4 className="font-semibold">Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end pt-4 border-t">
                  <div className="w-1/2 space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{selectedOrder.totalAmount}</span>
                      </div>
                       <div className="flex justify-between">
                          <span>Tax</span>
                          <span>$0.00</span>
                      </div>
                       <div className="flex justify-between font-bold text-base">
                          <span>Total</span>
                          <span>{selectedOrder.totalAmount}</span>
                      </div>
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
