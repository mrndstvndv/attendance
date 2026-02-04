import { SignupForm } from '@/components/signup-form';

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SignupForm />
    </main>
  );
}
