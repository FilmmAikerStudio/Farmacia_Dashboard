
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import { 
  getSocialDetailedMetrics, 
  getContentPerformance, 
  getSEOKeywords, 
  getFinancialPerformance,
  getSOPTasks,
  getActivityLogs
} from './services/mockData';
import { BentoCard } from './components/BentoCard';
import { 
  Instagram, Video, Globe, Briefcase, 
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Search, BarChart4, MessageSquare, Star, 
  User, Shield, Zap, Plus, ArrowUpRight, Camera
} from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderContent = () => {
    const animationClass = "animate-in fade-in slide-in-from-bottom-4 duration-500";
    
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview darkMode={darkMode} />;
      
      case 'social':
        const socialMetrics = getSocialDetailedMetrics();
        return (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${animationClass}`}>
            {socialMetrics.map(m => (
              <BentoCard key={m.platform} darkMode={darkMode} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-sm">
                      {m.platform === 'Instagram' ? <Instagram size={22}/> : m.platform === 'TikTok' ? <Video size={22}/> : <Zap size={22}/>}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{m.platform}</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Digital Hub</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black">
                    {m.engagement} Engagement
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 flex-1">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-transparent group-hover:border-emerald-500/20 transition-all">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Total Followers</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-black">{m.followers.toLocaleString()}</p>
                      <span className="text-xs font-bold text-emerald-500">+{m.growth}</span>
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem]">
                    <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-2">Contenido Estrella</p>
                    <p className="text-sm font-bold leading-tight line-clamp-2">"{m.topPost}"</p>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 border border-slate-200 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                  Ver Analíticas Detalladas
                </button>
              </BentoCard>
            ))}
          </div>
        );

      case 'content':
        const content = getContentPerformance();
        return (
          <div className={`space-y-6 ${animationClass}`}>
            <BentoCard darkMode={darkMode}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Estudio de Contenido</h3>
                  <p className="text-sm text-slate-500">Planificación y Rendimiento Creativo</p>
                </div>
                <button className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                  <Plus size={16} /> Crear Campaña
                </button>
              </div>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                      <th className="pb-4 font-black">Media Asset</th>
                      <th className="pb-4 font-black">Plataforma</th>
                      <th className="pb-4 font-black">Rendimiento</th>
                      <th className="pb-4 font-black">Estado</th>
                      <th className="pb-4 font-black text-right">Métricas</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {content.map(c => (
                      <tr key={c.id} className="group border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-emerald-500/5 transition-all">
                        <td className="py-5 pr-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden relative group-hover:scale-110 transition-transform">
                              <img src={`https://picsum.photos/seed/${c.id}/100/100`} alt="" className="object-cover w-full h-full opacity-60" />
                            </div>
                            <span className="font-black text-slate-700 dark:text-slate-200 line-clamp-1">{c.title}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-[10px]`}>
                            {c.platform === 'Instagram' ? <Instagram size={14} className="text-pink-500" /> : <Globe size={14} className="text-blue-500" />}
                            <span>{c.platform}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black">{c.reach.toLocaleString()} alc.</span>
                            <span className="text-[10px] text-emerald-500 font-bold">{c.engagement} eng.</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <button className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl transition-all"><BarChart4 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BentoCard>
          </div>
        );

      case 'web':
        const keywords = getSEOKeywords();
        return (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${animationClass}`}>
            <BentoCard darkMode={darkMode}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-3"><Globe className="text-blue-500" /> Google My Business</h3>
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 animate-pulse">
                  <Star size={20} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] text-center border border-transparent hover:border-blue-500/20 transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-3xl font-black text-amber-400">4.9</p>
                  <div className="flex justify-center mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" className="text-amber-400" />)}
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clics</p>
                  <p className="text-3xl font-black">2.4k</p>
                  <p className="text-[9px] font-bold text-emerald-500 mt-1">▲ 12%</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rutas</p>
                  <p className="text-3xl font-black">842</p>
                  <p className="text-[9px] font-bold text-emerald-500 mt-1">▲ 5%</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reseñas Recientes</p>
                  <button className="text-[10px] font-black text-blue-500 hover:underline">Ver Todas</button>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-[1.5rem] shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      <span className="text-xs font-black">Usuario Local {i}</span>
                      <div className="flex space-x-0.5 ml-auto">
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" className="text-amber-400" />)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">"La farmacia de referencia en el barrio. Teresa siempre nos ayuda con las mejores recomendaciones..."</p>
                  </div>
                ))}
              </div>
            </BentoCard>

            <BentoCard darkMode={darkMode}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-3"><Search className="text-emerald-500" /> Posicionamiento SEO</h3>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="space-y-3">
                {keywords.map(k => (
                  <div key={k.keyword} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border border-transparent hover:border-emerald-500/20 transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200">{k.keyword}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volumen: {k.volume} / mes</p>
                    </div>
                    <div className="flex items-center space-x-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cambio</span>
                        <span className={`text-xs font-black ${k.change > 0 ? 'text-emerald-500' : k.change < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                          {k.change > 0 ? '▲' : k.change < 0 ? '▼' : '–'} {Math.abs(k.change)}
                        </span>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                        <span className="text-lg font-black text-emerald-500">#{k.position}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                Informe SEO Completo
              </button>
            </BentoCard>
          </div>
        );

      case 'roi':
        const financial = getFinancialPerformance();
        return (
          <div className={`space-y-6 ${animationClass}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BentoCard darkMode={darkMode} className="lg:col-span-2">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Rendimiento Financiero</h3>
                    <p className="text-sm text-slate-500">Ingresos Totales vs Objetivos de Ventas</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Ventas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Objetivo</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financial}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} fontBold="bold" />
                      <Tooltip 
                        cursor={{fill: 'rgba(16, 185, 129, 0.05)'}} 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                      />
                      <Bar dataKey="sales" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                      <Bar dataKey="target" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </BentoCard>
              <div className="grid grid-cols-1 gap-6">
                <BentoCard darkMode={darkMode} className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-none">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">CPA Proyectado</p>
                  <p className="text-5xl font-black tracking-tighter">8.42€</p>
                  <p className="text-xs font-bold text-white/80 mt-2">Coste por Adquisición mejorado un 12%</p>
                  <div className="mt-8 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-white/60">Salud del ROI</p>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[88%]"></div>
                      </div>
                      <span className="text-xs font-black">Excelente</span>
                    </div>
                  </div>
                </BentoCard>
                <BentoCard darkMode={darkMode}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">LTV Cliente</p>
                  <p className="text-4xl font-black">142.50€</p>
                  <p className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> Crecimiento de fidelidad
                  </p>
                </BentoCard>
              </div>
            </div>
          </div>
        );

      case 'sop':
        const tasks = getSOPTasks();
        return (
          <div className={`space-y-6 ${animationClass}`}>
            <BentoCard darkMode={darkMode}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500 rounded-[1.5rem] text-white shadow-lg shadow-emerald-500/20">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight leading-tight">Flujo de Trabajo (SOP)</h3>
                    <p className="text-sm text-slate-500">Protocolos y Tareas de FilmmAker Studio</p>
                  </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                  {['Tablero', 'Lista', 'Calendario'].map(v => (
                    <button key={v} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${v === 'Tablero' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tasks.map(t => (
                  <div key={t.id} className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] border-2 border-transparent hover:border-emerald-500/20 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${t.priority === 'Alta' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        {t.priority}
                      </span>
                      <div className="flex -space-x-2">
                        {[1, 2].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800" />)}
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-emerald-500 transition-colors">{t.title}</h4>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 mb-6">
                      <Clock size={12} /> 
                      <span className="uppercase tracking-widest">Plazo: {t.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${t.status === 'Completada' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">{t.status}</span>
                      </div>
                      {/* Fix: ArrowUpRight is now imported */}
                      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        );

      case 'activity':
        const fullLogs = getActivityLogs();
        return (
          <BentoCard darkMode={darkMode}>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight">Registro de Operaciones</h3>
              <div className="flex gap-2">
                <button className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
                  <BarChart4 size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-8 relative before:absolute before:left-[1.85rem] before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-white/5">
              {fullLogs.map((log) => (
                <div key={log.id} className="relative pl-14 group">
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-[1rem] flex items-center justify-center border-4 ${darkMode ? 'border-[#0a0c10]' : 'border-white'} ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'alert' ? 'bg-rose-500' : 'bg-blue-500'} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Zap size={12} className="text-white" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-transparent group-hover:border-slate-200 dark:group-hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{log.message}</p>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-4">{log.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Actualizado automáticamente vía API de Farmacia</p>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        );

      case 'settings':
        return (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${animationClass}`}>
            <BentoCard darkMode={darkMode}>
              <h3 className="text-xl font-black mb-10">Perfil de Gestión</h3>
              <div className="flex items-center space-x-6 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-[6px] border-emerald-500/10 shadow-xl">
                    <img src="https://picsum.photos/seed/teresa/300/300" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
                    {/* Fix: Camera is now imported */}
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight">Teresa García</h4>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Directora Farmacéutica</p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg">PRO</span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-lg">ADMIN</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] flex justify-between items-center group cursor-pointer hover:bg-emerald-500/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información Personal</p>
                      <p className="text-sm font-black italic tracking-tighter">teresa@farmaciabarcelona.com</p>
                    </div>
                  </div>
                  {/* Fix: ArrowUpRight is now imported */}
                  <ArrowUpRight size={18} className="text-slate-300" />
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] flex justify-between items-center group cursor-pointer hover:bg-emerald-500/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seguridad y Permisos</p>
                      <p className="text-sm font-black italic tracking-tighter">Autenticación 2FA Activa</p>
                    </div>
                  </div>
                  {/* Fix: ArrowUpRight is now imported */}
                  <ArrowUpRight size={18} className="text-slate-300" />
                </div>
              </div>
            </BentoCard>
            <BentoCard darkMode={darkMode}>
              <h3 className="text-xl font-black mb-10">FilmmAker Connect</h3>
              <p className="text-sm text-slate-500 mb-8 font-bold">Estado de integraciones digitales en tiempo real</p>
              <div className="space-y-4">
                {['Meta Ads Manager', 'Google Search Console', 'Shopify Warehouse', 'TikTok Business'].map(p => (
                  <div key={p} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/60 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center">
                        <Zap size={18} className="text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{p}</span>
                        <p className="text-[9px] font-bold text-slate-400">Latencia: 14ms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OK</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 bg-slate-900 dark:bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">
                Sincronizar Ecosistema
              </button>
            </BentoCard>
          </div>
        );

      default:
        return (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 italic">Módulo "{activeTab}" en desarrollo para Farmacia Barcelona.</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'dark bg-[#0a0c10]' : 'bg-[#f8fafc]'}`}>
        <div className="w-20 h-20 border-[6px] border-emerald-500 border-t-transparent rounded-full animate-spin mb-8 shadow-2xl shadow-emerald-500/20"></div>
        <p className={`font-black tracking-tighter text-3xl ${darkMode ? 'text-white' : 'text-slate-900'} uppercase animate-pulse`}>
          FARMACIA <span className="text-emerald-500 italic">BARCELONA</span>
        </p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-2">FilmmAker Intelligence</p>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
