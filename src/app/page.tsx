
"use client";
import { useState } from "react";
import Grid3D from "@/components/ganttastic/Grid3D";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SharePointIntegrationHelper } from "@/components/ganttastic/SharePointIntegrationHelper";

const tasks = [
  "Losa Fundación",
  "enfierradura",
  "moldaje",
  "hormigón",
  "Ventanas",
  "Cubierta",
];
const days = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
const startDays = [1, 3, 6, 9, 12, 16]; // Días de inicio para cada tarea

// Grilla proyectada con inicios diferidos y estado "Completado"
const projectedGrid = tasks.map((_, rowIndex) => {
  const startDayForTask = startDays[rowIndex];
  return days.map((_, colIndex) => {
    const currentDay = colIndex + 1;
    // 3: Completado, 0: Vacío
    return currentDay >= startDayForTask ? 3 : 0;
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
           <Grid3D initialGrid={projectedGrid} />
        </div>

        <div className={cn(view !== "semanal" && "hidden")}>
           <h2 className="text-2xl font-bold mb-6 text-center">📊 Programa General Semanal</h2>
           <Grid3D initialGrid={weeklyGrid} referenceGrid={projectedGrid} />
        </div>

      </div>
    </main>
  );
}
