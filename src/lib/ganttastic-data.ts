import { AlertTriangle, Check, Minus } from 'lucide-react';
import type { ComponentType } from 'react';

export const TASKS: string[] = [
  'Fundaciones',
  'Hormigón',
  'Albañilería',
  'Aislamiento',
  'Instalaciones',
  'Pintura',
  'Acabados',
  'Paisajismo',
];

export const DAYS: string[] = Array.from({ length: 15 }, (_, i) => `Día ${i + 1}`);

export interface Status {
  name: 'Pendiente' | 'Completado' | 'Retrasado';
  colorClass: string;
  icon: ComponentType<{ className?: string }>;
}

export const STATUSES: Status[] = [
  {
    name: 'Pendiente',
    colorClass: 'bg-white text-slate-400',
    icon: Minus,
  },
  {
    name: 'Completado',
    colorClass: 'bg-green-500 text-white',
    icon: Check,
  },
  {
    name: 'Retrasado',
    colorClass: 'bg-red-500 text-white',
    icon: AlertTriangle,
  },
];
