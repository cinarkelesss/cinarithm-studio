export type NoteStatus = "draft" | "linked" | "review";

export interface StudyNote {
  id: number;
  title: string;
  updatedAt: string;
  summary: string;
  status: NoteStatus;
  collection: string;
  linkedConceptSlugs: string[];
}
