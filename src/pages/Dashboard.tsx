import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.email}!</h2>
            <p className="mt-2 text-gray-600">
              This is your personal dashboard. You're logged in as a {user?.role}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}