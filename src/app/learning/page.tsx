import AppShell from "@/components/layout/AppShell";
import DailyGoal from "@/components/learning/DailyGoal";
import HeroCard from "@/components/learning/HeroCard";
import CourseGrid from "@/components/learning/CourseGrid";
import RecentNotesClient from "@/components/learning/RecentNotesClient";

export default function LearningPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Learning
          </p>
          <h1 className="mt-2 text-4xl font-bold">Öğrenme Merkezi</h1>

          <p className="mt-3 text-slate-400">
            Matematik yolculuğunu dersler, kavram bağlantıları, ispat akışları
            ve problem setleriyle tek bir çalışma sisteminde yönet.
          </p>
        </div>

        <HeroCard />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <CourseGrid />
          <div className="space-y-6">
            <DailyGoal />
            <RecentNotesClient />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
