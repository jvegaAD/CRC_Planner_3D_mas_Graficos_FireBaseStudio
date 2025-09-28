import Grid3D from "@/components/ganttastic/Grid3D";

export default function Home() {
  return (
    <main className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-foreground">📊 Planner 3D con Espesor</h1>
      <Grid3D />
    </main>
  );
}