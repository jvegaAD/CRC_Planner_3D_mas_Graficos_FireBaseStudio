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
    <Card className="overflow-hidden shadow-lg bg-gray-100 p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="sticky left-0 bg-gray-100 p-3 text-left text-sm font-semibold text-slate-700 z-20 w-48 border-b">Task</th>
              {days.map((day, dayIndex) => (
                <th key={dayIndex} className="p-3 text-center text-sm font-medium text-slate-600 w-24 border-b">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {tasks.map((task, taskIndex) => (
              <tr key={taskIndex} className="border-b border-slate-200 last:border-b-0">
                <td className="sticky left-0 bg-gray-100 p-3 text-sm font-medium text-slate-800 z-10 w-48 border-r">
                  {task}
                </td>
                {days.map((_, dayIndex) => {
                  const statusIndex = gridStatuses[taskIndex]?.[dayIndex] ?? 0;
                  const status = statuses[statusIndex];
                  
                  return (
                    <td
                      key={dayIndex}
                      className="p-2 border border-transparent"
                    >
                      <div
                        onClick={() => onCellClick(taskIndex, dayIndex)}
                        className={cn(
                          'w-12 h-12 cursor-pointer rounded-lg transform transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 border',
                          status.colorClass
                        )}
                        style={{
                          boxShadow: "2px 2px 6px rgba(0,0,0,0.3), inset 1px 1px 1px rgba(255,255,255,0.4)",
                          textShadow: "0px 1px 1px rgba(0,0,0,0.2)"
                        }}
                        title={`${task} - ${days[dayIndex]}: ${status.name}`}
                      >
                         <div className="flex h-full w-full items-center justify-center">
                          <status.icon className="h-6 w-6" />
                        </div>
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
