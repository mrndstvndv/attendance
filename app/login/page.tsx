import { Suspense } from 'react';
import { LoginContent } from './login-content';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
