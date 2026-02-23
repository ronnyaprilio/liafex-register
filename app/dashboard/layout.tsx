import React from 'react';
import { Navbar } from '../components/register/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">

      <Navbar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>

    </div>
  );
}