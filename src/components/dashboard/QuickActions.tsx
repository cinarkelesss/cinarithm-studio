"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Bot,
  CalendarPlus,
  Video,
} from "lucide-react";

const actions = [
  {
    title: "Video Planner",
    icon: Video,
    href: "/videos",
  },
  {
    title: "ÖSYM Database",
    icon: BookOpen,
    href: "/osym",
  },
  {
    title: "Calendar",
    icon: CalendarPlus,
    href: "/calendar",
  },
  {
    title: "AI Assistant",
    icon: Bot,
    href: "/ai",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Quick Actions</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Jump to your most-used tools.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 transition group-hover:bg-zinc-700">
                <Icon size={22} />
              </div>

              <h3 className="mt-5 font-semibold">
                {action.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Open module
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}