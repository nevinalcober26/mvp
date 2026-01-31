'use client';

import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StaffPerformancePage() {
  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Staff Performance Report</CardTitle>
                    <CardDescription>
                        This page is currently under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Come back soon to evaluate waiter productivity, tip behavior, settlement speed, and risk exposure.
                    </p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
