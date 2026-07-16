export default function Sidebar() {
  return (
    <aside className="h-screen w-72 bg-zinc-900 border-r border-zinc-800 p-6">
      <h1 className="text-3xl font-bold">
        Cinarithm
      </h1>

      <p className="mt-2 text-sm text-zinc-400">
        Studio
      </p>

      <nav className="mt-12 space-y-3">

        <button className="w-full rounded-lg bg-zinc-800 p-3 text-left hover:bg-zinc-700 transition">
          🏠 Dashboard
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-zinc-800 transition">
          📚 ÖSYM Database
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-zinc-800 transition">
          🎥 Video Planner
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-zinc-800 transition">
          📅 Calendar
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-zinc-800 transition">
          📊 Analytics
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-zinc-800 transition">
          ⚙️ Settings
        </button>

      </nav>
    </aside>
  );
}