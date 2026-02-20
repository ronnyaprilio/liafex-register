import React from 'react';
import { LayoutDashboard, Users, Settings, PieChart, LogOut } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-slate-800 text-lg">LIAFEX REGISTER</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {[
            { icon: LayoutDashboard, label: 'Register', active: true },
            { icon: Users, label: 'Customers', active: false },
            { icon: PieChart, label: 'Reports', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
            <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">POS Management Dashboard</h2>
                <p className="text-slate-500">Manage your POS operations in real time</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
            </div>
        </header>
        {children}
      </main>
    </div>
  );
}