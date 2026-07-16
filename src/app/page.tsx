import StatsCard from "@/components/dashboard/StatsCard";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <section className="flex-1 p-10">
        <h1 className="text-5xl font-bold">
          Cinarithm Studio
        </h1>

        <p className="mt-4 text-zinc-400 text-lg">
          AI Powered Math Content Management System
        </p>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-2xl font-semibold">
            Hoş Geldin Çınar 👋
          </h2>
<div className="mt-8 grid grid-cols-4 gap-6">
  <StatsCard
    title="Toplam Video"
    value="156"
    icon="🎥"
  />

  <StatsCard
    title="ÖSYM Sorusu"
    value="12.483"
    icon="📚"
  />

  <StatsCard
    title="Script"
    value="18"
    icon="📝"
  />

  <StatsCard
    title="Çalışma Saati"
    value="42"
    icon="⏱️"
  />
</div>
          <p className="mt-3 text-zinc-400">
            Dashboard'u birlikte inşa etmeye hazırız.
          </p>
        </div>
      </section>
    </main>
  );
}