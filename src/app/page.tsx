
"use client";
import { useState } from "react";
import Grid3D from "@/components/ganttastic/Grid3D";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tasks = [
  "Losa Fundación",
  "enfierradura",
  "moldaje",
  "hormigón",
  "Ventas",
  "Cubierta",
];
const days = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);

// Grilla proyectada con todo en estado "Completado" (3)
const projectedGrid = tasks.map(() => days.map(() => 3));
// Grilla semanal que inicia vacía (0)
const weeklyGrid = tasks.map(() => days.map(() => 0));

export default function Home() {
  const [view, setView] = useState<"proyectada" | "semanal">("proyectada");

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl">
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
           <h1 className="text-2xl font-bold mb-6 text-center">📊 Programa General Proyectado</h1>
           <Grid3D initialGrid={projectedGrid} />
        </div>

        <div className={cn(view !== "semanal" && "hidden")}>
           <h1 className="text-2xl font-bold mb-6 text-center">📊 Programa General Semanal</h1>
           <Grid3D initialGrid={weeklyGrid} />
        </div>

      </div>
    </main>
  );
}
