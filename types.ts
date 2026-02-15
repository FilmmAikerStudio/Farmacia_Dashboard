
import React from 'react';

export type Period = '7d' | '30d' | '90d' | 'custom';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color?: string;
}

export interface FunnelData {
  name: string;
  value: number;
  label: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'Reel' | 'Story' | 'Post' | 'TikTok' | 'GBP';
  platform: 'Instagram' | 'TikTok' | 'Google' | 'Web';
  reach: number;
  engagement: string;
  clicks: number;
  conversions: number;
  status: 'published' | 'planned' | 'draft' | 'pending';
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

export interface FinancialData {
  month: string;
  sales: number;
  target: number;
  lastYear: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  priority: 'Baja' | 'Media' | 'Alta';
  status: 'Pendiente' | 'En Proceso' | 'Completada';
}

export interface SEOKeyword {
  keyword: string;
  position: number;
  change: number;
  volume: string;
}
