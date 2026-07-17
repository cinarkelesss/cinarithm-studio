import {
  Plus,
  Download,
  Search,
  BarChart3,
} from "lucide-react";

type Props = {
  onNewQuestion: () => void;
};

export default function QuickActions({
  onNewQuestion,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        ⚡ Hızlı İşlemler
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onNewQuestion}
          className="flex items-center gap-3 rounded-xl border border-zinc-800 p-4 transition hover:bg-zinc-800"
        >
          <Plus size={20} />
          Yeni Soru
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-zinc-800 p-4 transition hover:bg-zinc-800">
          <Download size={20} />
          Export
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-zinc-800 p-4 transition hover:bg-zinc-800">
          <Search size={20} />
          Ara
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-zinc-800 p-4 transition hover:bg-zinc-800">
          <BarChart3 size={20} />
          Analytics
        </button>
      </div>
    </div>
  );
}