'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
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
import {
  Calendar as CalendarIcon,
  CreditCard,
  Info,
  Printer,
  Check,
  Users,
  Package,
  User,
  Hourglass,
  MessageSquare,
} from 'lucide-react';
import type { Order } from './types';
import { getStatusBadgeVariant } from './utils';
import { cn } from '@/lib/utils';

interface OrderDetailsSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({
  order,
  open,
  onOpenChange,
}: OrderDetailsSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b bg-muted/50">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <SheetTitle className="text-2xl">Order {order.orderId}</SheetTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
                <Badge variant={getStatusBadgeVariant(order.paymentState)}>
                  {order.paymentState}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{order.orderDate}</span>
            </div>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader className="p-8">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Items Ordered ({order.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <div className="flex justify-between items-start">
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
                          {index < order.items.length - 1 && (
                            <Separator className="my-4" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-8">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Discount
                        </span>
                        <span>$0.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>Paid</span>
                        <span>${order.paidAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-red-600">
                        <span>Pending</span>
                        <span>
                          $
                          {(order.totalAmount - order.paidAmount).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-semibold mb-3">Payment History</h4>

                      {order.splitType ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 p-3 bg-secondary rounded-md border">
                          {order.splitType === 'equally' ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                          <span>
                            Payment split <strong>{order.splitType}</strong>.
                          </span>
                        </div>
                      ) : order.paymentState === 'Partial' ? (
                        <p className="text-sm text-muted-foreground mb-3">
                          A partial payment was made.
                        </p>
                      ) : null}

                      {order.payments.length > 0 ||
                      order.totalAmount - order.paidAmount > 0.01 ? (
                        <div className="flow-root">
                          <ul>
                            {order.payments.map((payment, index) => {
                              const isLastPayment =
                                index === order.payments.length - 1;
                              const hasPendingAmount =
                                order.totalAmount - order.paidAmount > 0.01;
                              const showLineAndPadding =
                                !isLastPayment || hasPendingAmount;

                              return (
                                <li key={`payment-${index}`}>
                                  <div
                                    className={cn(
                                      'relative',
                                      showLineAndPadding && 'pb-8'
                                    )}
                                  >
                                    {showLineAndPadding && (
                                      <span
                                        className="absolute left-2.5 top-4 -ml-px h-full w-0.5 bg-border"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <div className="relative flex items-start space-x-3">
                                      <div>
                                        <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                                          <Check className="h-3 w-3 text-primary-foreground" />
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1 flex justify-between items-start">
                                        <div>
                                          <p className="font-medium text-sm">
                                            Payment of ${payment.amount} via {payment.method}
                                          </p>
                                          <p className="mt-0.5 text-sm text-muted-foreground">
                                            by {payment.guestName} on {payment.date}
                                          </p>
                                          <p className="mt-1 text-xs text-muted-foreground">
                                            Transaction ID: {payment.transactionId}
                                          </p>
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-700 border-transparent shrink-0"
                                        >
                                          Success
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}

                            {order.totalAmount - order.paidAmount > 0.01 && (
                              <li key="pending">
                                <div className="relative">
                                  <div className="relative flex items-start space-x-3">
                                    <div>
                                      <span className="h-5 w-5 rounded-full bg-destructive flex items-center justify-center ring-4 ring-background">
                                        <Hourglass className="h-3 w-3 text-destructive-foreground" />
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1 flex justify-between items-start pt-0.5">
                                      <div>
                                        <p className="font-medium text-sm text-red-600">
                                          Pending Amount
                                        </p>
                                        <p className="mt-0.5 text-sm text-muted-foreground">
                                          Awaiting payment
                                        </p>
                                      </div>
                                      <span className="font-mono font-semibold text-red-600">
                                        $
                                        {(
                                          order.totalAmount - order.paidAmount
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          This order is fully paid.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="p-8">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {order.customer ? 'Customer Details' : 'Guest Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 text-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {order.customer?.name || 'Guest Customer'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {order.customer?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {order.customer?.phone || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-8">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Branch</p>
                      <p className="font-medium">{order.branch}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Table</p>
                      <p className="font-medium">{order.table}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Staff</p>
                      <p className="font-medium">{order.staffName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Order Type</p>
                      <p className="font-medium">{order.orderType}</p>
                    </div>
                  </CardContent>
                </Card>

                {order.orderComments && (
                    <Card>
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Order Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <p className="text-sm text-muted-foreground italic">
                                "{order.orderComments}"
                            </p>
                        </CardContent>
                    </Card>
                )}
              </div>
            </div>
          </div>
          <SheetFooter className="p-6 border-t bg-background flex-row justify-between w-full">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
            <SheetClose asChild>
              <Button variant="secondary">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
