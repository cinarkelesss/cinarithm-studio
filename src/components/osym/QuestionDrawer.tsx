type Question = {
  id: number;
  exam: string;
  year: number;
  topic: string;
  difficulty: string;
};

type Props = {
  open: boolean;
  question: Question | null;

  editExam: string;
  setEditExam: (value: string) => void;

  editYear: number;
  setEditYear: (value: number) => void;

  editTopic: string;
  setEditTopic: (value: string) => void;

  editDifficulty: string;
  setEditDifficulty: (value: string) => void;

  onClose: () => void;
  onSave: () => void;
};

export default function QuestionDrawer({
  open,
  question,

  editExam,
  setEditExam,

  editYear,
  setEditYear,

  editTopic,
  setEditTopic,

  editDifficulty,
  setEditDifficulty,

  onClose,
  onSave,
}: Props) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-[500px] overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Soruyu Düzenle
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-3 py-1 hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Sınav
            </label>

            <input
              value={editExam}
              onChange={(e) => setEditExam(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Yıl
            </label>

            <input
              type="number"
              value={editYear}
              onChange={(e) => setEditYear(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Konu
            </label>

            <input
              value={editTopic}
              onChange={(e) => setEditTopic(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Zorluk
            </label>

            <input
              value={editDifficulty}
              onChange={(e) => setEditDifficulty(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3"
            />
          </div>

          <div className="pt-6">
            <button
              onClick={onSave}
              className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
            >
              💾 Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}