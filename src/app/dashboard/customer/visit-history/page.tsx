'use client';

import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function VisitHistoryPage() {
  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Visit History</CardTitle>
                    <CardDescription>
                        This page is currently under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        A global view of all customer visits will be available here soon. For now, please view visit history via the Customer List page.
                    </p>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
