'use client';

import { useState } from 'react';
import { apiService } from '@/services/api';

interface Lead {
  id: number;
  address: string;
  phone: string;
}

export default function LeadsPage() {
  const [error, setError] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({ address: '', phone: '' });

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.post('/api/leads', newLead);
      setNewLead({ address: '', phone: '' });
    } catch (err) {
      setError('Failed to create lead');
      console.error('Error creating lead:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Leads Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Lead Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={newLead.address}
              onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={newLead.phone}
              onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}