import {
  BarChart3,
  BookOpen,
  Clock3,
  Video,
} from "lucide-react";

import StatsCard from "./StatsCard";

const stats = [
  {
    title: "ÖSYM Questions",
    value: "12,486",
    icon: BookOpen,
  },
  {
    title: "Planned Videos",
    value: "48",
    icon: Video,
  },
  {
    title: "Study Sessions",
    value: "186",
    icon: Clock3,
  },
  {
    title: "Productivity",
    value: "94%",
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