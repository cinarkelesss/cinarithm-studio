import { Download, Filter, Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  sortOrder: "asc" | "desc";
  toggleSort: () => void;
};

export default function SearchToolbar({
  search,
  setSearch,
  sortOrder,
  toggleSort,
}: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4">
        <Search size={18} className="text-zinc-500" />

        <input
          placeholder="Soru ara..."
          className="h-12 flex-1 bg-transparent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={toggleSort}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          {sortOrder === "desc"
            ? "📅 Yeni → Eski"
            : "📅 Eski → Yeni"}
        </button>
      </div>

      <button className="flex items-center gap-2 rounded-xl border border-zinc-800 px-5 hover:bg-zinc-900">
        <Filter size={18} />
        Filtre
      </button>

      <button className="flex items-center gap-2 rounded-xl border border-zinc-800 px-5 hover:bg-zinc-900">
        <Download size={18} />
        Export
      </button>
    </div>
  );
}