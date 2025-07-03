'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Next.js + Nest.js Application
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/leads"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Leads Page
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Frontend (Next.js)</h3>
              <p className="text-gray-600">
                Running on port 3000 with TypeScript, Tailwind CSS, and Axios
              </p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Backend (Nest.js)</h3>
              <p className="text-gray-600">
                Running on port 3001 with TypeScript and CORS enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}