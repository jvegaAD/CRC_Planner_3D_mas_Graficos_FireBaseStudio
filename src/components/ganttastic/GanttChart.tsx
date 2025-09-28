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
                      title={`${task} - ${days[dayIndex]}: ${status.name}`}
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
