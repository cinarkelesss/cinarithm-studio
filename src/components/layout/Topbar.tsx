"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, UserCircle2 } from "lucide-react";

const pageMap = [
  {
    match: (pathname: string) => pathname === "/dashboard",
    title: "Command Center",
    description: "Akademik ritmini, aktif kurslarını ve odak alanlarını izle.",
    status: "Live",
  },
  {
    match: (pathname: string) => pathname === "/learning",
    title: "Learning OS",
    description: "Kurs yolları, theorem akışları ve çalışma modülleri burada.",
    status: "Beta",
  },
  {
    match: (pathname: string) => pathname === "/concepts",
    title: "Knowledge Graph",
    description: "Kavramlar, önkoşullar ve theorem bağlantıları tek bir ağda.",
    status: "Alpha",
  },
  {
    match: (pathname: string) => pathname.startsWith("/concepts/"),
    title: "Concept Detail",
    description: "Bir kavramın proof pattern, problem sinyali ve bağlı notları.",
    status: "Alpha",
  },
  {
    match: (pathname: string) => pathname === "/osym",
    title: "Problem Database",
    description: "Soru arşivini yönet, etiketle ve çalışılabilir kümelere dönüştür.",
    status: "Active",
  },
  {
    match: (pathname: string) => pathname === "/workspace",
    title: "Linked Workspace",
    description: "Notlarını concept graph ve problem sistemi ile bağla.",
    status: "Alpha",
  },
];

export default function Topbar() {
  const pathname = usePathname();
  const page = pageMap.find((item) => item.match(pathname)) ?? pageMap[0];

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[rgba(5,8,22,0.72)] px-5 py-5 backdrop-blur-xl sm:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{page.title}</h2>
            <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
              {page.status}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-400">{page.description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 sm:w-80">
            <Search size={18} className="text-slate-500" />

            <input
              type="text"
              placeholder="Konu, theorem, note veya soru ara..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
            />

            <kbd className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/6 p-3 hover:bg-white/10">
              <Bell size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 hover:bg-white/10">
              <UserCircle2 size={20} />
              <span className="text-sm text-slate-200">Çınar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
