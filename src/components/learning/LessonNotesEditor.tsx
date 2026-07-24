"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  buildLearningNoteId,
  getLearningNote,
  getLearningNotesServerSnapshot,
  getLearningNotesSnapshot,
  subscribeToLearningNotes,
  upsertLearningNote,
} from "@/lib/learning";

type LessonNotesEditorProps = {
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  concepts: string[];
};

export default function LessonNotesEditor({
  courseSlug,
  courseTitle,
  moduleTitle,
  lessonTitle,
  concepts,
}: LessonNotesEditorProps) {
  const savedNotes = useSyncExternalStore(
    subscribeToLearningNotes,
    getLearningNotesSnapshot,
    getLearningNotesServerSnapshot
  );

  const noteId = buildLearningNoteId(courseSlug, lessonTitle);
  const savedNote = useMemo(
    () => getLearningNote(courseSlug, lessonTitle, savedNotes),
    [courseSlug, lessonTitle, savedNotes]
  );
  const [draft, setDraft] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const currentValue = draft ?? savedNote?.content ?? "";
  const displayLastSavedAt = lastSavedAt ?? savedNote?.updatedAt ?? null;

  const hasContent = currentValue.trim().length > 0;

  function handleSaveNote() {
    const nextContent = currentValue.trim();

    if (!nextContent) {
      return;
    }

    const updatedAt = new Date().toISOString();

    upsertLearningNote({
      id: noteId,
      courseSlug,
      courseTitle,
      moduleTitle,
      lessonTitle,
      content: nextContent,
      concepts,
      updatedAt,
    });

    setDraft(nextContent);
    setLastSavedAt(updatedAt);
  }

  return (
    <div className="mt-4">
      <textarea
        value={currentValue}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Bu ders için kendi açıklamanı, ispat iskeletini veya dikkat etmen gereken noktaları yaz..."
        className="min-h-48 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-200 outline-none placeholder:text-slate-500"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {displayLastSavedAt
            ? `Son kayıt: ${new Intl.DateTimeFormat("tr-TR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(displayLastSavedAt))}`
            : "Henüz bu ders için kayıtlı not yok."}
        </p>

        <button
          onClick={handleSaveNote}
          disabled={!hasContent}
          className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-default disabled:opacity-40"
        >
          Notu Kaydet
        </button>
      </div>
    </div>
  );
}
