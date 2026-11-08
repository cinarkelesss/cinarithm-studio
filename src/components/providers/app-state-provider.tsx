"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { computeStreak, formatDateLabel, getLastDateKeys, toDateKey } from "@/lib/date";
import { createDefaultAppData } from "@/lib/default-data";
import type {
  Achievement,
  AppData,
  Book,
  JournalEntry,
  KnowledgeNode,
  LearningContentItem,
  LearningCategory,
  LearningCourse,
  LearningResource,
  Problem,
  Proof,
  RoadmapWeek,
} from "@/lib/types";

const STORAGE_KEY = "cinarithm-alpha-state";
const STORAGE_VERSION = 1;

type BookInput = Omit<Book, "id" | "updatedAt" | "isActive">;
type ProofInput = Omit<Proof, "id" | "createdAt">;
type JournalInput = Omit<JournalEntry, "id" | "createdAt">;
type ProblemInput = Omit<Problem, "id" | "createdAt">;
type NodeInput = Omit<KnowledgeNode, "id">;
type LearningCategoryInput = Omit<LearningCategory, "id">;
type LearningCourseInput = Omit<LearningCourse, "id">;
type LearningResourceInput = Omit<LearningResource, "id" | "items"> & {
  items?: LearningContentItem[];
};
type LearningContentInput = Omit<LearningContentItem, "id">;

type AppStateContextValue = {
  data: AppData;
  hydrated: boolean;
  todayKey: string;
  todayTasks: Array<
    AppData["dailyTaskTemplates"][number] & {
      completed: boolean;
    }
  >;
  activeBook: Book | undefined;
  streak: number;
  totalXp: number;
  completedRoadmapCount: number;
  solvedProblemsCount: number;
  masteredNodesCount: number;
  achievements: Achievement[];
  weeklyXp: Array<{ date: string; label: string; xp: number }>;
  updateProfile: (input: Partial<AppData["profile"]>) => void;
  toggleDailyTask: (taskId: string) => void;
  addBook: (input: BookInput) => void;
  updateBook: (bookId: string, input: Partial<Book>) => void;
  setActiveBook: (bookId: string) => void;
  addProof: (input: ProofInput) => void;
  addJournalEntry: (input: JournalInput) => void;
  addRoadmapWeek: (input: Omit<RoadmapWeek, "id">) => void;
  upsertRoadmapWeek: (weekId: string, input: Partial<RoadmapWeek>) => void;
  addKnowledgeNode: (input: NodeInput) => void;
  updateKnowledgeNode: (nodeId: string, input: Partial<KnowledgeNode>) => void;
  addProblem: (input: ProblemInput) => void;
  updateProblem: (problemId: string, input: Partial<Problem>) => void;
  addLearningCategory: (input: LearningCategoryInput) => void;
  updateLearningCategory: (
    categoryId: string,
    input: Partial<LearningCategory>
  ) => void;
  deleteLearningCategory: (categoryId: string) => void;
  addLearningCourse: (input: LearningCourseInput) => void;
  updateLearningCourse: (
    courseId: string,
    input: Partial<LearningCourse>
  ) => void;
  deleteLearningCourse: (courseId: string) => void;
  addLearningResource: (input: LearningResourceInput) => void;
  updateLearningResource: (
    resourceId: string,
    input: Partial<LearningResource>
  ) => void;
  addLearningContent: (
    resourceId: string,
    input: LearningContentInput
  ) => void;
  updateLearningContent: (
    resourceId: string,
    contentId: string,
    input: Partial<LearningContentItem>
  ) => void;
  deleteLearningContent: (resourceId: string, contentId: string) => void;
  deleteLearningResource: (resourceId: string) => void;
  resetAllData: () => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sumXp(data: AppData) {
  return data.activityLog.reduce((total, activity) => total + activity.xp, 0);
}

function appendActivityToLog(
  current: AppData,
  todayKey: string,
  kind: AppData["activityLog"][number]["kind"],
  label: string,
  xp: number,
  entityId?: string
) {
  return [
    ...current.activityLog,
    {
      id: uid("activity"),
      kind,
      entityId,
      label,
      date: todayKey,
      xp,
    },
  ];
}

function hydrateAppData(input: Partial<AppData>) {
  const defaults = createDefaultAppData();
  const learningResources = (input.learningResources ?? defaults.learningResources).map(
    (resource) => ({
      ...resource,
      items: [...(resource.items ?? [])].map((item) => ({ ...item })),
    })
  );
  const learningCourses = (input.learningCourses ?? defaults.learningCourses).map(
    (course) => ({
      ...course,
      topics: [...(course.topics ?? [])],
      resourceIds: [...(course.resourceIds ?? [])],
      relatedBookIds: [...(course.relatedBookIds ?? [])],
      relatedNodeIds: [...(course.relatedNodeIds ?? [])],
      relatedProofIds: [...(course.relatedProofIds ?? [])],
    })
  );

  return {
    ...defaults,
    ...input,
    profile: {
      ...defaults.profile,
      ...input.profile,
    },
    settings: {
      ...defaults.settings,
      ...input.settings,
    },
    learningCategories: input.learningCategories ?? defaults.learningCategories,
    learningResources,
    learningCourses,
    dailyTaskTemplates: input.dailyTaskTemplates ?? defaults.dailyTaskTemplates,
    taskCompletions: input.taskCompletions ?? defaults.taskCompletions,
    activityLog: input.activityLog ?? defaults.activityLog,
  };
}

function buildAchievements(
  data: AppData,
  streak: number,
  totalXp: number
): Achievement[] {
  const completedWeeks = data.roadmapWeeks.filter(
    (week) => week.status === "tamamlandı"
  ).length;
  const solvedProblems = data.problems.filter(
    (problem) => problem.status === "çözüldü"
  ).length;
  const masteredNodes = data.knowledgeNodes.filter(
    (node) => node.status === "oturdu"
  ).length;
  const maxBookProgress = Math.max(0, ...data.books.map((book) => book.progress));

  return [
    {
      id: "first-proof",
      title: "İlk İspat",
      description: "En az bir ispat yazdığında açılır.",
      unlocked: data.proofs.length >= 1,
      progressLabel: `${data.proofs.length}/1`,
    },
    {
      id: "proof-collector",
      title: "10 İspat Eşiği",
      description: "Düzenli ispat ritmi kurduğunu gösterir.",
      unlocked: data.proofs.length >= 10,
      progressLabel: `${data.proofs.length}/10`,
    },
    {
      id: "journal-starter",
      title: "Günlük Başlangıcı",
      description: "İlk matematik günlüğü kaydını tuttuğunda açılır.",
      unlocked: data.journalEntries.length >= 1,
      progressLabel: `${data.journalEntries.length}/1`,
    },
    {
      id: "streak-seven",
      title: "7 Gün Seri",
      description: "Yedi gün üst üste masaya oturduğunda açılır.",
      unlocked: streak >= 7,
      progressLabel: `${streak}/7`,
    },
    {
      id: "book-rhythm",
      title: "Kitap Ritmi",
      description: "Bir kitabı yüzde 50 üstüne taşıdığında açılır.",
      unlocked: maxBookProgress >= 50,
      progressLabel: `%${maxBookProgress}/50`,
    },
    {
      id: "roadmap-builder",
      title: "Yol Haritası Kurucusu",
      description: "Dört haftalık blok tamamlandığında açılır.",
      unlocked: completedWeeks >= 4,
      progressLabel: `${completedWeeks}/4`,
    },
    {
      id: "problem-hunter",
      title: "Problem Avcısı",
      description: "Beş problem çözdüğünde açılır.",
      unlocked: solvedProblems >= 5,
      progressLabel: `${solvedProblems}/5`,
    },
    {
      id: "xp-500",
      title: "500 XP",
      description: "Sürdürülebilir çalışma birikiminin ilk büyük eşiği.",
      unlocked: totalXp >= 500,
      progressLabel: `${totalXp}/500`,
    },
    {
      id: "node-mastery",
      title: "Bilgi Düğümü",
      description: "Üç kavramı oturdu seviyesine taşıdığında açılır.",
      unlocked: masteredNodes >= 3,
      progressLabel: `${masteredNodes}/3`,
    },
  ];
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => createDefaultAppData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let frame = 0;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          version: number;
          data: AppData;
        };

        if (parsed.version === STORAGE_VERSION) {
          frame = window.requestAnimationFrame(() => {
            setData(hydrateAppData(parsed.data));
          });
        }
      }
    } catch {
      // Bozuk yerel veri varsa varsayılan örnekle devam et.
    } finally {
      setHydrated(true);
    }

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        data,
      })
    );
  }, [data, hydrated]);

  const todayKey = toDateKey();

  const todayTasks = useMemo(() => {
    const completed = new Set(data.taskCompletions[todayKey] ?? []);
    return data.dailyTaskTemplates.map((task) => ({
      ...task,
      completed: completed.has(task.id),
    }));
  }, [data.dailyTaskTemplates, data.taskCompletions, todayKey]);

  const activeBook = useMemo(
    () => data.books.find((book) => book.isActive) ?? data.books[0],
    [data.books]
  );

  const streak = useMemo(
    () => computeStreak(data.activityLog.map((activity) => activity.date)),
    [data.activityLog]
  );

  const totalXp = useMemo(() => sumXp(data), [data]);

  const completedRoadmapCount = useMemo(
    () =>
      data.roadmapWeeks.filter((week) => week.status === "tamamlandı").length,
    [data.roadmapWeeks]
  );

  const solvedProblemsCount = useMemo(
    () => data.problems.filter((problem) => problem.status === "çözüldü").length,
    [data.problems]
  );

  const masteredNodesCount = useMemo(
    () => data.knowledgeNodes.filter((node) => node.status === "oturdu").length,
    [data.knowledgeNodes]
  );

  const achievements = useMemo(
    () => buildAchievements(data, streak, totalXp),
    [data, streak, totalXp]
  );

  const weeklyXp = useMemo(() => {
    return getLastDateKeys(7).map((date) => ({
      date,
      label: formatDateLabel(date).split(" ").slice(0, 2).join(" "),
      xp: data.activityLog
        .filter((activity) => activity.date === date)
        .reduce((total, activity) => total + activity.xp, 0),
    }));
  }, [data.activityLog]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      data,
      hydrated,
      todayKey,
      todayTasks,
      activeBook,
      streak,
      totalXp,
      completedRoadmapCount,
      solvedProblemsCount,
      masteredNodesCount,
      achievements,
      weeklyXp,
      updateProfile(input) {
        setData((current) => ({
          ...current,
          profile: {
            ...current.profile,
            ...input,
          },
        }));
      },
      toggleDailyTask(taskId) {
        setData((current) => {
          const completed = new Set(current.taskCompletions[todayKey] ?? []);
          const task = current.dailyTaskTemplates.find((item) => item.id === taskId);

          if (!task) {
            return current;
          }

          const isCompleted = completed.has(taskId);
          if (isCompleted) {
            completed.delete(taskId);
          } else {
            completed.add(taskId);
          }

          return {
            ...current,
            taskCompletions: {
              ...current.taskCompletions,
              [todayKey]: Array.from(completed),
            },
            activityLog: isCompleted
              ? current.activityLog.filter(
                  (activity) =>
                    !(
                      activity.kind === "task" &&
                      activity.entityId === taskId &&
                      activity.date === todayKey
                    )
                )
              : appendActivityToLog(
                  current,
                  todayKey,
                  "task",
                  `${task.title} tamamlandı`,
                  task.xp,
                  taskId
                ),
          };
        });
      },
      addBook(input) {
        setData((current) => ({
          ...current,
          books: [
            ...current.books.map((book) => ({
              ...book,
              isActive: false,
            })),
            {
              id: uid("book"),
              updatedAt: todayKey,
              isActive: true,
              ...input,
            },
          ],
          activityLog: appendActivityToLog(
            current,
            todayKey,
            "book",
            `${input.title} kütüphaneye eklendi`,
            10
          ),
        }));
      },
      updateBook(bookId, input) {
        setData((current) => ({
          ...current,
          books: current.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  ...input,
                  updatedAt: todayKey,
                }
              : book
          ),
        }));
      },
      setActiveBook(bookId) {
        setData((current) => ({
          ...current,
          books: current.books.map((book) => ({
            ...book,
            isActive: book.id === bookId,
            updatedAt: book.id === bookId ? todayKey : book.updatedAt,
          })),
        }));
      },
      addProof(input) {
        setData((current) => {
          const nextProof = {
            id: uid("proof"),
            createdAt: todayKey,
            ...input,
          };

          return {
            ...current,
            proofs: [nextProof, ...current.proofs],
            activityLog: appendActivityToLog(
              current,
              todayKey,
              "proof",
              `${input.title} ispat olarak eklendi`,
              12,
              nextProof.id
            ),
          };
        });
      },
      addJournalEntry(input) {
        setData((current) => {
          const nextEntry = {
            id: uid("journal"),
            createdAt: todayKey,
            ...input,
          };

          return {
            ...current,
            journalEntries: [nextEntry, ...current.journalEntries],
            activityLog: appendActivityToLog(
              current,
              todayKey,
              "journal",
              `${input.title} günlüğe eklendi`,
              8,
              nextEntry.id
            ),
          };
        });
      },
      addRoadmapWeek(input) {
        setData((current) => ({
          ...current,
          roadmapWeeks: [
            ...current.roadmapWeeks,
            {
              id: uid("week"),
              ...input,
            },
          ].sort((left, right) => left.weekNumber - right.weekNumber),
        }));
      },
      upsertRoadmapWeek(weekId, input) {
        setData((current) => {
          const previous = current.roadmapWeeks.find((week) => week.id === weekId);
          const nextWeeks = current.roadmapWeeks.map((week) =>
            week.id === weekId
              ? {
                  ...week,
                  ...input,
                }
              : week
          );

          const completedNow =
            previous?.status !== "tamamlandı" && input.status === "tamamlandı";

          return {
            ...current,
            roadmapWeeks: nextWeeks,
            activityLog: completedNow
              ? appendActivityToLog(
                  current,
                  todayKey,
                  "roadmap",
                  `${previous?.weekNumber}. hafta tamamlandı`,
                  15,
                  weekId
                )
              : current.activityLog,
          };
        });
      },
      addKnowledgeNode(input) {
        setData((current) => ({
          ...current,
          knowledgeNodes: [
            {
              id: uid("node"),
              ...input,
            },
            ...current.knowledgeNodes,
          ],
        }));
      },
      updateKnowledgeNode(nodeId, input) {
        setData((current) => {
          const previous = current.knowledgeNodes.find((node) => node.id === nodeId);
          const completedNow =
            previous?.status !== "oturdu" && input.status === "oturdu";

          return {
            ...current,
            knowledgeNodes: current.knowledgeNodes.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    ...input,
                  }
                : node
            ),
            activityLog: completedNow
              ? appendActivityToLog(
                  current,
                  todayKey,
                  "node",
                  `${previous?.title} düğümü oturdu`,
                  9,
                  nodeId
                )
              : current.activityLog,
          };
        });
      },
      addProblem(input) {
        setData((current) => ({
          ...current,
          problems: [
            {
              id: uid("problem"),
              createdAt: todayKey,
              ...input,
            },
            ...current.problems,
          ],
        }));
      },
      updateProblem(problemId, input) {
        setData((current) => {
          const previous = current.problems.find(
            (problem) => problem.id === problemId
          );
          const solvedNow =
            previous?.status !== "çözüldü" && input.status === "çözüldü";

          return {
            ...current,
            problems: current.problems.map((problem) =>
              problem.id === problemId
                ? {
                    ...problem,
                    ...input,
                  }
                : problem
            ),
            activityLog: solvedNow
              ? appendActivityToLog(
                  current,
                  todayKey,
                  "problem",
                  `${previous?.title} çözüldü`,
                  10,
                  problemId
                )
              : current.activityLog,
          };
        });
      },
      addLearningCategory(input) {
        setData((current) => ({
          ...current,
          learningCategories: [
            ...current.learningCategories,
            {
              id: uid("learning-category"),
              ...input,
            },
          ],
        }));
      },
      updateLearningCategory(categoryId, input) {
        setData((current) => ({
          ...current,
          learningCategories: current.learningCategories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  ...input,
                }
              : category
          ),
        }));
      },
      deleteLearningCategory(categoryId) {
        setData((current) => {
          if (current.learningCategories.length <= 1) {
            return current;
          }

          const remainingCategories = current.learningCategories.filter(
            (category) => category.id !== categoryId
          );
          const fallbackCategoryId = remainingCategories[0]?.id;

          return {
            ...current,
            learningCategories: remainingCategories,
            learningCourses: current.learningCourses.map((course) =>
              course.categoryId === categoryId && fallbackCategoryId
                ? {
                    ...course,
                    categoryId: fallbackCategoryId,
                  }
                : course
            ),
          };
        });
      },
      addLearningCourse(input) {
        setData((current) => {
          const nextCourse = {
            id: uid("learning-course"),
            ...input,
          };

          return {
            ...current,
            learningCourses: [nextCourse, ...current.learningCourses],
            activityLog: appendActivityToLog(
              current,
              todayKey,
              "learning",
              `${input.title} Learning Hub'a eklendi`,
              10,
              nextCourse.id
            ),
          };
        });
      },
      updateLearningCourse(courseId, input) {
        setData((current) => {
          const previous = current.learningCourses.find(
            (course) => course.id === courseId
          );
          const completedNow =
            previous?.status !== "tamamlandı" && input.status === "tamamlandı";

          return {
            ...current,
            learningCourses: current.learningCourses.map((course) =>
              course.id === courseId
                ? {
                    ...course,
                    ...input,
                  }
                : course
            ),
            activityLog: completedNow
              ? appendActivityToLog(
                  current,
                  todayKey,
                  "learning",
                  `${previous?.title} tamamlandı`,
                  18,
                  courseId
                )
              : current.activityLog,
          };
        });
      },
      deleteLearningCourse(courseId) {
        setData((current) => ({
          ...current,
          learningCourses: current.learningCourses.filter(
            (course) => course.id !== courseId
          ),
          activityLog: current.activityLog.filter(
            (activity) => activity.entityId !== courseId
          ),
        }));
      },
      addLearningResource(input) {
        setData((current) => ({
          ...current,
          learningResources: [
            {
              id: uid("learning-resource"),
              ...input,
              items: input.items ?? [],
            },
            ...current.learningResources,
          ],
        }));
      },
      updateLearningResource(resourceId, input) {
        setData((current) => ({
          ...current,
          learningResources: current.learningResources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  ...input,
                }
              : resource
          ),
        }));
      },
      addLearningContent(resourceId, input) {
        setData((current) => ({
          ...current,
          learningResources: current.learningResources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  items: [
                    {
                      id: uid("learning-content"),
                      ...input,
                    },
                    ...resource.items,
                  ],
                }
              : resource
          ),
        }));
      },
      updateLearningContent(resourceId, contentId, input) {
        setData((current) => ({
          ...current,
          learningResources: current.learningResources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  items: resource.items.map((item) =>
                    item.id === contentId
                      ? {
                          ...item,
                          ...input,
                        }
                      : item
                  ),
                }
              : resource
          ),
        }));
      },
      deleteLearningContent(resourceId, contentId) {
        setData((current) => ({
          ...current,
          learningResources: current.learningResources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  items: resource.items.filter((item) => item.id !== contentId),
                }
              : resource
          ),
        }));
      },
      deleteLearningResource(resourceId) {
        setData((current) => ({
          ...current,
          learningResources: current.learningResources.filter(
            (resource) => resource.id !== resourceId
          ),
          learningCourses: current.learningCourses.map((course) => ({
            ...course,
            resourceIds: course.resourceIds.filter((id) => id !== resourceId),
          })),
        }));
      },
      resetAllData() {
        setData(createDefaultAppData());
      },
    }),
    [
      achievements,
      activeBook,
      completedRoadmapCount,
      data,
      hydrated,
      masteredNodesCount,
      solvedProblemsCount,
      streak,
      todayKey,
      todayTasks,
      totalXp,
      weeklyXp,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState yalnızca AppStateProvider içinde kullanılabilir.");
  }

  return context;
}
