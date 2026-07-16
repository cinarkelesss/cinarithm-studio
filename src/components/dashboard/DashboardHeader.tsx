export default function DashboardHeader() {
  return (
    <section className="flex items-end justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Welcome back, Çınar 👋
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Manage your mathematics content, ÖSYM database, video planning and
          analytics from a single dashboard.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
        Beta v0.1
      </div>
    </section>
  );
}