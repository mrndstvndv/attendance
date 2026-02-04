import { Suspense } from 'react';
import { ServiceSelector } from '@/components/service-selector';

export const metadata = {
  title: 'Select Service',
  description: 'Choose a service to use',
};

export default function SelectServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ServiceSelector />
    </Suspense>
  );
}
