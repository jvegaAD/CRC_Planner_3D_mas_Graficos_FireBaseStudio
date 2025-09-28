
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
export default function Grid3D({ initialGrid, referenceGrid, days = defaultDays, controlDate }: { initialGrid?: number[][], referenceGrid?: number[][], days?: string[], controlDate?: string }) {
  const [grid, setGrid] = useState<number[][]>(
    initialGrid || tasks.map(() => days.map(() => 0))
  );

  const weeks = Array.from({ length: Math.ceil(days.length / daysPerWeek) }, (_, i) => `Semana ${i + 1}`);
  const controlDateIndex = controlDate ? days.indexOf(controlDate) : -1;
  const controlWeekIndex = controlDateIndex !== -1 ? Math.floor(controlDateIndex / daysPerWeek) : -1;

  // Determina si esta es la Gantt "Programada" basándose en la presencia de referenceGrid
  const isProgramadaView = !!referenceGrid;


  const handleClick = (row: number, col: number) => {
    // Solo permite hacer clic si no es la vista proyectada (la que no tiene referenceGrid)
    if (isProgramadaView) {
        setGrid((prev) =>
          prev.map((r, i) =>
            r.map((cell, j) =>
              i === row && j === col ? (cell + 1) % 4 : cell
            )
          )
        );
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
      let runningTotal = 0;
      const sCurve = weeks.map((weekName, weekIndex) => {
          const startDay = weekIndex * daysPerWeek;
          const endDay = Math.min(startDay + daysPerWeek, days.length);
          let weeklyTotal = 0;
          for (let dayIndex = startDay; dayIndex < endDay; dayIndex++) {
              for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
                  if (targetGrid[taskIndex][dayIndex] > 0) {
                      weeklyTotal++;
                  }
              }
          }
          runningTotal += weeklyTotal;
          const percentage = totalProjectWorkUnits > 0 ? (runningTotal / totalProjectWorkUnits) * 100 : 0;
          return {
              week: weekName,
              value: parseFloat(percentage.toFixed(1))
          };
      });

      const taskAccumulated = weeks.map((weekName, weekIndex) => {
          const weekEntry: { [key: string]: any } = { week: weekName };
          tasks.forEach((task, taskIndex) => {
              let accumulatedValue = 0;
              for (let w = 0; w <= weekIndex; w++) {
                  const startDay = w * daysPerWeek;
                  const endDay = Math.min(startDay + daysPerWeek, days.length);
                  for (let dayIndex = startDay; dayIndex < endDay; dayIndex++) {
                      if (targetGrid[taskIndex][dayIndex] > 0) {
                          accumulatedValue++;
                      }
                  }
              }
              const totalUnitsForTask = totalTaskWorkUnits[taskIndex];
              const percentage = totalUnitsForTask > 0 ? (accumulatedValue / totalUnitsForTask) * 100 : 0;
              weekEntry[task] = parseFloat(percentage.toFixed(1));
          });
          return weekEntry;
      });

      return { sCurve, taskAccumulated };
  };

  const { sCurve: actualSCurve, taskAccumulated: actualTaskAccumulated } = calculateChartData(grid);
  const { sCurve: projectedSCurve, taskAccumulated: projectedTaskAccumulated } = isProgramadaView ? calculateChartData(referenceGrid!) : { sCurve: [], taskAccumulated: [] };

  // Combina los datos para los gráficos
  let combinedSCurveData = actualSCurve.map((d, i) => ({
      week: d.week,
      real: d.value,
      proyectado: projectedSCurve[i]?.value,
  }));

  let combinedTaskAccumulatedData = actualTaskAccumulated.map((d, i) => {
      const combinedEntry: { [key: string]: any } = { week: d.week };
      tasks.forEach(task => {
          combinedEntry[`${task} (Real)`] = d[task];
          if (projectedTaskAccumulated[i]) {
              combinedEntry[`${task} (Proy.)`] = projectedTaskAccumulated[i][task];
          }
      });
      return combinedEntry;
  });

  if (isProgramadaView && controlWeekIndex !== -1) {
      const displayUntilWeekIndex = Math.min(controlWeekIndex + 3, weeks.length - 1);
      
      combinedSCurveData = combinedSCurveData.slice(0, controlWeekIndex + 1);
      combinedTaskAccumulatedData = combinedTaskAccumulatedData.slice(0, controlWeekIndex + 1);
      
      for (let i = controlWeekIndex + 1; i <= displayUntilWeekIndex; i++) {
          combinedSCurveData.push({
              week: weeks[i],
              real: null,
              proyectado: projectedSCurve[i]?.value,
          });

          const taskEntry: { [key: string]: any } = { week: weeks[i] };
          tasks.forEach(task => {
              taskEntry[`${task} (Real)`] = null;
              if (projectedTaskAccumulated[i]) {
                  taskEntry[`${task} (Proy.)`] = projectedTaskAccumulated[i][task];
              }
          });
          combinedTaskAccumulatedData.push(taskEntry);
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

  const percentageFormatter = (value: number) => `${value}%`;

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
            <LineChart data={combinedTaskAccumulatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tickFormatter={percentageFormatter}>
                 <Label value="% Avance" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={percentageFormatter} />
              <Legend />
              {tasks.map((task, index) => (
                <Line
                  key={`${task}-real`}
                  type="monotone"
                  dataKey={`${task} (Real)`}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={3}
                  name={`${task} (Real)`}
                  dot={{ r: 5 }}
                  connectNulls
                />
              ))}
              {isProgramadaView && tasks.map((task, index) => (
                <Line
                  key={`${task}-proy`}
                  type="monotone"
                  dataKey={`${task} (Proy.)`}
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  name={`${task} (Proy.)`}
                  strokeDasharray="3 3"
                  dot={{ r: 5 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Curva S */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[400px]">
          <h2 className="text-lg font-semibold mb-4">
            📈 Curva "S" - % Acumulado General del Proyecto
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedSCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" angle={-90} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tickFormatter={percentageFormatter}>
                <Label value="% Avance" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={percentageFormatter} />
              <Legend />
              <Line
                type="monotone"
                dataKey="real"
                stroke="#8884d8"
                strokeWidth={3}
                name="Progreso Real"
                dot={{ r: 5 }}
                connectNulls
              />
               {isProgramadaView && <Line
                type="monotone"
                dataKey="proyectado"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Progreso Proyectado"
                strokeDasharray="3 3"
                dot={{ r: 5 }}
                connectNulls
              />}
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
