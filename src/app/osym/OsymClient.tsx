"use client";
import QuestionDrawer from "@/components/osym/QuestionDrawer";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import StatsCards from "@/components/osym/StatsCards";
import NewQuestionModal from "@/components/osym/NewQuestionModal";
import { Plus } from "lucide-react";
import QuestionTable from "@/components/osym/QuestionTable";
import { useState } from "react";
import QuestionsChart from "@/components/dashboard/QuestionsChart";
import ExamDistributionChart from "@/components/dashboard/ExamDistributionChart";
import TopTopicsChart from "@/components/dashboard/TopTopicsChart";
import RecentQuestions from "@/components/dashboard/RecentQuestions";
import QuickActions from "@/components/dashboard/QuickActions";
import SearchToolbar from "@/components/osym/SearchToolbar";

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
const [search, setSearch] = useState("");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
const [currentPage, setCurrentPage] = useState(1);

const ITEMS_PER_PAGE = 10;
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
  const filteredQuestions = [...questions]
  .filter((question) =>
    `${question.exam} ${question.year} ${question.topic} ${question.difficulty}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .sort((a, b) =>
    sortOrder === "desc"
      ? b.year - a.year
      : a.year - b.year
  );

const totalPages = Math.max(
  1,
  Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE)
);

const paginatedQuestions = filteredQuestions.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Problem Database
            </h1>

            <p className="mt-2 text-zinc-400">
              ÖSYM ve akademik matematik problemlerini düzenle, etiketle ve
              çalışılabilir akışlara çevir.
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
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <QuestionsChart questions={questions} />

  <ExamDistributionChart questions={questions} />
</div>
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <TopTopicsChart questions={questions} />
  </div>

  <div className="space-y-6">
    <RecentQuestions questions={questions} />

    <QuickActions
      onNewQuestion={() => setOpen(true)}
    />
  </div>
</div>
        <SearchToolbar
  search={search}
  setSearch={(value) => {
    setSearch(value);
    setCurrentPage(1);
  }}
  sortOrder={sortOrder}
  toggleSort={() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  }}
/>

          

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

            <QuestionTable
  questions={paginatedQuestions}
  
  onOpen={(question) => {
    setSelectedQuestion(question);

    setEditExam(question.exam);
    setEditYear(question.year);
    setEditTopic(question.topic);
    setEditDifficulty(question.difficulty);

    setDrawerOpen(true);
  }}
  onDelete={handleDelete}
/>
          </table>
          <div className="mt-6 flex items-center justify-center gap-2">
  <button
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    className="rounded-lg border border-zinc-700 px-3 py-2 disabled:opacity-50"
  >
    ← Önceki
  </button>

  <span className="text-sm text-zinc-400">
    Sayfa {currentPage} / {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    className="rounded-lg border border-zinc-700 px-3 py-2 disabled:opacity-50"
  >
    Sonraki →
  </button>
</div>
        </div>
      </div>

      <QuestionDrawer
  open={drawerOpen}
  question={selectedQuestion}
  editExam={editExam}
  setEditExam={setEditExam}
  editYear={editYear}
  setEditYear={setEditYear}
  editTopic={editTopic}
  setEditTopic={setEditTopic}
  editDifficulty={editDifficulty}
  setEditDifficulty={setEditDifficulty}
  onClose={() => setDrawerOpen(false)}
  onSave={handleUpdate}
/>

      <NewQuestionModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </AppShell>
  );
}
