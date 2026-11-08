"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getAllLessonRichContentEntries,
  getBaseLessonRichContentByLessonId,
  getBaseLessonRichContentBySlug,
} from "@/data/learning/content";
import {
  canTransitionContentStatus,
  mergeLessonContentWithOverride,
  type LessonContentEditorialOverride,
} from "@/lib/learning/editorial";
import type { ContentStatus, LessonContentReview } from "@/lib/learning/lesson-content";

const STORAGE_KEY = "cinarithm-editorial-content-v1";
const STORAGE_EVENT = "cinarithm:editorial-content";

type EditorialOverrideState = Record<string, LessonContentEditorialOverride>;

const EMPTY_OVERRIDES: EditorialOverrideState = {};
let cachedRawSnapshot: string | null = null;
let cachedParsedSnapshot: EditorialOverrideState = EMPTY_OVERRIDES;

function emptySnapshot() {
  return EMPTY_OVERRIDES;
}

function readSnapshot(): EditorialOverrideState {
  if (typeof window === "undefined") {
    return emptySnapshot();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedRawSnapshot = null;
      cachedParsedSnapshot = EMPTY_OVERRIDES;
      return emptySnapshot();
    }

    if (raw === cachedRawSnapshot) {
      return cachedParsedSnapshot;
    }

    const parsed = JSON.parse(raw) as EditorialOverrideState;
    cachedRawSnapshot = raw;
    cachedParsedSnapshot = parsed ?? EMPTY_OVERRIDES;
    return cachedParsedSnapshot;
  } catch {
    cachedRawSnapshot = null;
    cachedParsedSnapshot = EMPTY_OVERRIDES;
    return emptySnapshot();
  }
}

function emitChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function writeSnapshot(next: EditorialOverrideState) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(next);
  cachedRawSnapshot = serialized;
  cachedParsedSnapshot = next;
  window.localStorage.setItem(STORAGE_KEY, serialized);
  emitChange();
}

function subscribe(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== STORAGE_KEY) {
      return;
    }

    listener();
  };

  window.addEventListener(STORAGE_EVENT, handleStorage);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handleStorage);
    window.removeEventListener("storage", handleStorage);
  };
}

function nowIso() {
  return new Date().toISOString();
}

export function useEditorialOverrides() {
  return useSyncExternalStore(subscribe, readSnapshot, emptySnapshot);
}

export function usePublishedLessonContent(courseSlug: string, lessonSlug: string) {
  const overrides = useEditorialOverrides();

  return useMemo(() => {
    const base = getBaseLessonRichContentBySlug(courseSlug, lessonSlug);
    if (!base) {
      return null;
    }

    const resolved = mergeLessonContentWithOverride(base, overrides[base.lessonId]);
    return resolved.status === "published" ? resolved : null;
  }, [courseSlug, lessonSlug, overrides]);
}

export function useEditorialLessonContentByLessonId(lessonId: string) {
  const overrides = useEditorialOverrides();

  return useMemo(() => {
    const base = getBaseLessonRichContentByLessonId(lessonId);
    return base ? mergeLessonContentWithOverride(base, overrides[lessonId]) : null;
  }, [lessonId, overrides]);
}

export function useEditorialLessonContentEntries() {
  const overrides = useEditorialOverrides();

  return useMemo(
    () =>
      getAllLessonRichContentEntries().map((entry) =>
        mergeLessonContentWithOverride(entry, overrides[entry.lessonId])
      ),
    [overrides]
  );
}

export function updateLessonEditorialOverride(
  lessonId: string,
  patch: LessonContentEditorialOverride
) {
  const current = readSnapshot();
  const existing = current[lessonId] ?? {};
  const nextOverride = {
    ...existing,
    ...patch,
  };
  const hasChanged = JSON.stringify(existing) !== JSON.stringify(nextOverride);

  if (!hasChanged) {
    return;
  }

  writeSnapshot({
    ...current,
    [lessonId]: nextOverride,
  });
}

export function saveLessonEditorialReview(input: {
  lessonId: string;
  review: LessonContentReview;
  reviewNotes: string[];
  reviewedBy?: string;
}) {
  updateLessonEditorialOverride(input.lessonId, {
    review: input.review,
    reviewNotes: input.reviewNotes,
    reviewedBy: input.reviewedBy,
    lastReviewedAt: nowIso(),
  });
}

export function transitionLessonContentStatus(lessonId: string, nextStatus: ContentStatus) {
  const base = getBaseLessonRichContentByLessonId(lessonId);
  if (!base) {
    return {
      ok: false as const,
      message: "Ders icerigi bulunamadi.",
    };
  }

  const current = readSnapshot();
  const resolved = mergeLessonContentWithOverride(base, current[lessonId]);

  if (!canTransitionContentStatus(resolved.status, nextStatus)) {
    return {
      ok: false as const,
      message: `${resolved.status} durumundan ${nextStatus} durumuna gecis izinli degil.`,
    };
  }

  updateLessonEditorialOverride(lessonId, {
    status: nextStatus,
    lastReviewedAt: nowIso(),
  });

  return {
    ok: true as const,
    message: null,
  };
}

export function clearLessonEditorialOverride(lessonId: string) {
  const current = readSnapshot();
  if (!current[lessonId]) {
    return;
  }

  const next = { ...current };
  delete next[lessonId];
  writeSnapshot(next);
}
