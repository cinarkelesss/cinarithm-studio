import type { LucideIcon } from "lucide-react";


type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
 
 
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-800/60">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
        <Icon size={24} />
      </div>

      <p className="mt-5 text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight">
        {value}
      </h2>
    </div>
  );
}