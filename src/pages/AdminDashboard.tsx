import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, Admin {user?.email}!
            </h2>
            <p className="mt-2 text-gray-600">
              This is the admin dashboard. Only users with admin role can access this page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}