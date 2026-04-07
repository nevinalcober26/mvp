export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
};

export type Payment = {
  method?: string; // Optional for pending payments
  amount: string;
  date?: string; // Optional for pending payments
  transactionId: string; // Unique ID for the payment record
  guestName: string;
  tip?: number;
  items?: { name: string; quantity: number }[];
  status: 'Paid' | 'Pending';
  note?: string;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
}

export type StaffReference = {
  employee_reference_code: string;
  total_sale_amount: number;
  order_count: number;
  total_tip_amount: number;
  currency: string;
  start_date: string;
  end_date: string;
};

export type Order = {
  orderId: string;
  branch: string;
  table: string;
  orderType: 'Post-Paid' | 'Prepaid';
  orderStatus: 'Draft' | 'Open' | 'Cancelled' | 'Refunded' | 'Completed' | 'Preparing' | 'Served' | 'Placed';
  paymentState: 'Unpaid' | 'Partial' | 'Fully Paid' | 'Voided' | 'Returned';
  totalAmount: number;
  paidAmount: number;
  items: OrderItem[];
  orderDate: string;
  staffName: string;
  orderTimestamp: number;
  payments: Payment[];
  splitType?: 'equally' | 'byItem';
  customer?: Customer;
  orderComments?: string;
  source?: 'App to App' | 'POS';
  staffReference?: StaffReference;
};
