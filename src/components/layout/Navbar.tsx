export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Cinarithm Studio Yönetim Paneli
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-zinc-700 px-4 py-2">
          🌙
        </button>

        <button className="rounded-lg border border-zinc-700 px-4 py-2">
          👤 Çınar
        </button>
      </div>
    </header>
  );
}