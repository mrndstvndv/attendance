'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SERVICES = [
  {
    id: 'training',
    name: 'Training',
    description: 'Access training programs and courses',
    icon: '📚',
  },
  {
    id: 'printing',
    name: 'Printing',
    description: 'Use printing and document services',
    icon: '🖨️',
  },
  {
    id: 'pc_use',
    name: 'PC Use',
    description: 'Access computer facilities and resources',
    icon: '💻',
  },
];

export function ServiceSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectService = async (serviceId: string) => {
    setSelectedService(serviceId);
    setLoading(true);

    try {
      // Call login API to record service selection and timestamp
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          service: serviceId,
          userId: userId,
        }),
      });

      if (response.ok) {
        // Show success message
        router.push(`/dashboard?service=${serviceId}&userId=${userId}`);
      }
    } catch (err) {
      console.error('Service selection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Thanks for signing in!</CardTitle>
          <CardDescription>Please select a service to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                disabled={loading && selectedService !== service.id}
                className={`p-6 border-2 rounded-lg transition-all text-center ${
                  selectedService === service.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } disabled:opacity-50`}
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <Button
                  size="sm"
                  variant={selectedService === service.id ? 'default' : 'outline'}
                  disabled={loading && selectedService !== service.id}
                >
                  {loading && selectedService === service.id ? 'Loading...' : 'Select'}
                </Button>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
