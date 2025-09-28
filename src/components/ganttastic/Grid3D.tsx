
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
  Label,
  ComposedChart,
} from "recharts";

const tasks = [
  "Losa Fundación",
  "enfierradura",
  "moldaje",
  "hormigón",
  "Ventanas",
  "Cubierta",
];

const defaultDays = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
const daysPerWeek = 5;


// Colores para las líneas del nuevo gráfico
const lineColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];


// Blanco = 0, Verde = 1, Rojo = 2, Celeste = 3
export default function Grid3D({ grid, onGridChange, referenceGrid, days = defaultDays, controlDate }: { grid: number[][], onGridChange?: (grid: number[][]) => void, referenceGrid?: number[][], days?: string[], controlDate?: string }) {
  
  const weeks = Array.from({ length: Math.ceil(days.length / daysPerWeek) }, (_, i) => `Semana ${i + 1}`);
  const controlDateIndex = controlDate ? days.indexOf(controlDate) : -1;
  const controlWeekIndex = controlDateIndex !== -1 ? Math.floor(controlDateIndex / daysPerWeek) : -1;

  // Determina si esta es la Gantt "Programada" basándose en la presencia de onGridChange
  const isProgramadaView = !!onGridChange;


  const handleClick = (row: number, col: number) => {
    // Solo permite hacer clic si no es la vista proyectada (la que no tiene onGridChange)
    if (isProgramadaView && onGridChange) {
        const newGrid = grid.map((r, i) =>
            r.map((cell, j) =>
              i === row && j === col ? (cell + 1) % 4 : cell
            )
          );
        onGridChange(newGrid);
    }
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
    const endDay = Math.min(startDay + daysPerWeek, days.length);
    
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
  
  const gridForNumbering = referenceGrid || grid;

  const totalProjectWorkUnits = gridForNumbering.flat().filter(status => status > 0).length;
  const totalTaskWorkUnits = gridForNumbering.map(row => row.filter(status => status > 0).length);

  const calculateChartData = (targetGrid: number[][]) => {
    const weeklyTotals = weeks.map((weekName, weekIndex) => {
        const startDay = weekIndex * daysPerWeek;
        const endDay = Math.min(startDay + daysPerWeek, days.length);
        
        const weekData: { [key: string]: any } = { 
            week: weekName,
            totalProjected: 0,
            totalCompleted: 0,
            totalScheduled: 0,
        };

        tasks.forEach((task, taskIndex) => {
            weekData[`task_${taskIndex}_projected`] = 0;
            weekData[`task_${taskIndex}_completed`] = 0;
            weekData[`task_${taskIndex}_scheduled`] = 0;
        });

        for (let dayIndex = startDay; dayIndex < endDay; dayIndex++) {
            for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
                const status = targetGrid[taskIndex]?.[dayIndex];
                const refStatus = referenceGrid ? referenceGrid[taskIndex]?.[dayIndex] : status;

                // Projected data from reference grid
                if (refStatus > 0) {
                    weekData.totalProjected++;
                    weekData[`task_${taskIndex}_projected`]++;
                }
                
                // Actual data from target grid
                if (status === 3) { // Completado (cian)
                    weekData.totalCompleted++;
                    weekData[`task_${taskIndex}_completed`]++;
                } else if (status === 1 || status === 2) { // Programado (verde) o Atrasado (rojo)
                    weekData.totalScheduled++;
                    weekData[`task_${taskIndex}_scheduled`]++;
                }
            }
        }
        return weekData;
    });

    // Now, calculate accumulated percentages
    let accTotalProjected = 0;
    let accTotalCompleted = 0;
    let accTotalScheduled = 0;
    const accTaskProjected = Array(tasks.length).fill(0);
    const accTaskCompleted = Array(tasks.length).fill(0);
    const accTaskScheduled = Array(tasks.length).fill(0);

    return weeklyTotals.map(weekData => {
        const result: { [key: string]: any } = { week: weekData.week };

        accTotalProjected += weekData.totalProjected;
        accTotalCompleted += weekData.totalCompleted;
        accTotalScheduled += weekData.totalScheduled;

        result.projected = totalProjectWorkUnits > 0 ? (accTotalProjected / totalProjectWorkUnits) * 100 : 0;
        result.completed = totalProjectWorkUnits > 0 ? (accTotalCompleted / totalProjectWorkUnits) * 100 : 0;
        // The "scheduled" value needs to be stacked on top of "completed" for the chart
        result.scheduled = result.completed + (totalProjectWorkUnits > 0 ? (accTotalScheduled / totalProjectWorkUnits) * 100 : 0);
        
        tasks.forEach((task, taskIndex) => {
            accTaskProjected[taskIndex] += weekData[`task_${taskIndex}_projected`];
            accTaskCompleted[taskIndex] += weekData[`task_${taskIndex}_completed`];
            accTaskScheduled[taskIndex] += weekData[`task_${taskIndex}_scheduled`];
            
            const totalUnitsForTask = totalTaskWorkUnits[taskIndex];
            result[`${task} (Proy.)`] = totalUnitsForTask > 0 ? (accTaskProjected[taskIndex] / totalUnitsForTask) * 100 : 0;
            result[`${task} (Comp.)`] = totalUnitsForTask > 0 ? (accTaskCompleted[taskIndex] / totalUnitsForTask) * 100 : 0;
            result[`${task} (Prog.)`] = result[`${task} (Comp.)`] + (totalUnitsForTask > 0 ? (accTaskScheduled[taskIndex] / totalUnitsForTask) * 100 : 0);
        });

        return result;
    });
};

  const chartData = calculateChartData(grid);

  // Trim data for Programada view
  let finalChartData = [...chartData];
  if (isProgramadaView && controlWeekIndex !== -1) {
      const displayUntilWeekIndex = Math.min(controlWeekIndex + 3, weeks.length - 1);
      finalChartData = chartData.slice(0, controlWeekIndex + 1);

      // Add projected data for future weeks
      for (let i = controlWeekIndex + 1; i <= displayUntilWeekIndex; i++) {
          const futureWeekData = { ...chartData[i] };
          // Nullify real data for future weeks
          futureWeekData.completed = null;
          futureWeekData.scheduled = null;
          tasks.forEach(task => {
              futureWeekData[`${task} (Comp.)`] = null;
              futureWeekData[`${task} (Prog.)`] = null;
          });
          finalChartData.push(futureWeekData);
      }
  }


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

  const percentageFormatter = (value: number) => value == null ? '' : `${value.toFixed(1)}%`;

  return (
    <div className="w-full space-y-10">
      {/* 🔲 Cuadrícula */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th rowSpan={2} className="px-4 py-2 border bg-gray-200 align-bottom">Actividad</th>
              {weeks.map((week, weekIndex) => (
                <th key={weekIndex} colSpan={Math.min(daysPerWeek, days.length - (weekIndex * daysPerWeek))} className="px-4 py-2 border bg-gray-100 text-center">
                  {week}
                </th>
              ))}
            </tr>
            <tr>
              {days.map((day, index) => (
                <th key={index} className={cn("px-4 py-2 border bg-gray-50 font-normal text-xs", controlDateIndex === index && 'bg-yellow-200')}>
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
                    <td key={colIndex} className={cn("px-2 py-2 border", controlDateIndex === colIndex && 'bg-yellow-100/70')}>
                      <div
                        onClick={() => handleClick(rowIndex, colIndex)}
                        className={cn(
                          "w-12 h-12 rounded-lg transition-all flex items-center justify-center font-bold text-lg",
                           isProgramadaView ? "cursor-pointer" : "cursor-default",
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
        {/* 📈 Línea acumulada por tarea */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📈 % Acumulado Semanal por Tarea
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tickFormatter={percentageFormatter}>
                 <Label value="% Avance" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={percentageFormatter} />
              <Legend />
              {tasks.map((task, index) => (
                <Line
                  key={`${task}-comp`}
                  type="monotone"
                  dataKey={`${task} (Comp.)`}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={3}
                  name={`${task} (Completado)`}
                  dot={{ r: 4 }}
                  connectNulls
                />
              ))}
               {tasks.map((task, index) => (
                <Line
                  key={`${task}-prog`}
                  type="monotone"
                  dataKey={`${task} (Prog.)`}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  name={`${task} (Prog/Atras.)`}
                  dot={false}
                  connectNulls
                />
              ))}
              {isProgramadaView && tasks.map((task, index) => (
                <Line
                  key={`${task}-proy`}
                  type="monotone"
                  dataKey={`${task} (Proy.)`}
                  stroke={'#b1b1b1'}
                  strokeWidth={2}
                  name={`${task} (Proyectado)`}
                  strokeDasharray="3 3"
                  dot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Curva S */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📈 Curva "S" - % Acumulado General del Proyecto
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tickFormatter={percentageFormatter}>
                <Label value="% Avance" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={percentageFormatter} />
              <Legend />
               {isProgramadaView && <Line
                type="monotone"
                dataKey="projected"
                stroke="#FA8072" // salmón
                strokeWidth={2}
                name="Progreso Proyectado"
                strokeDasharray="3 3"
                dot={{ r: 5 }}
                connectNulls
              />}
              <Line
                type="monotone"
                dataKey="scheduled"
                stroke="#ff7300" // naranja
                strokeWidth={2}
                name="Progreso Prog./Atras."
                strokeDasharray="8 4"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#00008B" // azul oscuro
                strokeWidth={3}
                name="Progreso Real Completado"
                dot={{ r: 5 }}
                connectNulls
              />
            </ComposedChart>
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
