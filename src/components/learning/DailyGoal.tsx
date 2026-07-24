const goals = [
  {
    title: "Proof Sprint",
    detail: "İki kısa ispatı kendi cümlelerinle yeniden yaz.",
    tone: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  },
  {
    title: "Concept Link",
    detail: "Limit, continuity ve metric space notlarını bağla.",
    tone: "border-violet-400/20 bg-violet-400/10 text-violet-100",
  },
  {
    title: "Problem Review",
    detail: "ÖSYM veri tabanından 8 soru seç ve etiketle.",
    tone: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  },
];

export default function DailyGoal() {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Today
          </p>
          <h2 className="mt-2 text-2xl font-bold">Daily Momentum</h2>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
          3 Focus Blocks
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.title}
            className={`rounded-2xl border p-4 ${goal.tone}`}
          >
            <p className="font-semibold">{goal.title}</p>
            <p className="mt-1 text-sm opacity-90">{goal.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
