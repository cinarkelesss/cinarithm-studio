import {
  BookOpen,
  CheckCircle2,
  Video,
} from "lucide-react";

const activities = [
  {
    icon: BookOpen,
    title: "ÖSYM Database güncellendi",
    time: "10 dakika önce",
  },
  {
    icon: Video,
    title: "Yeni video planı oluşturuldu",
    time: "45 dakika önce",
  },
  {
    icon: CheckCircle2,
    title: "Haftalık hedef tamamlandı",
    time: "Bugün",
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition hover:border-zinc-700"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800">
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}