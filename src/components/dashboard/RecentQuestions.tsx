type Question = {
  id: number;
  exam: string;
  year: number;
  topic: string;
};

type Props = {
  questions: Question[];
};

export default function RecentQuestions({ questions }: Props) {
  const recent = [...questions]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        🕒 Son Eklenen Sorular
      </h2>

      <div className="space-y-4">
        {recent.map((question) => (
          <div
            key={question.id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 p-4"
          >
            <div>
              <p className="font-semibold">
                {question.topic}
              </p>

              <p className="text-sm text-zinc-400">
                {question.exam} • {question.year}
              </p>
            </div>

            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
              #{question.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}