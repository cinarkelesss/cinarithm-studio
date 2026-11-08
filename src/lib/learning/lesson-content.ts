export type LessonPrerequisiteLink = {
  label: string;
  href: string;
};

export type ContentStatus = "draft" | "review" | "approved" | "published";
export type LessonContentReviewStatus = "pending" | "pass" | "needs_changes";

export type LessonStudyGuideSection = {
  title: string;
  body: string[];
  statement?: string;
  note?: string;
};

export type LessonConceptSummary = {
  conceptId: string;
  summary: string;
};

export type LessonExampleContent = {
  title: string;
  expression: string;
  overview: string;
  steps: string[];
  contrastTitle: string;
  contrast: string[];
  takeaway: string;
};

export type LessonContentReview = {
  mathematicalAccuracy: LessonContentReviewStatus;
  pedagogy: LessonContentReviewStatus;
  language: LessonContentReviewStatus;
  technical: LessonContentReviewStatus;
  notes: string[];
};

export type LessonRichContent = {
  lessonId: string;
  courseSlug: string;
  lessonSlug: string;
  status: ContentStatus;
  version: number;
  conceptIds: string[];
  exerciseIds: string[];
  introducedConceptIds?: string[];
  review: LessonContentReview;
  reviewNotes?: string[];
  lastReviewedAt?: string;
  reviewedBy?: string;
  intro: string;
  prerequisites: LessonPrerequisiteLink[];
  studyGuide: LessonStudyGuideSection[];
  keyConcepts: LessonConceptSummary[];
  example: LessonExampleContent;
};
