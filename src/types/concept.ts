export type ConceptStatus = "stable" | "growing" | "new";

export interface Concept {
  slug: string;
  title: string;
  domain: "Analysis" | "Algebra" | "Foundations" | "Discrete";
  summary: string;
  mastery: number;
  status: ConceptStatus;
  prerequisites: string[];
  related: string[];
  proofPattern: string;
  questionSignal: string;
  courseSlug: string;
}
