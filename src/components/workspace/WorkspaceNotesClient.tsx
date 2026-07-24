"use client";

import { useSyncExternalStore } from "react";
import { getLearningNotesServerSnapshot, getLearningNotesSnapshot, getMergedWorkspaceNotes, subscribeToLearningNotes } from "@/lib/learning";
import WorkspaceNoteCard from "./WorkspaceNoteCard";

export default function WorkspaceNotesClient() {
  const savedNotes = useSyncExternalStore(
    subscribeToLearningNotes,
    getLearningNotesSnapshot,
    getLearningNotesServerSnapshot
  );

  const notes = getMergedWorkspaceNotes(savedNotes);

  return (
    <section className="space-y-4">
      {notes.map((note) => (
        <WorkspaceNoteCard key={note.id} note={note} />
      ))}
    </section>
  );
}
