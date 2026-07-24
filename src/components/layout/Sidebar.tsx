"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpenCheck,
  Database,
  LayoutDashboard,
  Network,
  NotebookPen,
  Sparkles,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    description: "Genel durum",
  },
  {
    icon: BookOpenCheck,
    label: "Learning OS",
    href: "/learning",
    description: "Kurslar ve yollar",
  },
  {
    icon: Network,
    label: "Concepts",
    href: "/concepts",
    description: "Knowledge graph",
  },
  {
    icon: Database,
    label: "Problems",
    href: "/osym",
    description: "Soru bankası",
  },
  {
    icon: NotebookPen,
    label: "Workspace",
    href: "/workspace",
    description: "Linked notes",
  },
];

const roadmapItems = [
  "Knowledge Graph",
  "Notes Workspace",
  "Proof Reviews",
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="glass-panel sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-r border-white/10 bg-[var(--surface-strong)] px-5 py-6 lg:flex">
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Cinarithm Logo"
            width={52}
            height={52}
            className="rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.12)]"
          />

          <div>
            <h1 className="text-2xl font-black tracking-tight">Cinarithm</h1>

            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Studio
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-400/15 bg-sky-400/8 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
            <Sparkles size={16} />
            Learning OS
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Brilliant kadar öğretici, Obsidian kadar bağlantılı ve GitHub kadar
            sistematik bir matematik çalışma alanı.
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                active
                  ? "bg-white/92 text-slate-950 shadow-[0_16px_50px_rgba(255,255,255,0.14)]"
                  : "text-slate-400 hover:bg-white/6 hover:text-white"
              }`}
            >
              <div
                className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border ${
                  active
                    ? "border-slate-200/60 bg-white/75"
                    : "border-white/10 bg-white/5 group-hover:border-white/18"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <p
  className={`text-sm font-semibold ${
    active ? "text-slate-900" : "text-white"
  }`}
>
  {item.label}
</p>
                <p
                  className={`mt-1 text-xs ${
                    active ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-sky-400/10 bg-white/5 p-5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        Continue Learning
      </p>

      <h3 className="mt-2 text-lg font-semibold text-white">
        Foundations of Mathematics
      </h3>
    </div>

    <span className="text-sm font-semibold text-sky-300">72%</span>
  </div>

  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
    <div className="h-full w-[72%] rounded-full bg-sky-400" />
  </div>

  <div className="mt-3 flex items-center justify-between text-sm">
    <span className="text-slate-400">
      12 / 17 Lessons
    </span>

    <span className="text-sky-300">
      Continue →
    </span>
  </div>

  <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
    <p className="text-xs uppercase tracking-wider text-slate-500">
      Next Lesson
    </p>

    <p className="mt-1 font-medium text-white">
      Önermeler
    </p>
  </div>
</div>
          ))}
        </div>
      

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-semibold text-slate-100">
            Ç
          </div>

          <div>
            <p className="text-sm font-semibold">Çınar Keleş</p>

            <p className="text-xs text-slate-500">
              Founder · Cinarithm Studio
            </p>
          </div>

          <Settings size={16} className="ml-auto text-slate-500" />
        </div>
      </div>
    </aside>
  );
}
