
import React from 'react';
import { 
  Users, TrendingUp, UserPlus, Heart, Eye, ArrowDownRight, 
  Instagram, Target, Megaphone, MousePointerClick, 
  Wallet, UserCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { getHeroMetrics, getFunnelData, getFinancialPerformance, getActivityLogs, getCampaignMetrics } from '../services/mockData';
import { BentoCard, HeroMetric } from './BentoCard';

const DashboardOverview: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const metrics = getHeroMetrics('30d');
  const campaign = getCampaignMetrics();
  const funnelData = getFunnelData();
  const financialData = getFinancialPerformance();
  const logs = getActivityLogs();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <HeroMetric 
          label="Alcance" 
          value={metrics.reach.value.toLocaleString()} 
          trend={metrics.reach.trend}
          icon={<Eye />}
          gradient="from-blue-600 to-indigo-700"
        />
        <HeroMetric 
          label="ROI Marketing" 
          value={metrics.roi.value} 
          trend={metrics.roi.trend}
          icon={<TrendingUp />}
          gradient="from-emerald-500 to-teal-600"
        />
        <HeroMetric 
          label="Seguidores" 
          value={metrics.followers.value.toLocaleString()} 
          trend={metrics.followers.trend}
          icon={<Users />}
          gradient="from-violet-500 to-purple-700"
        />
        <HeroMetric 
          label="Nuevos Clientes" 
          value={metrics.newClients.value} 
          trend={metrics.newClients.trend}
          icon={<UserPlus />}
          gradient="from-amber-400 to-orange-600"
        />
        <HeroMetric 
          label="Engagement" 
          value={metrics.engagement.value} 
          trend={metrics.engagement.trend}
          icon={<Heart />}
          gradient="from-pink-500 to-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart */}
        <BentoCard darkMode={darkMode} className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">Análisis de Ventas</h3>
              <p className="text-sm text-slate-500">Ingresos vs Año Anterior</p>
            </div>
            <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['Ventas', 'Ticket'].map(t => (
                <button key={t} className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${t === 'Ventas' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                    borderRadius: '16px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fill="url(#gradientPrimary)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="lastYear" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Funnel */}
        <BentoCard darkMode={darkMode} className="lg:col-span-4 flex flex-col">
          <h3 className="text-xl font-black mb-1">Conversión Digital</h3>
          <p className="text-sm text-slate-500 mb-8">Embudo de atracción</p>
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {funnelData.map((item, i) => (
              <div key={item.name} className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.name}</span>
                  <span className="text-xs font-black">{item.label}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${i % 2 === 0 ? 'from-emerald-400 to-emerald-500' : 'from-blue-400 to-blue-500'}`}
                    style={{ width: `${(item.value / funnelData[0].value) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Campaign Metrics Section */}
        <BentoCard darkMode={darkMode} className="lg:col-span-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <Megaphone size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">Análisis de Publicidad</h3>
              <p className="text-sm text-slate-500">Rendimiento Google Ads & Meta</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all">
              <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <MousePointerClick size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">CTR Medio</span>
              </div>
              <p className="text-3xl font-black">{campaign.ctr.value}</p>
              <div className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={12} /> +12% vs last month
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-transparent hover:border-blue-500/20 transition-all">
              <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <Wallet size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">CPC Medio</span>
              </div>
              <p className="text-3xl font-black">{campaign.cpc.value}</p>
              <div className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={12} /> Coste optimizado (-8%)
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-transparent hover:border-violet-500/20 transition-all">
              <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <UserCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Conv. Landing</span>
              </div>
              <p className="text-3xl font-black">{campaign.conversions.value}</p>
              <div className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={12} /> +18.5% conversión
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-[2rem] border border-emerald-500/20 flex flex-col justify-center text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado ROAS</p>
              <p className="text-4xl font-black text-emerald-500">{campaign.roas.value}</p>
            </div>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default DashboardOverview;
