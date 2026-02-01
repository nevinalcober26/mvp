'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { StaffPerformanceSheet } from './staff-performance-sheet';

export default function StaffPerformancePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        {/* This main area can be a placeholder or show other reports */}
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Select a report to view detailed analytics.</p>
        </div>

        <StaffPerformanceSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </main>
    </>
  );
}
