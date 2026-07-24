export default function DashboardHeader() {
  return (
    <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Academic Math OS
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Üniversite matematiği için tek bir çalışma yüzeyi.
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Öğrenme yollarını, theorem ilişkilerini, notlarını ve problem
          bankanı aynı sistem içinde birleştiren premium bir akademik çalışma
          merkezi.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-sky-400/15 bg-sky-400/8 px-4 py-3 text-sm">
          <p className="text-sky-200">Current focus</p>
          <p className="mt-1 text-slate-200">Real Analysis + Proof Writing</p>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3 text-sm">
          <p className="text-emerald-200">Momentum</p>
          <p className="mt-1 text-slate-200">7 günlük istikrar aktif</p>
        </div>
      </div>
    </section>
  );
}
