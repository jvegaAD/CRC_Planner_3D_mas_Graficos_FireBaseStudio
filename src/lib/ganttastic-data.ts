import { AlertTriangle, Check, Minus } from 'lucide-react';
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
  name: 'Not Started' | 'Completed' | 'Delayed';
  colorClass: string;
  icon: ComponentType<{ className?: string }>;
}

export const STATUSES: Status[] = [
  {
    name: 'Not Started',
    colorClass: 'bg-white text-slate-500 border-gray-300 shadow-md',
    icon: Minus,
  },
  {
    name: 'Completed',
    colorClass: 'bg-green-500 text-white border-green-700 shadow-lg',
    icon: Check,
  },
  {
    name: 'Delayed',
    colorClass: 'bg-red-500 text-white border-red-700 shadow-lg',
    icon: AlertTriangle,
  },
];
