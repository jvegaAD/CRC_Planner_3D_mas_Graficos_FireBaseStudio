"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const tasks = [
  "Fundaciones",
  "Hormigón",
  "Albañilería",
  "Aislamiento",
  "Instalaciones",
];

const days = ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5"];

// Blanco = 0, Verde = 1, Rojo = 2, Celeste = 3
export default function Grid3D() {
  const [grid, setGrid] = useState<number[][]>(
    tasks.map(() => days.map(() => 0))
  );

  const handleClick = (row: number, col: number) => {
    setGrid((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col ? (cell + 1) % 4 : cell
        )
      )
    );
  };

  const getColor = (state: number) => {
    switch (state) {
      case 1:
        return "bg-green-500"; // Programado
      case 2:
        return "bg-red-500"; // Atrasado
      case 3:
        return "bg-cyan-500"; // Completado
      default:
        return "bg-white"; // Sin programar
    }
  };

  // Calcular acumulado por día con desglose por color
  const barData = days.map((_, colIndex) => {
    let verde = 0;
    let rojo = 0;
    let celeste = 0;
    tasks.forEach((_, rowIndex) => {
      if (grid[rowIndex][colIndex] === 1) verde += 1;
      if (grid[rowIndex][colIndex] === 2) rojo += 1;
      if (grid[rowIndex][colIndex] === 3) celeste += 1;
    });
    return {
      day: `D${colIndex + 1}`,
      programado: verde,
      atrasado: rojo,
      completado: celeste,
    };
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border bg-gray-200">Actividad</th>
              {days.map((day, index) => (
                <th key={index} className="px-4 py-2 border bg-gray-100">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2 border font-medium bg-gray-50">
                  {task}
                </td>
                {days.map((_, colIndex) => (
                  <td key={colIndex} className="px-2 py-2 border">
                    <div
                      onClick={() => handleClick(rowIndex, colIndex)}
                      className={cn(
                        "w-12 h-12 cursor-pointer rounded-lg transition-all",
                        getColor(grid[rowIndex][colIndex])
                      )}
                      style={{
                        boxShadow: `
                          0px 6px 0px rgba(0,0,0,0.25),
                          3px 6px 10px rgba(0,0,0,0.35)
                        `,
                        marginBottom: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 Gráfico acumulado por color */}
      <div className="mt-10 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          📊 Estado de Actividades por Día
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="programado" stackId="a" fill="#22c55e" name="Programado" />
            <Bar dataKey="atrasado" stackId="a" fill="#ef4444" name="Atrasado" />
            <Bar dataKey="completado" stackId="a" fill="#06b6d4" name="Completado" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
