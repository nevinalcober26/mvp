'use client';
import { format, subDays, subHours } from 'date-fns';
import type { Customer, Visit, Payment } from './types';

const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
const paymentMethods: Payment['method'][] = ['Credit Card', 'Cash', 'Online'];
const paymentStatuses: Payment['status'][] = ['Paid', 'Failed', 'Refunded'];
const visitTypes: Visit['type'][] = ['Dine-in', 'Takeaway'];
const visitStatuses: Visit['paymentStatus'][] = ['Paid', 'Partial', 'Unpaid'];

export const generateMockCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const totalVisits = Math.floor(Math.random() * 20) + 1;
    let totalSpent = 0;
    const visits: Visit[] = [];

    for (let j = 0; j < totalVisits; j++) {
      const visitDate = subDays(new Date(), i * 5 + j * 10);
      const visitTotal = Math.random() * 150 + 20;
      const payments: Payment[] = [];
      const numPayments = Math.floor(Math.random() * 2) + 1;
      let paidAmount = 0;

      for (let k = 0; k < numPayments; k++) {
        const paymentAmount = numPayments > 1 ? visitTotal / numPayments : visitTotal * (Math.random() * 0.5 + 0.5);
        paidAmount += paymentAmount;
        const tip = paymentAmount * (Math.random() * 0.2);
        payments.push({
          id: `pay_${i}_${j}_${k}`,
          amount: paymentAmount,
          tip,
          method: paymentMethods[k % paymentMethods.length],
          status: paymentStatuses[k % paymentStatuses.length],
          date: format(subHours(visitDate, 1), 'PPpp'),
        });
      }
      
      let paymentStatus: Visit['paymentStatus'] = 'Unpaid';
      if(paidAmount >= visitTotal) paymentStatus = 'Paid';
      else if (paidAmount > 0) paymentStatus = 'Partial';

      visits.push({
        orderId: `#${1000 + i * 20 + j}`,
        date: format(visitDate, 'PP'),
        type: visitTypes[j % visitTypes.length],
        paymentStatus: paymentStatus,
        tip: payments.reduce((acc, p) => acc + p.tip, 0),
        isSplit: numPayments > 1,
        total: visitTotal,
        payments: payments,
      });
      totalSpent += visitTotal;
    }

    customers.push({
      id: `cust_${i}`,
      name,
      email: `${name.replace(' ', '.').toLowerCase()}@example.com`,
      phone: `555-01${String(i).padStart(2, '0')}`,
      avatar: `https://i.pravatar.cc/150?u=${name}`,
      lastVisit: totalVisits > 0 ? format(subDays(new Date(), i * 5), 'PP') : 'N/A',
      totalVisits,
      totalSpent,
      avgBillValue: totalVisits > 0 ? totalSpent / totalVisits : 0,
      visits: visits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    });
  }

  return customers;
};
