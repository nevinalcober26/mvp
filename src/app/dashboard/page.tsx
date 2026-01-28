'use client'; // This page now needs to be a client component for state and effects

import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Package,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/header';
import { LatestUpdates } from '@/components/dashboard/latest-updates';
import { MenuItemsTable } from '@/components/dashboard/menu-items-table';
import { OrderAnalyticsChart } from '@/components/dashboard/order-analytics-chart';
import { RecentActivityHeader } from '@/components/dashboard/recent-activity-header';
import { StatCards, type StatCardData } from '@/components/dashboard/stat-cards';
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts';
import { PerformanceSummary } from '@/components/dashboard/performance-summary';
import { PopularItems } from '@/components/dashboard/popular-items';


const initialStatCards: StatCardData[] = [
  {
    title: 'Total Categories',
    value: '26',
    change: '+4.5%',
    changeDescription: 'vs last month',
    icon: LayoutGrid,
    color: 'orange',
  },
  {
    title: 'Active Products',
    value: '120',
    change: '+12%',
    changeDescription: 'New items added',
    icon: Package,
    color: 'pink',
  },
  {
    title: 'Published Pages',
    value: '8',
    changeDescription: 'Updated 2 days ago',
    icon: FileText,
    color: 'green',
  },
  {
    title: "Today's Orders",
    value: '45',
    change: '+8.2%',
    changeDescription: 'vs yesterday',
    icon: ShoppingCart,
    color: 'teal',
  },
];

const generateChartData = () => [
  { date: 'Mon', orders: Math.floor(Math.random() * 5) + 30 },
  { date: 'Tue', orders: Math.floor(Math.random() * 5) + 35 },
  { date: 'Wed', orders: Math.floor(Math.random() * 5) + 32 },
  { date: 'Thu', orders: Math.floor(Math.random() * 5) + 45 },
  { date: 'Fri', orders: Math.floor(Math.random() * 5) + 40 },
  { date: 'Sat', orders: Math.floor(Math.random() * 5) + 55 },
  { date: 'Sun', orders: Math.floor(Math.random() * 5) + 50 },
];

export default function DashboardPage() {
  const [statCardsData, setStatCardsData] = useState(initialStatCards);
  const [chartData, setChartData] = useState(generateChartData);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates for Stat Cards
      setStatCardsData(prevData => prevData.map(card => {
        if (card.title === "Today's Orders") {
          const newValue = parseInt(card.value, 10) + Math.floor(Math.random() * 3);
          return { ...card, value: newValue.toString() };
        }
        return card;
      }));
      
      // Simulate real-time updates for Chart
      setChartData(prevData => {
        const newData = [...prevData];
        // new Date().getDay() returns 0 for Sun, 1 for Mon, etc.
        // We adjust so Monday is 0.
        const dayIndex = (new Date().getDay() + 6) % 7;
        
        if(dayIndex >= 0 && dayIndex < 7) {
            newData[dayIndex].orders += Math.floor(Math.random() * 2);
        }
        return newData;
      });

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        <WelcomeBanner />
        <StatCards cards={statCardsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderAnalyticsChart data={chartData} />
            <MenuItemsTable />
          </div>
          <div className="space-y-6">
            <PopularItems />
          </div>
        </div>
        
        <RecentActivityHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LatestUpdates />
          </div>
          <div className="space-y-6">
            <InventoryAlerts />
            <PerformanceSummary />
          </div>
        </div>
      </main>
    </>
  );
}
