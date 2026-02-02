'use client';
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EMenuIcon } from '@/components/dashboard/app-sidebar';
import { AuthCardSkeleton } from '@/components/dashboard/skeletons';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs on the client after component mount
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleSignIn = () => {
    setError('');
    if (username === 'admin' && password === 'admin') {
      toast({
        title: 'Welcome, Admin!',
        description: 'You have successfully logged in.',
      });
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid username or password. Use "admin" for both.');
    }
  };

  if (isLoading) {
    return <AuthCardSkeleton />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <EMenuIcon />
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <NextLink href="/signup" className="underline">
              Sign up
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
