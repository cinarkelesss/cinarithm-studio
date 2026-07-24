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

          <div className="glass-panel subtle-grid overflow-hidden rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Studio Insight</h2>

              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Adaptive
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-300">
              Analiz hattındaki istikrarın son 7 günde güçlendi.
              <span className="font-semibold text-emerald-300">
                {" "}
                İspat odaklı seanslar %18 artmış durumda.
              </span>
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm text-slate-400">Önerilen sıra</p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Gerçek analizde limit ve epsilon-delta notlarını tamamlayıp
                ardından 12 soruluk bir proof drill oturumu açman öğrenme
                derinliğini artırır.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Next review
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Compactness theorem
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Missing edge
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Notes ↔ Problems bağlantısı
                </p>
              </div>
            </div>
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
