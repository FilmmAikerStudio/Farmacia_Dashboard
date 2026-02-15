
import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Clapperboard, 
  Globe2, 
  Wallet, 
  ShieldCheck, 
  Activity, 
  Settings2
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Resumen', icon: <LayoutDashboard size={22} />, path: '/' },
  { id: 'social', label: 'Social', icon: <BarChart3 size={22} />, path: '/social' },
  { id: 'content', label: 'Contenido', icon: <Clapperboard size={22} />, path: '/content' },
  { id: 'web', label: 'SEO/Web', icon: <Globe2 size={22} />, path: '/web' },
  { id: 'roi', label: 'ROI', icon: <Wallet size={22} />, path: '/roi' },
  { id: 'sop', label: 'SOP', icon: <ShieldCheck size={22} />, path: '/sop' },
  { id: 'activity', label: 'Log', icon: <Activity size={22} />, path: '/activity' },
  { id: 'settings', label: 'Ajustes', icon: <Settings2 size={22} />, path: '/settings' },
];

export const THEME_COLORS = {
  emerald: {
    light: '#10b981',
    dark: '#059669',
    gradient: 'from-emerald-500 to-teal-600'
  },
  blue: {
    light: '#3b82f6',
    dark: '#2563eb',
    gradient: 'from-blue-500 to-indigo-600'
  },
  violet: {
    light: '#8b5cf6',
    dark: '#7c3aed',
    gradient: 'from-violet-500 to-purple-600'
  }
};
