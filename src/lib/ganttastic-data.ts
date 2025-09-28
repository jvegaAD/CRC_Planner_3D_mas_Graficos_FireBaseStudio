import { AlertTriangle, Check, Minus, Play } from 'lucide-react';
import type { ComponentType } from 'react';

export const TASKS: string[] = [
  'Foundation',
  'Concrete Pour',
  'Framing',
  'Roofing',
  'Plumbing & Electrical',
  'Insulation',
  'Drywall',
  'Painting',
  'Installations',
  'Landscaping',
];

export const DAYS: string[] = Array.from({ length: 20 }, (_, i) => `Day ${i + 1}`);

export interface Status {
  name: 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
  colorClass: string;
  icon: ComponentType<{ className?: string }>;
}

export const STATUSES: Status[] = [
  {
    name: 'Not Started',
    colorClass: 'bg-slate-100 hover:bg-slate-200 text-slate-500',
    icon: Minus,
  },
  {
    name: 'In Progress',
    colorClass: 'bg-sky-200 hover:bg-sky-300 text-sky-800',
    icon: Play,
  },
  {
    name: 'Blocked',
    colorClass: 'bg-amber-200 hover:bg-amber-300 text-amber-800',
    icon: AlertTriangle,
  },
  {
    name: 'Completed',
    colorClass: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-800',
    icon: Check,
  },
];
