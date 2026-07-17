"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewQuestionModal({ open, onClose }: Props) {
    const router = useRouter();

const [exam, setExam] = useState("TYT");
const [year, setYear] = useState(new Date().getFullYear());
const [topic, setTopic] = useState("");
const [difficulty, setDifficulty] = useState("Orta");
const [loading, setLoading] = useState(false);
const handleSave = async () => {
  try {
    setLoading(true);

    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exam,
        year,
        topic,
        difficulty,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.error || "Bir hata oluştu.");
      return;
    }

    alert("✅ Soru başarıyla eklendi!");
  } catch (e) {
    console.error(e);
    alert("Bir hata oluştu.");
  } finally {
    setLoading(false);
  }
};
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Yeni Soru
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              ÖSYM veritabanına yeni bir soru ekleyin.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-zinc-800"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Sınav
            </label>

            <select
  value={exam}
  onChange={(e) => setExam(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
>
  <option value="TYT">TYT</option>
  <option value="AYT">AYT</option>
</select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Yıl
            </label>

            <input
  type="number"
  value={year}
  onChange={(e) => setYear(Number(e.target.value))}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
/>

          </div>

          <div className="col-span-2">
            <input
  value={topic}
  onChange={(e) => setTopic(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
  placeholder="Türev"
/>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Zorluk
            </label>

            <select
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
>
  <option value="Kolay">Kolay</option>
  <option value="Orta">Orta</option>
  <option value="Zor">Zor</option>
</select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              PDF Linki
            </label>

            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block text-sm text-zinc-400">
              Notlar
            </label>

            <textarea
              rows={5}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none"
              placeholder="İsteğe bağlı..."
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-5 py-3 hover:bg-zinc-900"
          >
            İptal
          </button>

          <button
  onClick={handleSave}
  disabled={loading}
  className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:opacity-50"
>
  {loading ? "Kaydediliyor..." : "Kaydet"}
</button>

        </div>
      </div>
    </div>
  );
}