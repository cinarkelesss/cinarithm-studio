const weeklyData = [
  { day: "Pzt", value: 45 },
  { day: "Sal", value: 70 },
  { day: "Çar", value: 55 },
  { day: "Per", value: 90 },
  { day: "Cum", value: 60 },
  { day: "Cmt", value: 80 },
  { day: "Paz", value: 100 },
];

export default function DashboardChart() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Weekly Study</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Last 7 days performance
          </p>
        </div>

        <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
          +18%
        </span>
      </div>

      <div className="flex h-72 items-end justify-between gap-4">
        {weeklyData.map((item) => (
          <div
            key={item.day}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-60 items-end">
              <div
                className="w-10 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-300 hover:scale-105"
                style={{
                  height: `${item.value * 2}px`,
                }}
              />
            </div>

            <span className="text-xs font-medium text-zinc-500">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}