import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950/70 px-8 backdrop-blur-xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Welcome back, Çınar 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex w-80 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2">
          <Search size={18} className="text-zinc-500" />

          <input
            type="text"
            placeholder="Search anything..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />

          <kbd className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-500">
            ⌘K
          </kbd>
        </div>

        <button className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition hover:bg-zinc-800">
          <Bell size={18} />
        </button>

        <button className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 transition hover:bg-zinc-800">
          <UserCircle2 size={22} />
        </button>
      </div>
    </header>
  );
}