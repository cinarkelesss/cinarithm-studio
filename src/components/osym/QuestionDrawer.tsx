type Question = {
  id: number;
  exam: string;
  year: number;
  topic: string;
  difficulty: string;
};

type Props = {
  open: boolean;
};

export default function QuestionDrawer({ open }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-[500px] border-l border-zinc-800 bg-zinc-950 p-8">
        <h2 className="text-2xl font-bold">
          Soruyu Düzenle
        </h2>
      </div>
    </div>
  );
}