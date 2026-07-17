"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Calendar,
  Database,
  LayoutDashboard,
  Settings,
  Video,
} from "lucide-react";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Database,
    label: "ÖSYM Database",
    href: "/osym",
  },
  {
    icon: Video,
    label: "Video Planner",
    href: "/videos",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "/calendar",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/95 p-6 backdrop-blur-xl">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
 <Image
  src="/logo.png"
  alt="Cinarithm Logo"
  width={52}
  height={52}
  className="rounded-lg"
 />

  <div>
    <h1 className="text-2xl font-black tracking-tight">
      Cinarithm
    </h1>

    <p className="text-xs text-zinc-500">
      Studio
    </p>
  </div>
</div>
      </div>

      
      <nav className="mt-10 flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-zinc-800 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 font-semibold">
            Ç
          </div>

          <div>
            <p className="text-sm font-semibold">
              Çınar Keleş
            </p>

            <p className="text-xs text-zinc-400">
              Founder · Cinarithm Studio
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}