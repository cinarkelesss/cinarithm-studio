"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getLearningNotesServerSnapshot,
  getLearningNotesSnapshot,
  getMergedWorkspaceNotes,
  subscribeToLearningNotes,
} from "@/lib/learning";

export default function RecentNotesClient() {
  const savedNotes = useSyncExternalStore(
    subscribeToLearningNotes,
    getLearningNotesSnapshot,
    getLearningNotesServerSnapshot
  );

  const notes = getMergedWorkspaceNotes(savedNotes).slice(0, 3);

  return (
    <section className="glass-panel mt-8 rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Notes
          </p>
          <h2 className="mt-2 text-xl font-semibold">Son Bağlı Notlar</h2>
        </div>

        <Link
          href="/workspace"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/6"
        >
          Workspace
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <article
            key={note.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {note.collection}
                </p>
                <h3 className="mt-2 font-semibold text-white">{note.title}</h3>
              </div>

              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {note.updatedAt}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {note.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
