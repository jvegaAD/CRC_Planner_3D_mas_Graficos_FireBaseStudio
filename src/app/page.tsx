import Grid3D from "@/components/ganttastic/Grid3D";

export default function Home() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">📊 Planner 3D con Espesor</h1>
      <Grid3D />
    </main>
  );
}
