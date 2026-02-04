'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const service = searchParams.get('service');
  const userId = searchParams.get('userId');

  const getServiceInfo = (serviceId: string | null) => {
    switch (serviceId) {
      case 'training':
        return {
          name: 'Training Program',
          description: 'Welcome to the training program section',
          icon: '📚',
          content: 'Access your training courses, schedules, and progress tracking here.',
        };
      case 'printing':
        return {
          name: 'Printing Services',
          description: 'Manage your print jobs and documents',
          icon: '🖨️',
          content: 'Submit documents for printing, check status, and manage your print queue.',
        };
      case 'pc_use':
        return {
          name: 'Computer Facilities',
          description: 'Access computer resources and facilities',
          icon: '💻',
          content: 'Book computer stations, access software, and manage your PC time allocations.',
        };
      default:
        return {
          name: 'Dashboard',
          description: 'Welcome to your dashboard',
          icon: '🏠',
          content: 'Please select a service from the previous page.',
        };
    }
  };

  const serviceInfo = getServiceInfo(service);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{serviceInfo.icon} {serviceInfo.name}</h1>
              <p className="text-gray-600">{serviceInfo.description}</p>
            </div>
            <Button onClick={() => router.push('/login')} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
              <CardDescription>Current service: {serviceInfo.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{serviceInfo.content}</p>
              {userId && (
                <p className="text-sm text-gray-500">User ID: {userId}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for this service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {service === 'training' && (
                <>
                  <Button className="w-full justify-start" variant="ghost">
                    📋 View Courses
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    📊 Check Progress
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    📅 Schedule Classes
                  </Button>
                </>
              )}
              {service === 'printing' && (
                <>
                  <Button className="w-full justify-start" variant="ghost">
                    ➕ Submit Print Job
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    📂 View Documents
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    ⏱️ Check Queue Status
                  </Button>
                </>
              )}
              {service === 'pc_use' && (
                <>
                  <Button className="w-full justify-start" variant="ghost">
                    🎫 Book Station
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    ⏰ My Reservations
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    💾 Software Available
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service Selected</p>
                <p className="text-lg font-semibold capitalize">{service?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Login Time</p>
                <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
