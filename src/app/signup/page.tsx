'use client';
import React, { useState } from 'react';
import NextLink from 'next/link';
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
import { useAuth } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { SignupCardSkeleton } from '@/components/dashboard/skeletons';

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to dashboard with onboarding flag
        router.push('/dashboard?onboarding=true');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (isUserLoading) {
    return <SignupCardSkeleton />;
  }

  if (user) {
    return null;
  }

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    // For now, we are just creating the user in Firebase Auth.
    // In a real application, you would also create a user profile in Firestore here.
    initiateEmailSignUp(auth, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <EMenuIcon />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="Max"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Robinson"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignUp}>
            Create account
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <NextLink href="/" className="underline">
              Sign in
            </NextLink>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
