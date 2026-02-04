'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/signup-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(true);
  const [hasPreviousLogin, setHasPreviousLogin] = useState(false);

  useEffect(() => {
    // Check for session cookie
    const hasCookie = document.cookie.includes('session_token');
    setHasPreviousLogin(hasCookie);

    // If user has session cookie, redirect to dashboard
    if (hasCookie) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isNewUser ? (
        <>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl">
              <SignupForm />
            </div>
          </div>
          <div className="fixed bottom-4 left-4 right-4 flex justify-center md:justify-start">
            <Button
              variant="outline"
              onClick={() => setIsNewUser(false)}
              className="bg-white"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Go to Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsNewUser(true)}
              className="w-full"
            >
              Create New Account
            </Button>
          </Card>
        </div>
      )}
    </main>
  );
}
