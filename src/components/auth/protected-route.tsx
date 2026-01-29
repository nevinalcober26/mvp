'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardPageSkeleton } from '@/components/dashboard/skeletons';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return <DashboardPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
