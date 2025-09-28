export const GANTTASTIC_PAGE_CODE = `
"use client";

import { useState } from 'react';
import { TASKS, DAYS, STATUSES } from '@/lib/ganttastic-data';
import { GanttChart } from '@/components/ganttastic/GanttChart';
import { SharePointIntegrationHelper } from '@/components/ganttastic/SharePointIntegrationHelper';

const GanttasticPage = () => {
  const [gridStatuses, setGridStatuses] = useState<number[][]>(() =>
    Array(TASKS.length).fill(Array(DAYS.length).fill(0))
  );

  const handleCellClick = (taskIndex: number, dayIndex: number) => {
    setGridStatuses(prevStatuses => {
      const newStatuses = prevStatuses.map(row => [...row]);
      const currentStatusIndex = newStatuses[taskIndex][dayIndex];
      const nextStatusIndex = (currentStatusIndex + 1) % STATUSES.length;
      newStatuses[taskIndex][dayIndex] = nextStatusIndex;
      return newStatuses;
    });
  };

  return (
    <div className="min-h-screen w-full bg-background font-body text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline text-foreground/90">Ganttastic</h1>
            <p className="mt-2 text-muted-foreground">
              An interactive Gantt chart to visualize your project timeline.
            </p>
          </div>
          <SharePointIntegrationHelper />
        </header>

        <main>
          <GanttChart
            tasks={TASKS}
            days={DAYS}
            statuses={STATUSES}
            gridStatuses={gridStatuses}
            onCellClick={handleCellClick}
          />
        </main>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Click on any cell to cycle through task statuses.</p>
        </footer>
      </div>
    </div>
  );
};

export default GanttasticPage;
`;

export const GANTT_CHART_CODE = `
import type { FC } from 'react';
import { type Status } from '@/lib/ganttastic-data';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface GanttChartProps {
  tasks: string[];
  days: string[];
  statuses: Status[];
  gridStatuses: number[][];
  onCellClick: (taskIndex: number, dayIndex: number) => void;
}

export const GanttChart: FC<GanttChartProps> = ({
  tasks,
  days,
  statuses,
  gridStatuses,
  onCellClick,
}) => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700 z-20 w-48 border-r border-b">Task</th>
              {days.map((day, dayIndex) => (
                <th key={dayIndex} className="p-3 text-center text-sm font-medium text-slate-600 w-20 border-b">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, taskIndex) => (
              <tr key={taskIndex} className="border-b border-slate-100 last:border-b-0">
                <td className="sticky left-0 bg-white p-3 text-sm font-medium text-slate-800 z-10 w-48 border-r">
                  {task}
                </td>
                {days.map((_, dayIndex) => {
                  const statusIndex = gridStatuses[taskIndex]?.[dayIndex] ?? 0;
                  const status = statuses[statusIndex];
                  const Icon = status.icon;

                  return (
                    <td
                      key={dayIndex}
                      className={cn(
                        'h-12 w-20 cursor-pointer border-l border-slate-100',
                        'transition-all duration-200 ease-in-out',
                        status.colorClass
                      )}
                      onClick={() => onCellClick(taskIndex, dayIndex)}
                      title={\`\${task} - \${days[dayIndex]}: \${status.name}\`}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
`;

export const GANTTASTIC_DATA_CODE = `
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

export const DAYS: string[] = Array.from({ length: 20 }, (_, i) => \`Day \${i + 1}\`);

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
`;

export const NEXTJS_CODE = `
// File: src/components/ganttastic/GanttasticPage.tsx
${GANTTASTIC_PAGE_CODE}

// File: src/components/ganttastic/GanttChart.tsx
${GANTT_CHART_CODE}

// File: src/lib/ganttastic-data.ts
${GANTTASTIC_DATA_CODE}
`;
