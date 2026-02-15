
import { ContentItem, ActivityLog, FinancialData, FunnelData, Task, SEOKeyword } from '../types';

export const getHeroMetrics = (period: string) => ({
  reach: { value: 12450, trend: 12.5 },
  roi: { value: '3.2x', trend: 0.8 },
  followers: { value: 5040, trend: 4.2 },
  newClients: { value: 145, trend: 15.2 },
  engagement: { value: '4.5%', trend: -0.5 },
});

export const getCampaignMetrics = () => ({
  spend: { value: '1.240€', trend: -5.2 },
  ctr: { value: '2.84%', trend: 12.1 },
  cpc: { value: '0.42€', trend: -8.4 },
  conversions: { value: 64, trend: 18.5 },
  roas: { value: '4.8x', trend: 4.2 },
});

export const getFunnelData = (): FunnelData[] => [
  { name: 'Impresiones', value: 45000, label: '45k' },
  { name: 'Interacción', value: 12000, label: '12k' },
  { name: 'Clics Perfil', value: 3500, label: '3.5k' },
  { name: 'Visitas Web/Maps', value: 1200, label: '1.2k' },
  { name: 'Conversiones', value: 240, label: '240' },
];

export const getSocialDetailedMetrics = () => [
  { platform: 'Instagram', followers: 4200, growth: 120, engagement: '5.2%', topPost: 'Rutina Skincare' },
  { platform: 'TikTok', followers: 840, growth: 45, engagement: '8.1%', topPost: 'Consejos Sol' },
  { platform: 'Facebook', followers: 1200, growth: -5, engagement: '1.2%', topPost: 'Horario Verano' },
];

export const getContentPerformance = (): ContentItem[] => [
  { id: '1', title: 'Rutina de Skincare Noche', type: 'Reel', platform: 'Instagram', reach: 8500, engagement: '6.2%', clicks: 420, conversions: 28, status: 'published' },
  { id: '2', title: '5 Consejos para el Sol', type: 'TikTok', platform: 'TikTok', reach: 12400, engagement: '4.8%', clicks: 310, conversions: 12, status: 'published' },
  { id: '3', title: 'Promoción Colágeno 2x1', type: 'Post', platform: 'Instagram', reach: 3200, engagement: '3.1%', clicks: 150, conversions: 45, status: 'published' },
  { id: '4', title: 'Q&A Medicación Invierno', type: 'Story', platform: 'Instagram', reach: 1800, engagement: '12.4%', clicks: 85, conversions: 5, status: 'published' },
  { id: '5', title: 'Nuevos Horarios Agosto', type: 'GBP', platform: 'Google', reach: 4500, engagement: '2.5%', clicks: 890, conversions: 110, status: 'published' },
  { id: '6', title: 'Cuidado Capilar Bio', type: 'Reel', platform: 'Instagram', reach: 0, engagement: '0%', clicks: 0, conversions: 0, status: 'planned' },
];

export const getActivityLogs = (): ActivityLog[] => [
  { id: '1', time: 'Hace 5m', message: '¡Hito alcanzado! 5.000 seguidores en Instagram 🎉', type: 'success' },
  { id: '2', time: 'Hace 2h', message: 'El Reel "Rutina Skincare" está rindiendo un 40% mejor de lo habitual.', type: 'alert' },
  { id: '3', time: 'Hace 5h', message: 'Nueva solicitud de ruta desde Google Maps para "Protector Solar".', type: 'info' },
  { id: '4', time: 'Ayer', message: 'Contenido "Cuidado Capilar" aprobado por Teresa.', type: 'info' },
  { id: '5', time: 'Ayer', message: 'Actualización de stock de "Vitamina C" reflejada en Web.', type: 'success' },
];

export const getFinancialPerformance = (): FinancialData[] => [
  { month: 'Ene', sales: 42000, target: 40000, lastYear: 38000 },
  { month: 'Feb', sales: 43500, target: 41000, lastYear: 39500 },
  { month: 'Mar', sales: 46200, target: 45000, lastYear: 41000 },
  { month: 'Abr', sales: 44800, target: 45000, lastYear: 42500 },
  { month: 'May', sales: 48500, target: 47000, lastYear: 44000 },
  { month: 'Jun', sales: 45000, target: 48000, lastYear: 46000 },
];

export const getSOPTasks = (): Task[] => [
  { id: '1', title: 'Grabar 3 Reels Skincare', assignee: 'FilmmAker', deadline: 'Mañana', priority: 'Alta', status: 'En Proceso' },
  { id: '2', title: 'Revisar Google My Business', assignee: 'Teresa', deadline: 'Viernes', priority: 'Media', status: 'Pendiente' },
  { id: '3', title: 'Subir Blog sobre Alergias', assignee: 'Web Master', deadline: 'Hoy', priority: 'Alta', status: 'Completada' },
  { id: '4', title: 'Planificar Ads de Octubre', assignee: 'FilmmAker', deadline: '30 Sep', priority: 'Baja', status: 'Pendiente' },
];

export const getSEOKeywords = (): SEOKeyword[] => [
  { keyword: 'farmacia barcelona 24h', position: 2, change: 1, volume: '12k' },
  { keyword: 'mejor protector solar 2024', position: 5, change: -2, volume: '8k' },
  { keyword: 'dermocosmética profesional', position: 8, change: 4, volume: '3k' },
  { keyword: 'comprar colágeno marino', position: 12, change: 0, volume: '5k' },
];
