// src/app/wizard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WizardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step
    router.push('/wizard/address');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Starting wizard...</span>
    </div>
  );
}