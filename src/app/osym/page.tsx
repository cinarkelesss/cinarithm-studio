import { supabase } from "@/lib/supabase";
import { Download, Filter, Plus, Search } from "lucide-react";

import AppShell from "@/components/layout/AppShell";


export default async function OsymPage() {
  const { data: questions, error } = await supabase
  .from("questions")
  .select("*")
  .order("year", { ascending: false });

if (error) {
  return (
    <AppShell>
      <p className="text-red-500">
        Hata: {error.message}
      </p>
    </AppShell>
  );
}
    return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              ÖSYM Database
            </h1>

            <p className="mt-2 text-zinc-400">
              Search, organize and manage all mathematics questions.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105">
            <Plus size={18} />
            Yeni Soru
          </button>
        </div>

        {/* Search */}
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

        {/* Table */}
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
              {questions?.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-zinc-800 transition hover:bg-zinc-800/40"
                >
                  <td className="p-4">{question.exam}</td>
                  <td className="p-4">{question.year}</td>
                  <td className="p-4">{question.topic}</td>
                  <td className="p-4">{question.difficulty}</td>

                  <td className="p-4 text-right">
                    <button className="rounded-lg border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800">
                      Aç
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}