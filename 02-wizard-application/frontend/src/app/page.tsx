'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">
          Get an HVAC quote in minutes
        </h1>
        
        <Link
          href="/wizard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
        >
          Start
        </Link>
      </div>
    </main>
  );
}