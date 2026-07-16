import AppShell from "@/components/layout/AppShell";

import DashboardChart from "@/components/dashboard/DashboardChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <DashboardHeader />

        <DashboardStats />

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DashboardChart />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">AI Insight</h2>

              <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                LIVE
              </div>
            </div>

            <p className="mt-6 leading-7 text-zinc-300">
              Bu hafta çalışma verimliliğin
              <span className="font-semibold text-emerald-400">
                {" "}
                %18 arttı.
              </span>
            </p>

            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-sm text-zinc-400">Öneri</p>

              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Cebir videolarını tamamladıktan sonra analiz çözerek öğrenme
                hızını artırabilirsin.
              </p>
            </div>

            <button className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:scale-[1.02]">
              AI Assistant
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentActivity />
          </div>

          <QuickActions />
        </section>
      </div>
    </AppShell>
  );
}