type Question = {
  id: number;
  exam: string;
  year: number;
  topic: string;
  difficulty: string;
};

type Props = {
  questions: Question[];
  onOpen: (question: Question) => void;
  onDelete: (id: number) => void;
};

export default function QuestionTable({
  questions,
  onOpen,
  onDelete,
}: Props) {
  return (
    <tbody>
      {questions.map((question) => (
        <tr
          key={question.id}
          className="border-b border-zinc-800 transition hover:bg-zinc-800/40"
        >
          <td className="p-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      question.exam === "TYT"
        ? "bg-blue-500/20 text-blue-400"
        : "bg-purple-500/20 text-purple-400"
    }`}
  >
    {question.exam}
  </span>
</td>
          <td className="p-4">{question.year}</td>
          <td className="p-4">{question.topic}</td>
          <td className="p-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      question.difficulty === "Kolay"
        ? "bg-green-500/20 text-green-400"
        : question.difficulty === "Orta"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {question.difficulty}
  </span>
</td>

          <td className="p-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onOpen(question)}
                className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
              >
                Aç
              </button>

              <button
                onClick={() => onDelete(question.id)}
                className="rounded-lg border border-red-600 px-3 py-1 text-sm text-red-400 hover:bg-red-600 hover:text-white"
              >
                Sil
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}