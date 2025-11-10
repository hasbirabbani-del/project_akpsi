import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Package, LayoutDashboard, Activity } from 'lucide-react';
import UserMenu from './UserMenu';

const Layout = ({ children }) => {
  const { session } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#1A73E8]" />
            <span className="text-xl font-bold text-gray-900">Stockholm</span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className={`text-sm font-medium flex items-center gap-2 ${
                location.pathname === '/dashboard'
                  ? 'text-[#1A73E8] border-b-2 border-[#1A73E8] pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/sales-order')}
              className={`text-sm font-medium flex items-center gap-2 ${
                location.pathname === '/sales-order'
                  ? 'text-[#1A73E8] border-b-2 border-[#1A73E8] pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              Aktivitas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">{session.warehouse}</span>
              <span className="mx-2">•</span>
              <span>{session.workstation || session.workstationId}</span>
            </div>
          )}
          <UserMenu />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F3F4F6] min-h-[calc(100vh-4rem)] border-r border-gray-200">
          <nav className="py-4">
            <div className="px-4 mb-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Quality control</div>
            </div>
            <button className="w-full px-4 py-3 text-left text-sm font-medium text-white bg-[#1A73E8] hover:bg-[#1669C1] transition-colors flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                Sales order
              </span>
              <div className="flex items-center gap-1">
                <span className="bg-white text-[#1A73E8] text-xs font-bold rounded px-1.5 py-0.5">200</span>
                <span className="bg-red-500 text-white text-xs font-bold rounded px-1.5 py-0.5">5</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
