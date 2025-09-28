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
      const currentStatusIndex = newStatuses[taskIndex]?.[dayIndex] ?? 0;
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
            <h1 className="text-4xl font-bold font-headline text-foreground/90">📊 Planner 3D Interactivo</h1>
            <p className="mt-2 text-muted-foreground">
              Visualiza el cronograma de tu proyecto con una vista 3D interactiva.
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
          <p>Haz clic en cualquier celda para cambiar el estado de la tarea.</p>
        </footer>
      </div>
    </div>
  );
};

export default GanttasticPage;
