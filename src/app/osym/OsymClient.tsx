"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import StatsCards from "@/components/osym/StatsCards";
import NewQuestionModal from "@/components/osym/NewQuestionModal";
import { Download, Filter, Plus, Search } from "lucide-react";

type Question = {
  id: number;
  exam: string;
  year: number;
  topic: string;
  difficulty: string;
};

type Props = {
  questions: Question[];
};

export default function OsymClient({ questions }: Props) {
  const [open, setOpen] = useState(false);
const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
const [drawerOpen, setDrawerOpen] = useState(false);
const [editExam, setEditExam] = useState("");
const [editYear, setEditYear] = useState(0);
const [editTopic, setEditTopic] = useState("");
const [editDifficulty, setEditDifficulty] = useState("");
  const router = useRouter();
  const totalQuestions = questions.length;
  const totalTYT = questions.filter((q) => q.exam === "TYT").length;
  const totalAYT = questions.filter((q) => q.exam === "AYT").length;
  const totalTopics = new Set(questions.map((q) => q.topic)).size;
const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm(
    "Bu soruyu silmek istediğine emin misin?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/questions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Silme işlemi başarısız.");
    }

    router.refresh();
  } catch (err) {
    console.error(err);
    alert("Soru silinemedi.");
  }
};
const handleUpdate = async () => {
  if (!selectedQuestion) return;

  try {
    const res = await fetch(`/api/questions/${selectedQuestion.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exam: editExam,
        year: editYear,
        topic: editTopic,
        difficulty: editDifficulty,
      }),
    });

    if (!res.ok) {
      throw new Error("Güncelleme başarısız.");
    }

    setDrawerOpen(false);
    router.refresh();
  } catch (err) {
    console.error(err);
    alert("Soru güncellenemedi.");
  }
};
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              ÖSYM Database
            </h1>

            <p className="mt-2 text-zinc-400">
              Search, organize and manage all mathematics questions.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Yeni Soru
          </button>
        </div>

        <StatsCards
          totalQuestions={totalQuestions}
          totalTYT={totalTYT}
          totalAYT={totalAYT}
          totalTopics={totalTopics}
        />

        <div className="flex gap-4">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4">
            <Search size={18} className="text-zinc-500" />

            <input
              placeholder="Soru ara..."
              className="h-12 flex-1 bg-transparent outline-none"
            />
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

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-950">
              <tr>
                <th className="p-4 text-left">Sınav</th>
                <th className="p-4 text-left">Yıl</th>
                <th className="p-4 text-left">Konu</th>
                <th className="p-4 text-left">Zorluk</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-zinc-800 transition hover:bg-zinc-800/40"
                >
                  <td className="p-4">{question.exam}</td>
                  <td className="p-4">{question.year}</td>
                  <td className="p-4">{question.topic}</td>
                  <td className="p-4">{question.difficulty}</td>

                  <td className="p-4">
  <div className="flex justify-end gap-2">
   <button
  onClick={() => {
    setSelectedQuestion(question);

    setEditExam(question.exam);
    setEditYear(question.year);
    setEditTopic(question.topic);
    setEditDifficulty(question.difficulty);

    setDrawerOpen(true);
  }}
  className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
>
  Aç
</button>

    <button
      onClick={() => handleDelete(question.id)}
      className="rounded-lg border border-red-600 px-3 py-1 text-sm text-red-400 hover:bg-red-600 hover:text-white"
    >
      Sil
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drawerOpen && selectedQuestion && (
  <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
    <div className="h-full w-[500px] bg-zinc-950 border-l border-zinc-800 p-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Soruyu Düzenle
        </h2>

        <button
          onClick={() => setDrawerOpen(false)}
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
    onClick={handleUpdate}
    className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:opacity-90"
  >
    💾 Kaydet
  </button>
</div>
      </div>
    </div>
  </div>
)}
      <NewQuestionModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </AppShell>
  );
}