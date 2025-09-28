"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tasks = [
  "Fundaciones",
  "Hormigón",
  "Albañilería",
  "Aislamiento",
  "Instalaciones",
];

const days = ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5"];

export default function Grid3D() {
  // Estados: 0 = blanco, 1 = verde, 2 = rojo
  const [grid, setGrid] = useState<number[][]>(
    tasks.map(() => days.map(() => 0))
  );

  const handleClick = (row: number, col: number) => {
    setGrid((prev) =>
      prev.map((r, i) =>
        r.map((cell, j) =>
          i === row && j === col ? (cell + 1) % 3 : cell
        )
      )
    );
  };

  const getColor = (state: number) => {
    switch (state) {
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-red-500";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse">
        <thead className="bg-card">
          <tr>
            <th className="px-4 py-2 border bg-secondary text-secondary-foreground">Actividad</th>
            {days.map((day, index) => (
              <th key={index} className="px-4 py-2 border bg-muted text-muted-foreground">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, rowIndex) => (
            <tr key={rowIndex}>
              <td className="px-4 py-2 border font-medium bg-card text-card-foreground">
                {task}
              </td>
              {days.map((_, colIndex) => (
                <td key={colIndex} className="px-2 py-2 border bg-card">
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
  );
}