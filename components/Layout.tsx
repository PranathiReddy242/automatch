
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: AppTab.DASHBOARD, label: 'Overview', icon: '📊' },
    { id: AppTab.FIND_JOBS, label: 'Discovery', icon: '🔍' },
    { id: AppTab.HISTORY, label: 'Applications', icon: '📝' },
    { id: AppTab.PROFILE, label: 'My Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 text-white flex flex-col p-4 space-y-2 sticky top-0 h-auto md:h-screen">
        <div className="flex items-center space-x-2 mb-8 px-2 py-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">QA Outreach</span>
        </div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-slate-800 text-[10px] text-slate-500 px-2 space-y-3 leading-relaxed">
          <div>
            <p className="font-bold text-slate-400 mb-1">QA Outreach Pro v1.0.0</p>
            <p>
              Built with <span className="text-red-500">❤️</span> by <span className="text-slate-300">Techprism solutions</span>
            </p>
            <p>
              and with <span className="text-pink-400">❤️</span> by <span className="text-slate-300">Pranathi Tarigonda</span>
            </p>
          </div>
          <p className="opacity-50">Empowering QA Leaders with AI-driven discovery.</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
