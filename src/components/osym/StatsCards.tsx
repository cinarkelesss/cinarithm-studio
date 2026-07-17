type StatsCardsProps = {
  totalQuestions: number;
  totalTYT: number;
  totalAYT: number;
  totalTopics: number;
};

export default function StatsCards({
  totalQuestions,
  totalTYT,
  totalAYT,
  totalTopics,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">Toplam Soru</p>

        <h2 className="mt-3 text-4xl font-black">
          {totalQuestions}
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">TYT</p>

        <h2 className="mt-3 text-4xl font-black">
          {totalTYT}
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">AYT</p>

        <h2 className="mt-3 text-4xl font-black">
          {totalAYT}
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">Konu</p>

        <h2 className="mt-3 text-4xl font-black">
          {totalTopics}
        </h2>
      </div>
    </div>
  );
}