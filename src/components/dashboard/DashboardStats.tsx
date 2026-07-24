import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Network,
} from "lucide-react";

import StatsCard from "./StatsCard";

const stats = [
  {
    title: "Active Courses",
    value: "4",
    icon: BookOpen,
  },
  {
    title: "Linked Concepts",
    value: "128",
    icon: Network,
  },
  {
    title: "Proof Sessions",
    value: "23",
    icon: BrainCircuit,
  },
  {
    title: "Weekly Focus",
    value: "16.4h",
    icon: BarChart3,
  },
];

export default function DashboardStats() {
  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}
