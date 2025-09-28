
"use client";
import { useState } from "react";
import Grid3D from "@/components/ganttastic/Grid3D";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SharePointIntegrationHelper } from "@/components/ganttastic/SharePointIntegrationHelper";
import { addDays, isSaturday, isSunday, format } from 'date-fns';

const tasks = [
  "Losa Fundación",
  "enfierradura",
  "moldaje",
  "hormigón",
  "Ventanas",
  "Cubierta",
];

// Función para generar las fechas de los días laborables
const generateWorkingDays = (startDate: Date, count: number): string[] => {
  const days: string[] = [];
  let currentDate = startDate;
  while (days.length < count) {
    if (!isSaturday(currentDate) && !isSunday(currentDate)) {
      days.push(format(currentDate, 'd/M'));
    }
    currentDate = addDays(currentDate, 1);
  }
  return days;
};


const days = generateWorkingDays(new Date(2025, 8, 8), 35); // 8 de Septiembre, 35 días = 7 semanas
const startDays = [1, 3, 6, 9, 12, 16]; // Días de inicio para cada tarea
const taskDuration = 20; // Cada tarea dura 20 días laborables

// Grilla proyectada con duraciones fijas
const projectedGrid = tasks.map((_, rowIndex) => {
  const startDayForTask = startDays[rowIndex];
  return days.map((_, colIndex) => {
    const currentDay = colIndex + 1;
    // La tarea está activa si el día actual está entre su inicio y su duración de 20 días.
    const isTaskActive = currentDay >= startDayForTask && currentDay < startDayForTask + taskDuration;
    // 3: Completado, 0: Vacío
    return isTaskActive ? 3 : 0;
  });
});

// Grilla semanal que inicia vacía (0)
const weeklyGrid = tasks.map(() => days.map(() => 0));

export default function Home() {
  const [view, setView] = useState<"proyectada" | "semanal">("proyectada");

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-4xl font-bold">Ganttastic</h1>
            <SharePointIntegrationHelper />
        </header>

        <div className="flex justify-center mb-6 gap-4">
          <Button
            onClick={() => setView("proyectada")}
            variant={view === "proyectada" ? "default" : "outline"}
          >
            Carta Gantt Proyectada
          </Button>
          <Button
            onClick={() => setView("semanal")}
            variant={view === "semanal" ? "default" : "outline"}
          >
            Carta Gantt Programada Semanal
          </Button>
        </div>

        <div className={cn(view !== "proyectada" && "hidden")}>
           <h2 className="text-2xl font-bold mb-6 text-center">📊 Programa General Proyectado</h2>
           <Grid3D initialGrid={projectedGrid} days={days} />
        </div>

        <div className={cn(view !== "semanal" && "hidden")}>
           <h2 className="text-2xl font-bold mb-6 text-center">📊 Programa General Semanal</h2>
           <Grid3D initialGrid={weeklyGrid} referenceGrid={projectedGrid} days={days} />
        </div>

      </div>
    </main>
  );
}
