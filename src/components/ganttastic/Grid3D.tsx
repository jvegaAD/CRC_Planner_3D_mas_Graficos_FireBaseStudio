
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
  "Losa Fundación",
  "enfierradura",
  "moldaje",
  "hormigón",
  "Ventanas",
  "Cubierta",
];

const days = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
const daysPerWeek = 4;
const weeks = Array.from({ length: days.length / daysPerWeek }, (_, i) => `Semana ${i + 1}`);

// Colores para las líneas del nuevo gráfico
const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];


// Blanco = 0, Verde = 1, Rojo = 2, Celeste = 3
export default function Grid3D({ initialGrid, referenceGrid }: { initialGrid?: number[][], referenceGrid?: number[][] }) {
  const [grid, setGrid] = useState<number[][]>(
    initialGrid || tasks.map(() => days.map(() => 0))
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

  // 📊 Dataset por semana (apiladas + acumulado)
  const weeklyData = weeks.map((_, weekIndex) => {
    let verde = 0, rojo = 0, celeste = 0;
    const startDay = weekIndex * daysPerWeek;
    const endDay = startDay + daysPerWeek;
    
    for (let colIndex = startDay; colIndex < endDay; colIndex++) {
      tasks.forEach((_, rowIndex) => {
        if (grid[rowIndex][colIndex] === 1) verde++;
        if (grid[rowIndex][colIndex] === 2) rojo++;
        if (grid[rowIndex][colIndex] === 3) celeste++;
      });
    }

    return {
      week: `Semana ${weekIndex + 1}`,
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

  // 📊 Nuevo: Dataset para el gráfico de líneas acumulado por tarea
  const weeklyTaskAccumulatedData = weeks.map((weekName, weekIndex) => {
    const weekEntry: { [key: string]: any } = { week: weekName };
    tasks.forEach((task, taskIndex) => {
      let accumulatedValue = 0;
      for (let w = 0; w <= weekIndex; w++) {
        const startDay = w * daysPerWeek;
        const endDay = startDay + daysPerWeek;
        for (let dayIndex = startDay; dayIndex < endDay; dayIndex++) {
          if (grid[taskIndex][dayIndex] > 0) { // Contar cualquier estado que no sea "Sin programar"
            accumulatedValue++;
          }
        }
      }
      weekEntry[task] = accumulatedValue;
    });
    return weekEntry;
  });
  
  const gridForNumbering = referenceGrid || grid;

  return (
    <div className="w-full space-y-10">
      {/* 🔲 Cuadrícula */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th rowSpan={2} className="px-4 py-2 border bg-gray-200 align-bottom">Actividad</th>
              {weeks.map((week, weekIndex) => (
                <th key={weekIndex} colSpan={daysPerWeek} className="px-4 py-2 border bg-gray-100 text-center">
                  {week}
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
            {tasks.map((task, rowIndex) => {
              // Encuentra el primer día programado en la cuadrícula de referencia para la numeración
              const firstScheduledDayIndex = gridForNumbering[rowIndex].findIndex(status => status > 0);

              return (
              <tr key={rowIndex}>
                <td className="px-4 py-2 border font-medium bg-gray-50">
                  {task}
                </td>
                {days.map((_, colIndex) => {
                  let locationNumber: number | null = null;
                   // Si la celda está programada (en la cuadrícula de referencia) y sabemos dónde empieza la tarea
                  if (gridForNumbering[rowIndex][colIndex] > 0 && firstScheduledDayIndex !== -1) {
                      locationNumber = colIndex - firstScheduledDayIndex + 1;
                  }

                  return (
                    <td key={colIndex} className="px-2 py-2 border">
                      <div
                        onClick={() => handleClick(rowIndex, colIndex)}
                        className={cn(
                          "w-12 h-12 cursor-pointer rounded-lg transition-all flex items-center justify-center font-bold text-lg",
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
                        title={`${task} - ${days[colIndex]}`}
                      >
                        {locationNumber}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {/* 📈 Nuevo: Línea acumulada por tarea */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📈 Acumulado Semanal por Tarea
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTaskAccumulatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {tasks.map((task, index) => (
                <Line
                  key={task}
                  type="monotone"
                  dataKey={task}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  name={task}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Barras apiladas */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📊 Estado de Actividades por Semana
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
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
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📈 Acumulado por Estado (semana a semana)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
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
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
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
    </div>
  );
}
