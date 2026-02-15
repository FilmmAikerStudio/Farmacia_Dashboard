
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, Sun, Moon, Download, Search, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${darkMode ? 'dark bg-[#0a0c10]' : 'bg-[#f8fafc]'}`}>
      
      {/* Sidebar Flotante */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-24 lg:w-28 flex flex-col items-center py-8 transition-all duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/10 border border-slate-200 dark:border-white/5 rounded-[2.5rem] w-16 lg:w-20 flex-1 flex flex-col items-center py-6 space-y-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40 transform hover:rotate-12 transition-transform cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  p-3 rounded-2xl transition-all duration-300 group relative
                  ${activeTab === item.id 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
                title={item.label}
              >
                {item.icon}
                {/* Tooltip on hover */}
                <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* User & Theme Toggle */}
          <div className="flex flex-col space-y-4">
            <button 
              onClick={toggleDarkMode}
              className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
            >
              {darkMode ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} />}
            </button>
            <div className="w-12 h-12 rounded-2xl border-2 border-emerald-500/30 overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors">
              <img src="https://picsum.photos/seed/teresa/100/100" alt="Teresa" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen">
        {/* Superior Header */}
        <header className="h-20 flex items-center justify-between px-8 lg:px-12">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hola, <span className="text-emerald-500">Teresa</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">Farmacia Barcelona • Panel de Rendimiento</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-2 w-64 shadow-sm">
              <Search size={18} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar métricas..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            
            <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-500 hover:shadow-md transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <button className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all">
              <Download size={18} />
              <span className="hidden sm:inline">Informe Mensual</span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 scroll-smooth">
          <div className="max-w-7xl mx-auto py-4">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-emerald-500 text-white rounded-full shadow-2xl"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default Layout;
