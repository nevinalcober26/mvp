'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { format, isSameDay } from 'date-fns';
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
  Calendar as CalendarIcon,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  XCircle,
  ArrowUpDown,
  Settings,
  Download,
  BellRing,
  Plus,
  Circle,
  Check,
  X,
  Ban,
  Undo2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { DashboardHeader } from '@/components/dashboard/header';
import { StatCards, type StatCardData } from '@/components/dashboard/stat-cards';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { Order } from './types';
import { generateMockOrders } from './mock';
import { getStatusBadgeVariant } from './utils';
import { OrderDetailsSheet } from './order-details-sheet';
import { OrdersPageSkeleton } from '@/components/dashboard/skeletons';
import { AiSummary } from '@/components/dashboard/ai-summary';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const OrderStatusBadge = ({ status }: { status: Order['orderStatus'] }) => {
  let icon = null;
  let variant = getStatusBadgeVariant(status);
  let text = status;

  switch (status) {
    case 'Completed':
      icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-green-500" />;
      break;
    case 'Open':
      icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-blue-500" />;
      variant = 'secondary';
      break;
    case 'Draft':
      icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-gray-400" />;
      variant = 'outline';
      break;
    case 'Cancelled':
      icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-red-500" />;
      variant = 'destructive';
      break;
    case 'Refunded':
        icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-orange-500" />;
        variant = 'secondary';
        break;
    case 'Paid':
        icon = <Check className="mr-1.5 h-3 w-3" />;
        variant = 'default';
  }

  return <Badge variant={variant} className="capitalize">{icon}{text}</Badge>;
};

const PaymentStatusBadge = ({ status, splitType }: { status: Order['paymentState'], splitType?: Order['splitType'] }) => {
    let icon = null;
    let variant = getStatusBadgeVariant(status);
    let text = status;

    switch (status) {
        case 'Fully Paid':
            icon = <Check className="mr-1.5 h-3 w-3" />;
            variant = 'default';
            break;
        case 'Partial':
            icon = <Circle className="mr-1.5 h-2.5 w-2.5 fill-current text-orange-500" />;
            variant = 'secondary';
            if (splitType === 'byItem') text = 'Partial (by Item)';
            if (splitType === 'equally') text = 'Partial (Equally)';
            break;
        case 'Unpaid':
            icon = <X className="mr-1.5 h-3 w-3" />;
            variant = 'destructive';
            break;
        case 'Voided':
            icon = <Ban className="mr-1.5 h-3 w-3" />;
            variant = 'outline';
            break;
        case 'Returned':
            icon = <Undo2 className="mr-1.5 h-3 w-3" />;
            variant = 'secondary';
            break;
    }

    return <Badge variant={variant} className="capitalize">{icon}{text}</Badge>;
}

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [date, setDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const [permission, setPermission] = useState('default');

  const [filters, setFilters] = useState({
    search: '',
    branch: 'all',
    status: 'all',
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'orderId', direction: 'descending' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllOrders(generateMockOrders(30));
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleNotificationClick = () => {
    if (!('Notification' in window)) {
      toast({
        variant: 'destructive',
        title: 'Notifications not supported',
        description: 'Your browser does not support desktop notifications.',
      });
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('eMenu Digital Hub', {
        body: 'You are all set for future updates!',
      });
      return;
    }

    if (Notification.permission === 'denied') {
      toast({
        variant: 'destructive',
        title: 'Notifications blocked',
        description:
          'Please enable notifications in your browser settings to receive updates.',
      });
      return;
    }

    Notification.requestPermission().then((result) => {
      setPermission(result);
      if (result === 'granted') {
        new Notification('eMenu Digital Hub', {
          body: 'You are all set for future updates!',
        });
      }
    });
  };

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = allOrders.filter((order) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        filters.search === '' ||
        order.orderId.toLowerCase().includes(searchLower) ||
        (order.customer && order.customer.name.toLowerCase().includes(searchLower));

      const matchesBranch =
        filters.branch === 'all' || order.branch === filters.branch;
      const matchesStatus =
        filters.status === 'all' || order.orderStatus === filters.status;
      
      const orderDate = new Date(order.orderTimestamp);
      const matchesDate = date ? isSameDay(orderDate, date) : true;

      return matchesSearch && matchesBranch && matchesStatus && matchesDate;
    });

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [allOrders, filters, sortConfig, date]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage]);

  const kpiCards: StatCardData[] = useMemo(() => {
    return [
      { title: 'Total Revenue', value: '$1028.50', changeDescription: 'from 30 orders', icon: DollarSign, color: 'teal' },
      { title: 'Total Orders', value: '+50', changeDescription: 'in the last 30 days', icon: ShoppingCart, color: 'orange' },
      { title: 'Avg. Order Value', value: '$34.28', change: '+5.2%', changeDescription: 'vs last month', icon: TrendingUp, color: 'pink' },
      { title: 'Cancelled & Refunded', value: '20', changeDescription: '40% of total orders', icon: XCircle, color: 'green' },
    ];
  }, []);
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };
  
  const SortableHeader = ({ tKey, label }: { tKey: keyof Order; label: string }) => (
    <Button variant="ghost" onClick={() => requestSort(tKey)} className="px-2 font-semibold">
      {label}
      <ArrowUpDown className={cn('ml-2 h-4 w-4', sortConfig?.key !== tKey && 'text-muted-foreground/50')} />
    </Button>
  );

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            startPage = 1;
            endPage = maxPagesToShow -1;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - maxPagesToShow + 2;
            endPage = totalPages;
        }

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) {
                pageNumbers.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }
    }
    
    return (
        <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2">...</span>
              )
            )}
             <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
        </div>
    );
};

  if (isLoading) {
    return <OrdersPageSkeleton view={'list'} />;
  }

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Orders</h1>
            <p className="text-muted-foreground">View and manage all recent orders from this branch.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleNotificationClick} disabled={permission === 'denied'}>
                <BellRing className="mr-2 h-4 w-4" />
                {permission === 'denied' ? 'Notifications Blocked' : 'Enable Desktop Notification'}
            </Button>
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Export
            </Button>
          </div>
        </div>
        <AiSummary data={filteredAndSortedOrders} context="daily restaurant orders" />
        <StatCards cards={kpiCards} />

        <Card className="w-full">
            <CardContent className="p-0">
                <div className="p-4 flex flex-wrap items-center justify-between gap-2 border-b">
                <Input
                    placeholder="Search by ID, customer..."
                    className="max-w-xs"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="Ras Al Khaimah">Sushi Restaurant</SelectItem>
                        <SelectItem value="Dubai Mall">Dubai Mall</SelectItem>
                    </SelectContent>
                    </Select>
                    
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                    </Select>
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={'outline'} className={cn('w-full sm:w-auto justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (isSameDay(date, new Date()) ? 'Today' : format(date, 'PPP')) : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
                </div>

                <div className="relative w-full overflow-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead><SortableHeader tKey="orderId" label="Order ID" /></TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead><SortableHeader tKey="branch" label="Branch" /></TableHead>
                            <TableHead>Table</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="text-right"><SortableHeader tKey="totalAmount" label="Total" /></TableHead>
                            <TableHead className="text-right">Paid</TableHead>
                            <TableHead className="text-right">Pending</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paginatedOrders.map((order) => (
                            <TableRow key={order.orderId} onClick={() => handleViewDetails(order)} className="cursor-pointer">
                            <TableCell className="font-medium">{order.orderId}</TableCell>
                            <TableCell>
                                {order.customer ? (
                                    <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                                        <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{order.customer.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                                    </div>
                                    </div>
                                ) : (
                                    <div className="text-sm italic text-muted-foreground">Guest</div>
                                )}
                            </TableCell>
                            <TableCell>{order.branch}</TableCell>
                            <TableCell>{order.table}</TableCell>
                            <TableCell><OrderStatusBadge status={order.orderStatus} /></TableCell>
                            <TableCell><PaymentStatusBadge status={order.paymentState} splitType={order.splitType} /></TableCell>
                            <TableCell className="text-right font-mono">${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono text-green-600">${order.paidAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono text-red-600">
                                {order.totalAmount - order.paidAmount > 0.01 ? `$${(order.totalAmount - order.paidAmount).toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    {paginatedOrders.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">No orders found.</div>
                    )}
                </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing{' '}
              <strong>
                {filteredAndSortedOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </strong>{' '}
              to{' '}
              <strong>
                {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)}
              </strong>{' '}
              of <strong>{filteredAndSortedOrders.length}</strong> orders
            </div>
            {totalPages > 1 && renderPagination()}
          </CardFooter>
        </Card>
      </main>

      <OrderDetailsSheet
        order={selectedOrder}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
