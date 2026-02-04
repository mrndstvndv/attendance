'use client';

import { LoginForm } from '@/components/login-form';

export function LoginContent() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LoginForm />
    </main>
  );
}
