
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const BentoCard = ({ children, className = "", darkMode }: any) => (
  <div className={`
    relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-300 group
    ${darkMode 
      ? 'bg-slate-900/50 border-white/5 backdrop-blur-xl hover:bg-slate-900/80 hover:border-emerald-500/20 shadow-2xl shadow-emerald-900/10' 
      : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-emerald-500/20'}
    ${className}
  `}>
    {children}
  </div>
);

export const HeroMetric = ({ label, value, trend, icon, gradient }: any) => (
  <div className={`p-6 rounded-[2rem] relative overflow-hidden group cursor-default transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95`}>
    {/* Mesh Gradient background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 dark:opacity-80`}></div>
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500 text-white">
      {icon}
    </div>

    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white shadow-sm">
          {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-black/10 rounded-lg backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.1em]">{label}</p>
        <h3 className="text-3xl font-black text-white mt-1 tracking-tight leading-none">{value}</h3>
      </div>
    </div>
  </div>
);
