type StatsCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="text-3xl">{icon}</div>

      <p className="mt-4 text-zinc-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}