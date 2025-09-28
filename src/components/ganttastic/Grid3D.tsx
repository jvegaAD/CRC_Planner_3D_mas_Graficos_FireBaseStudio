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
  LineChart,
  Line,
} from "recharts";

const tasks = [
  "Fundaciones",
  "Hormigón",
  "Albañilería",
  "Aislamiento",
  "Instalaciones",
];

const days = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
const daysPerWeek = 4;

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

  // 📊 Dataset por día (apiladas + acumulado)
  const barData = days.map((_, colIndex) => {
    let verde = 0, rojo = 0, celeste = 0;
    tasks.forEach((_, rowIndex) => {
      if (grid[rowIndex][colIndex] === 1) verde++;
      if (grid[rowIndex][colIndex] === 2) rojo++;
      if (grid[rowIndex][colIndex] === 3) celeste++;
    });
    return {
      day: `D${colIndex + 1}`,
      programado: verde,
      atrasado: rojo,
      completado: celeste,
      total: verde + rojo + celeste,
    };
  });

  // 📊 Dataset por tarea (horizontal)
  const taskData = tasks.map((task, rowIndex) => {
    let verde = 0, rojo = 0, celeste = 0;
    days.forEach((_, colIndex) => {
      if (grid[rowIndex][colIndex] === 1) verde++;
      if (grid[rowIndex][colIndex] === 2) rojo++;
      if (grid[rowIndex][colIndex] === 3) celeste++;
    });
    return { tarea: task, programado: verde, atrasado: rojo, completado: celeste };
  });

  return (
    <div className="w-full space-y-10">
      {/* 🔲 Cuadrícula */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
             <tr>
              <th rowSpan={2} className="px-4 py-2 border bg-gray-200 align-bottom">Actividad</th>
              {Array.from({ length: days.length / daysPerWeek }).map((_, weekIndex) => (
                <th key={weekIndex} colSpan={daysPerWeek} className="px-4 py-2 border bg-gray-100 text-center">
                  Semana {weekIndex + 1}
                </th>
              ))}
            </tr>
            <tr>
              {days.map((day, index) => (
                <th key={index} className="px-4 py-2 border bg-gray-50 font-normal">
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

      {/* 📊 Barras apiladas */}
      <div className="bg-white p-4 rounded-lg shadow-md">
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

      {/* 📈 Línea acumulada por estado */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          📈 Acumulado por Estado (día a día)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="programado"
              stroke="#22c55e"
              strokeWidth={3}
              name="Programado"
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="atrasado"
              stroke="#ef4444"
              strokeWidth={3}
              name="Atrasado"
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="completado"
              stroke="#06b6d4"
              strokeWidth={3}
              name="Completado"
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Barras horizontales por tarea */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          📊 Estado por Tarea
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="tarea" width={100} />
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
