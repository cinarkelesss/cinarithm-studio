"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  CheckCircle2,
  CheckCheck,
  Compass,
  ExternalLink,
  FileText,
  Filter,
  GraduationCap,
  Info,
  LayoutGrid,
  Network,
  PlaySquare,
  Plus,
  Search,
  Sigma,
} from "lucide-react";

import Link from "next/link";
import { FormField } from "@/components/app/form-field";
import {
  selectClassName,
  textInputClassName,
  textAreaClassName,
} from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { CourseCard } from "@/components/learning/course-card";
import { ResourceCard } from "@/components/learning/resource-card";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getLearningContentPresentation,
  isEmbeddableLearningContent,
} from "@/lib/learning-content";
import {
  buildLearningCourseLinks,
  getLearningFocusSnapshot,
} from "@/lib/learning-links";
import type {
  LearningCategory,
  LearningContentKind,
  LearningCourseStatus,
  LearningLevel,
  LearningResourceFormat,
} from "@/lib/types";

const overviewIcons = [GraduationCap, Sigma, BookOpen] as const;

type FeedbackState = {
  tone: "info" | "success" | "warning";
  text: string;
};

type PendingDeleteState =
  | {
      kind: "category" | "course" | "resource";
      id: string;
      label: string;
    }
  | null;

type SortMode = "odak" | "ilerleme" | "alfabetik";

function normalizeLabel(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function computeCategoryProgress(
  courses: Array<{ categoryId: string; progress: number; status: LearningCourseStatus }>,
  categoryId: string
) {
  const categoryCourses = courses.filter((course) => course.categoryId === categoryId);

  if (categoryCourses.length === 0) {
    return {
      averageProgress: 0,
      activeCount: 0,
    };
  }

  return {
    averageProgress: Math.round(
      categoryCourses.reduce((sum, course) => sum + course.progress, 0) /
        categoryCourses.length
    ),
    activeCount: categoryCourses.filter((course) => course.status !== "sırada").length,
  };
}

export function LearningHubPageView() {
  const {
    data,
    addLearningCategory,
    addLearningContent,
    addLearningCourse,
    addLearningResource,
    deleteLearningCategory,
    deleteLearningContent,
    deleteLearningCourse,
    deleteLearningResource,
    updateLearningCategory,
    updateLearningCourse,
    updateLearningResource,
  } = useAppState();
  const [categoryForm, setCategoryForm] = useState({
    title: "",
    description: "",
    emphasis: "",
  });
  const [courseForm, setCourseForm] = useState({
    title: "",
    categoryId: "",
    level: "temel" as LearningLevel,
    summary: "",
    nextStep: "",
    topics: "",
    resourceIds: [] as string[],
    relatedBookIds: [] as string[],
    relatedNodeIds: [] as string[],
    relatedProofIds: [] as string[],
  });
  const [resourceForm, setResourceForm] = useState({
    title: "",
    author: "",
    format: "notlar" as LearningResourceFormat,
    note: "",
  });
  const [contentForm, setContentForm] = useState({
    resourceId: "",
    title: "",
    kind: "video" as LearningContentKind,
    url: "",
    summary: "",
    durationLabel: "",
    sourceLabel: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    LearningCourseStatus | "hepsi"
  >("hepsi");
  const [categoryFilter, setCategoryFilter] = useState<string>("hepsi");
  const [showLinkedOnly, setShowLinkedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("odak");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedContentKey, setSelectedContentKey] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    tone: "info",
    text: "Değişiklikler tarayıcıda otomatik kaydedilir.",
  });
  const [pendingDelete, setPendingDelete] = useState<PendingDeleteState>(null);

  const { learningCategories, learningCourses, learningResources } = data;
  const courseLinks = useMemo(() => buildLearningCourseLinks(data), [data]);
  const focusSnapshot = useMemo(() => getLearningFocusSnapshot(data), [data]);
  const categorySummaries = useMemo(() => {
    return learningCategories.map((category) => ({
      category,
      ...computeCategoryProgress(learningCourses, category.id),
    }));
  }, [learningCategories, learningCourses]);
  const resourceUsage = useMemo(() => {
    return Object.fromEntries(
      learningResources.map((resource) => {
        const linkedCourses = learningCourses.filter((course) =>
          course.resourceIds.includes(resource.id)
        );

        return [
          resource.id,
          {
            count: linkedCourses.length,
            titles: linkedCourses.map((course) => course.title),
          },
        ];
      })
    );
  }, [learningCourses, learningResources]);
  const totalContentCount = useMemo(
    () =>
      learningResources.reduce(
        (sum, resource) => sum + resource.items.length,
        0
      ),
    [learningResources]
  );

  const totalProgress = useMemo(() => {
    if (learningCourses.length === 0) {
      return 0;
    }

    return Math.round(
      learningCourses.reduce((sum, course) => sum + course.progress, 0) /
        learningCourses.length
    );
  }, [learningCourses]);

  const activeCourseCount = learningCourses.filter(
    (course) => course.status !== "sırada"
  ).length;
  const resourceCount = learningResources.length;

  const overviewStats = [
    {
      label: "Genel ilerleme",
      value: `%${totalProgress}`,
      detail: "Tüm akademik rota boyunca ortalama kurs ilerlemesi.",
    },
    {
      label: "Aktif kurs",
      value: String(activeCourseCount),
      detail: "Şu anda masada olan çekirdek çalışma blokları.",
    },
    {
      label: "Kaynak havuzu",
      value: String(resourceCount),
      detail: "Türkçe tonla uyumlu seçilmiş temel kaynaklar.",
    },
  ] as const;
  const canAddCategory = Boolean(
    categoryForm.title.trim() &&
      categoryForm.description.trim() &&
      categoryForm.emphasis.trim()
  );
  const canAddCourse = Boolean(
    courseForm.title.trim() &&
      (courseForm.categoryId || learningCategories[0]?.id) &&
      courseForm.summary.trim()
  );
  const canAddResource = Boolean(
    resourceForm.title.trim() && resourceForm.author.trim()
  );
  const canAddContent = Boolean(
    (contentForm.resourceId || learningResources[0]?.id) &&
      contentForm.title.trim() &&
      contentForm.url.trim() &&
      contentForm.sourceLabel.trim()
  );
  const categoryTitleExists = Boolean(
    categoryForm.title.trim() &&
      learningCategories.some(
        (category) =>
          normalizeLabel(category.title) === normalizeLabel(categoryForm.title)
      )
  );
  const courseTitleExists = Boolean(
    courseForm.title.trim() &&
      learningCourses.some(
        (course) =>
          normalizeLabel(course.title) === normalizeLabel(courseForm.title)
      )
  );
  const resourceTitleExists = Boolean(
    resourceForm.title.trim() &&
      learningResources.some(
        (resource) =>
          normalizeLabel(resource.title) === normalizeLabel(resourceForm.title)
      )
  );
  const viewerCourse = useMemo(() => {
    const explicitCourse = learningCourses.find(
      (course) => course.id === selectedCourseId
    );

    if (explicitCourse) {
      return explicitCourse;
    }

    return focusSnapshot?.course ?? learningCourses[0] ?? null;
  }, [focusSnapshot, learningCourses, selectedCourseId]);
  const viewerResources = useMemo(() => {
    if (!viewerCourse) {
      return [];
    }

    return learningResources.filter((resource) =>
      viewerCourse.resourceIds.includes(resource.id)
    );
  }, [learningResources, viewerCourse]);
  const viewerEntries = useMemo(() => {
    return viewerResources.flatMap((resource) =>
      resource.items.map((item) => ({
        item,
        resource,
      }))
    );
  }, [viewerResources]);
  const activeViewerEntry = useMemo(() => {
    const entry = viewerEntries.find(
      ({ item, resource }) =>
        `${resource.id}::${item.id}` === selectedContentKey
    );

    return entry ?? viewerEntries[0] ?? null;
  }, [selectedContentKey, viewerEntries]);
  const activeViewerPresentation = activeViewerEntry
    ? getLearningContentPresentation(activeViewerEntry.item)
    : null;

  function requestDelete(
    kind: NonNullable<PendingDeleteState>["kind"],
    id: string,
    label: string
  ) {
    setPendingDelete({ kind, id, label });
  }

  function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    if (pendingDelete.kind === "category") {
      deleteLearningCategory(pendingDelete.id);
      setFeedback({
        tone: "warning",
        text: `${pendingDelete.label} kategorisi silindi. Varsa kurslar kalan ilk kategoriye taşındı.`,
      });
    }

    if (pendingDelete.kind === "course") {
      deleteLearningCourse(pendingDelete.id);
      setFeedback({
        tone: "warning",
        text: `${pendingDelete.label} kursu kaldırıldı.`,
      });
    }

    if (pendingDelete.kind === "resource") {
      deleteLearningResource(pendingDelete.id);
      setFeedback({
        tone: "warning",
        text: `${pendingDelete.label} kaynağı silindi ve kurs bağlantıları temizlendi.`,
      });
    }

    setPendingDelete(null);
  }

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    const visibleCourses = learningCourses.filter((course) => {
      const category = learningCategories.find(
        (item) => item.id === course.categoryId
      );
      const link = courseLinks.find((item) => item.courseId === course.id);
      const resources = learningResources.filter((resource) =>
        course.resourceIds.includes(resource.id)
      );
      const hasCourseContent = resources.some((resource) => resource.items.length > 0);

      const matchesQuery =
        query.length === 0 ||
        [
          course.title,
          course.summary,
          course.nextStep,
          course.topics.join(" "),
          category?.title ?? "",
          ...resources.map((resource) => resource.title),
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(query);

      const matchesStatus =
        statusFilter === "hepsi" || course.status === statusFilter;
      const matchesCategory =
        categoryFilter === "hepsi" || course.categoryId === categoryFilter;
      const hasLinks =
        !showLinkedOnly ||
        Boolean(
          (link?.books.length ?? 0) +
            (link?.knowledgeNodes.length ?? 0) +
            (link?.proofs.length ?? 0) +
            Number(hasCourseContent)
        );

      return matchesQuery && matchesStatus && matchesCategory && hasLinks;
    });

    return visibleCourses.sort((left, right) => {
      if (sortMode === "alfabetik") {
        return left.title.localeCompare(right.title, "tr");
      }

      if (sortMode === "ilerleme") {
        return right.progress - left.progress;
      }

      const statusRank: Record<LearningCourseStatus, number> = {
        derinleşiyor: 0,
        başladı: 1,
        sırada: 2,
        tamamlandı: 3,
      };

      const statusDiff = statusRank[left.status] - statusRank[right.status];
      if (statusDiff !== 0) {
        return statusDiff;
      }

      return right.progress - left.progress;
    });
  }, [
    categoryFilter,
    courseLinks,
    learningCategories,
    learningCourses,
    learningResources,
    searchQuery,
    showLinkedOnly,
    sortMode,
    statusFilter,
  ]);

  return (
    <SectionShell
      title="Learning Hub"
      description="ÖSYM/YKS çizgisine sapmadan, akademik matematik için yapılandırılmış kurslar ve kaynaklar burada toplanır. Amaç soru bankası değil; dil, ispat ve kavram kurmaktır."
      eyebrow="Akademik matematik rotası"
      action={
        <>
          <Badge className="bg-white/10 text-white/72">
            {learningCourses.length} kurs kartı
          </Badge>
          <Badge className="bg-zinc-300/14 text-zinc-200">
            {totalContentCount} içerik hazır
          </Badge>
        </>
      }
    >
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="surface-glow overflow-hidden border-border bg-card backdrop-blur-2xl">
          <CardContent className="relative px-5 py-5 sm:px-6 sm:py-6">

            <div className="relative">
              <div className="flex items-center gap-3 text-white/70">
                <Compass className="size-4" />
                <span className="text-sm font-medium">Mevcut yön</span>
              </div>
              <h2 className="mt-4 max-w-2xl font-heading text-2xl text-white sm:text-3xl">
                Temeli tanım diliyle kur, sonra ispat ve analize gir.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                Learning Hub, Cinarithm içindeki diğer alanlarla uyumlu ilerler:
                okuma kütüphaneye, ispat yazımı günlük ve ispatlar bölümüne,
                kavramlar da bilgi ağacına beslenir.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-white/52">
                  <span>Hub genel ilerlemesi</span>
                  <span>%{totalProgress}</span>
                </div>
                <Progress
                  value={totalProgress}
                  className="[&_[data-slot='progress-track']]:h-2.5 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {overviewStats.map((stat, index) => {
            const Icon = overviewIcons[index];

            return (
              <Card
                key={stat.label}
                className="surface-glow border-border bg-card backdrop-blur-xl"
              >
                <CardContent className="flex items-start gap-4 px-5 py-5 sm:px-6">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/78">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/52">{stat.label}</p>
                    <p className="mt-2 font-heading text-2xl text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/54">
                      {stat.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3 text-white/72">
              <PlaySquare className="size-4" />
              <span className="text-sm font-medium">İzleme ve çalışma alanı</span>
            </div>

            <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
              <p className="text-sm font-medium text-white/72">
                Başlangıç akışı
              </p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-white/58">
                <p>1. Kurs seç.</p>
                <p>2. İçeriği aç.</p>
                <p>3. İzledikten sonra sonraki adımı kurs kartında güncelle.</p>
              </div>
            </div>

            <FormField label="İçerik açılacak kurs">
              <select
                className={selectClassName()}
                value={viewerCourse?.id ?? ""}
                onChange={(event) => {
                  setSelectedCourseId(event.target.value);
                  setSelectedContentKey("");
                }}
              >
                {learningCourses.map((course) => {
                  const contentCount = learningResources
                    .filter((resource) => course.resourceIds.includes(resource.id))
                    .reduce((sum, resource) => sum + resource.items.length, 0);

                  return (
                    <option key={course.id} value={course.id}>
                      {course.title} {contentCount > 0 ? `(${contentCount})` : ""}
                    </option>
                  );
                })}
              </select>
            </FormField>

            {viewerCourse ? (
              <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white/72">
                      Seçili kurs
                    </p>
                    <p className="mt-2 font-heading text-2xl text-white">
                      {viewerCourse.title}
                    </p>
                  </div>
                  <Badge className="bg-white/10 text-white/72">
                    {viewerEntries.length} içerik
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  {viewerCourse.nextStep}
                </p>
              </div>
            ) : null}

            {viewerEntries.length > 0 ? (
              <div className="space-y-3">
                {viewerEntries.map(({ item, resource }) => {
                  const contentKey = `${resource.id}::${item.id}`;
                  const selected = activeViewerEntry
                    ? activeViewerEntry.item.id === item.id &&
                      activeViewerEntry.resource.id === resource.id
                    : false;

                  return (
                    <button
                      key={contentKey}
                      type="button"
                      className={
                        selected
                          ? "w-full rounded-3xl border border-zinc-100/28 bg-zinc-100/12 px-4 py-4 text-left"
                          : "w-full rounded-3xl border border-white/8 bg-black/10 px-4 py-4 text-left transition hover:bg-black/18"
                      }
                      onClick={() => setSelectedContentKey(contentKey)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                            {resource.title}
                          </p>
                        </div>
                        <Badge className="bg-white/10 text-white/72">
                          {item.kind}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/56">
                        {item.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className="bg-white/10 text-white/72">
                          {item.sourceLabel}
                        </Badge>
                        {item.durationLabel ? (
                          <Badge className="bg-white/10 text-white/72">
                            {item.durationLabel}
                          </Badge>
                        ) : null}
                        <Badge className="bg-zinc-300/14 text-zinc-200">
                          {isEmbeddableLearningContent(item)
                            ? "Site içinde açılır"
                            : "Harici bağlantı"}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/12 bg-black/10 px-4 py-6">
                <p className="text-sm font-medium text-white/72">
                  Bu kurs için içerik bulunmuyor.
                </p>
                <p className="mt-2 text-sm leading-7 text-white/56">
                  Sağdaki formla bir YouTube, PDF veya site içi not bağlantısı
                  eklediğinde burada hemen görünür.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-white/72">
                <FileText className="size-4" />
                <span className="text-sm font-medium">İçerik görüntüleyici</span>
              </div>
              {activeViewerEntry ? (
                <Link
                  href={activeViewerEntry.item.url}
                  target="_blank"
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Yeni sekmede aç
                </Link>
              ) : null}
            </div>

            {activeViewerEntry && activeViewerPresentation ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                    {activeViewerEntry.resource.title}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl text-white">
                    {activeViewerEntry.item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    {activeViewerEntry.item.summary}
                  </p>
                </div>

                {activeViewerPresentation.mode === "iframe" ? (
                  <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111113]">
                    <iframe
                      key={activeViewerPresentation.src}
                      title={activeViewerEntry.item.title}
                      src={activeViewerPresentation.src}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : activeViewerPresentation.mode === "video" ? (
                  <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111113]">
                    <video
                      key={activeViewerPresentation.src}
                      src={activeViewerPresentation.src}
                      controls
                      className="aspect-video w-full"
                    />
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-white/10 bg-black/14 px-5 py-6">
                    <p className="text-sm font-medium text-white/72">
                      Bu bağlantı güvenli gömülemiyor.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-white/56">
                      Yine de kaynak hazır; yeni sekmede açıp çalışmaya devam
                      edebilirsin.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/10 text-white/72">
                    {activeViewerEntry.item.kind}
                  </Badge>
                  <Badge className="bg-white/10 text-white/72">
                    {activeViewerEntry.item.sourceLabel}
                  </Badge>
                  {activeViewerEntry.item.durationLabel ? (
                    <Badge className="bg-white/10 text-white/72">
                      {activeViewerEntry.item.durationLabel}
                    </Badge>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-black/10 px-5 py-8">
                <p className="font-heading text-2xl text-white">
                  Henüz açılacak içerik yok
                </p>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  Başlangıç için mevcut örnek notları seçebilir ya da aşağıdan
                  kendi içerik bağlantını ekleyebilirsin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="flex items-start gap-4 px-5 py-5 sm:px-6">
            <div
              className={
                feedback.tone === "success"
                  ? "flex size-11 items-center justify-center rounded-2xl border border-zinc-300/20 bg-zinc-300/12 text-zinc-200"
                  : feedback.tone === "warning"
                    ? "flex size-11 items-center justify-center rounded-2xl border border-zinc-400/20 bg-zinc-400/12 text-zinc-200"
                    : "flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/78"
              }
            >
              {feedback.tone === "success" ? (
                <CheckCircle2 className="size-5" />
              ) : feedback.tone === "warning" ? (
                <AlertTriangle className="size-5" />
              ) : (
                <Info className="size-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white/78">Durum</p>
              <p className="mt-2 text-sm leading-7 text-white/58">
                {feedback.text}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3 text-white/72">
              <AlertTriangle className="size-4" />
              <span className="text-sm font-medium">Güvenli silme</span>
            </div>

            {pendingDelete ? (
              <>
                <p className="text-sm leading-7 text-white/60">
                  <span className="text-white">{pendingDelete.label}</span> için
                  silme onayı bekleniyor.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="destructive"
                    className="rounded-2xl"
                    onClick={confirmDelete}
                  >
                    Evet, sil
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                    onClick={() => setPendingDelete(null)}
                  >
                    Vazgeç
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm leading-7 text-white/56">
                Silme düğmeleri önce bu alanda onay ister. Yanlış bir şeye
                dokununca doğrudan uçmaz.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {learningCategories.map((category) => {
          const summary = categorySummaries.find(
            (item) => item.category.id === category.id
          );
          const courseCount = learningCourses.filter(
            (course) => course.categoryId === category.id
          ).length;
          const canDeleteCategory = learningCategories.length > 1;

          return (
            <Card
              key={category.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-3 px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/78">
                    <LayoutGrid className="size-5" />
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Badge className="bg-white/10 text-white/72">
                      {courseCount} kurs
                    </Badge>
                    <Badge className="bg-zinc-100/14 text-zinc-200">
                      %{summary?.averageProgress ?? 0}
                    </Badge>
                  </div>
                </div>
                <FormField label="Başlık">
                  <input
                    className={textInputClassName()}
                    value={category.title}
                    onChange={(event) =>
                      updateLearningCategory(category.id, {
                        title: event.target.value,
                      })
                    }
                  />
                </FormField>
                <FormField label="Açıklama">
                  <textarea
                    className={textAreaClassName("min-h-[110px]")}
                    value={category.description}
                    onChange={(event) =>
                      updateLearningCategory(category.id, {
                        description: event.target.value,
                      })
                    }
                  />
                </FormField>
                <FormField label="Vurgu">
                  <input
                    className={textInputClassName()}
                    value={category.emphasis}
                    onChange={(event) =>
                      updateLearningCategory(category.id, {
                        emphasis: event.target.value,
                      })
                    }
                  />
                </FormField>
                <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-sm text-white/62">
                    <span>Aktif çalışma bloğu</span>
                    <span>{summary?.activeCount ?? 0}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-white/46">
                    <span>Ortalama ilerleme</span>
                    <span>%{summary?.averageProgress ?? 0}</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="rounded-2xl"
                  disabled={!canDeleteCategory}
                  onClick={() =>
                    requestDelete("category", category.id, category.title)
                  }
                >
                  Kategoriyi sil
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3 text-white/72">
              <Search className="size-4" />
              <span className="text-sm font-medium">Kursları daralt</span>
            </div>

            <FormField label="Arama">
              <input
                className={textInputClassName()}
                placeholder="Kurs, konu, kaynak veya kategori ara"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Durum">
                <select
                  className={selectClassName()}
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as LearningCourseStatus | "hepsi"
                    )
                  }
                >
                  <option value="hepsi">Hepsi</option>
                  <option value="sırada">Sırada</option>
                  <option value="başladı">Başladı</option>
                  <option value="derinleşiyor">Derinleşiyor</option>
                  <option value="tamamlandı">Tamamlandı</option>
                </select>
              </FormField>

              <FormField label="Kategori">
                <select
                  className={selectClassName()}
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="hepsi">Hepsi</option>
                  {learningCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Sıralama">
              <select
                className={selectClassName()}
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as SortMode)
                }
              >
                <option value="odak">Odak sırası</option>
                <option value="ilerleme">İlerleme yüksekten</option>
                <option value="alfabetik">Alfabetik</option>
              </select>
            </FormField>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={showLinkedOnly ? "default" : "outline"}
                className={
                  showLinkedOnly
                    ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                    : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                }
                onClick={() => setShowLinkedOnly((current) => !current)}
              >
                <Filter className="size-4" />
                Sadece bağlı içerikler
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("hepsi");
                  setCategoryFilter("hepsi");
                  setShowLinkedOnly(false);
                }}
              >
                Filtreleri temizle
              </Button>
              <Badge className="bg-white/10 text-white/72">
                {filteredCourses.length} görünür kurs
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3 text-white/72">
              <CheckCheck className="size-4" />
              <span className="text-sm font-medium">Odak kursu</span>
            </div>

            {focusSnapshot ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                    {learningCategories.find(
                      (item) => item.id === focusSnapshot.course.categoryId
                    )?.title ?? "Akademik rota"}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl text-white">
                    {focusSnapshot.course.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    {focusSnapshot.course.summary}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/52">
                    <span>İlerleme</span>
                    <span>%{focusSnapshot.course.progress}</span>
                  </div>
                  <Progress value={focusSnapshot.course.progress} />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/68">
                      <BookMarked className="size-4" />
                      Kitap
                    </div>
                    <p className="mt-2 font-heading text-2xl text-white">
                      {focusSnapshot.links.books.length}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/68">
                      <Network className="size-4" />
                      Düğüm
                    </div>
                    <p className="mt-2 font-heading text-2xl text-white">
                      {focusSnapshot.links.knowledgeNodes.length}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/68">
                      <Sigma className="size-4" />
                      İspat
                    </div>
                    <p className="mt-2 font-heading text-2xl text-white">
                      {focusSnapshot.links.proofs.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
                  <p className="text-sm font-medium text-white/72">
                    Sıradaki net adım
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/56">
                    {focusSnapshot.course.nextStep}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm leading-7 text-white/56">
                Henüz odak kursu oluşmadı. İlk kursu eklediğinde burada görünür.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.14fr_0.86fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/34">
              Kurs kartları
            </p>
            <h2 className="mt-2 font-heading text-2xl text-white">
              Çalışma blokları
            </h2>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="surface-glow border-border bg-card backdrop-blur-xl">
              <CardContent className="px-5 py-8 text-center sm:px-6">
                <p className="font-heading text-2xl text-white">
                  Bu filtrede kurs görünmüyor
                </p>
                <p className="mt-3 text-sm leading-7 text-white/56">
                  Aramayı gevşet, filtreyi temizle ya da yeni kurs ekle.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {filteredCourses.map((course) => {
            const category = learningCategories.find(
              (item) => item.id === course.categoryId
            );
            const resources = learningResources.filter((resource) =>
              course.resourceIds.includes(resource.id)
            );
            const courseLink = courseLinks.find((item) => item.courseId === course.id);
            const contentCount = resources.reduce(
              (sum, resource) => sum + resource.items.length,
              0
            );

            return (
              <CourseCard
                key={course.id}
                course={course}
                categoryTitle={category?.title ?? "Akademik rota"}
                categories={learningCategories as LearningCategory[]}
                selectedResources={resources}
                availableResources={learningResources}
                contentCount={contentCount}
                books={data.books}
                nodes={data.knowledgeNodes}
                proofs={data.proofs}
                onTitleChange={(title) =>
                  updateLearningCourse(course.id, { title })
                }
                onSummaryChange={(summary) =>
                  updateLearningCourse(course.id, { summary })
                }
                onTopicsChange={(topics) =>
                  updateLearningCourse(course.id, { topics })
                }
                onProgressChange={(progress) =>
                  updateLearningCourse(course.id, { progress })
                }
                onCategoryChange={(categoryId) =>
                  updateLearningCourse(course.id, { categoryId })
                }
                onLevelChange={(level) =>
                  updateLearningCourse(course.id, { level })
                }
                onStatusChange={(status: LearningCourseStatus) =>
                  updateLearningCourse(course.id, { status })
                }
                onNextStepChange={(nextStep) =>
                  updateLearningCourse(course.id, { nextStep })
                }
                onResourceIdsChange={(resourceIds) =>
                  updateLearningCourse(course.id, { resourceIds })
                }
                onRelatedBooksChange={(relatedBookIds) =>
                  updateLearningCourse(course.id, { relatedBookIds })
                }
                onRelatedNodesChange={(relatedNodeIds) =>
                  updateLearningCourse(course.id, { relatedNodeIds })
                }
                onRelatedProofsChange={(relatedProofIds) =>
                  updateLearningCourse(course.id, { relatedProofIds })
                }
                onOpenContent={() => {
                  setSelectedCourseId(course.id);
                  setSelectedContentKey("");
                }}
                onDelete={() => requestDelete("course", course.id, course.title)}
                linkedBooks={courseLink?.books ?? []}
                linkedNodes={courseLink?.knowledgeNodes ?? []}
                linkedProofs={courseLink?.proofs ?? []}
              />
            );
          })}
        </div>

        <div className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                  Yeni kategori
                </p>
                <h2 className="mt-2 font-heading text-xl text-white">
                  Akademik dal ekle
                </h2>
              </div>

              <FormField label="Kategori başlığı">
                <input
                  className={textInputClassName()}
                  value={categoryForm.title}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </FormField>
              {categoryTitleExists ? (
                <p className="text-sm text-zinc-300">
                  Bu başlıkta bir kategori zaten var.
                </p>
              ) : null}

              <FormField label="Açıklama">
                <textarea
                  className={textAreaClassName()}
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Vurgu">
                <input
                  className={textInputClassName()}
                  value={categoryForm.emphasis}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      emphasis: event.target.value,
                    }))
                  }
                />
              </FormField>

              <Button
                className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                disabled={!canAddCategory || categoryTitleExists}
                onClick={() => {
                  if (!canAddCategory || categoryTitleExists) {
                    return;
                  }

                  addLearningCategory({
                    title: categoryForm.title.trim(),
                    description: categoryForm.description.trim(),
                    emphasis: categoryForm.emphasis.trim(),
                  });

                  setCategoryForm({
                    title: "",
                    description: "",
                    emphasis: "",
                  });
                  setFeedback({
                    tone: "success",
                    text: "Yeni kategori eklendi.",
                  });
                }}
              >
                <Plus className="size-4" />
                Kategori ekle
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                  Yeni kurs
                </p>
                <h2 className="mt-2 font-heading text-xl text-white">
                  Çalışma bloğu ekle
                </h2>
              </div>

              <FormField label="Kurs adı">
                <input
                  className={textInputClassName()}
                  value={courseForm.title}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </FormField>
              {courseTitleExists ? (
                <p className="text-sm text-zinc-300">
                  Bu başlıkta bir kurs zaten var.
                </p>
              ) : null}

              <FormField label="Kategori">
                <select
                  className={selectClassName()}
                  value={courseForm.categoryId}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                >
                  <option value="">Kategori seç</option>
                  {learningCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Seviye">
                <select
                  className={selectClassName()}
                  value={courseForm.level}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      level: event.target.value as LearningLevel,
                    }))
                  }
                >
                  <option value="temel">Temel</option>
                  <option value="orta">Orta</option>
                </select>
              </FormField>

              <FormField label="Özet">
                <textarea
                  className={textAreaClassName()}
                  value={courseForm.summary}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Sıradaki adım">
                <textarea
                  className={textAreaClassName("min-h-[100px]")}
                  value={courseForm.nextStep}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      nextStep: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Başlıklar">
                <input
                  className={textInputClassName()}
                  placeholder="Örn. kümeler, fonksiyonlar, niceleyiciler"
                  value={courseForm.topics}
                  onChange={(event) =>
                    setCourseForm((current) => ({
                      ...current,
                      topics: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Kaynak bağlantıları">
                <div className="flex flex-wrap gap-2">
                  {learningResources.map((resource) => {
                    const selected = courseForm.resourceIds.includes(resource.id);

                    return (
                      <Button
                        key={resource.id}
                        variant={selected ? "default" : "outline"}
                        className={
                          selected
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() =>
                          setCourseForm((current) => ({
                            ...current,
                            resourceIds: selected
                              ? current.resourceIds.filter((id) => id !== resource.id)
                              : [...current.resourceIds, resource.id],
                          }))
                        }
                      >
                        {resource.title}
                      </Button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Bağlı kitaplar">
                <div className="flex flex-wrap gap-2">
                  {data.books.map((book) => {
                    const selected = courseForm.relatedBookIds.includes(book.id);

                    return (
                      <Button
                        key={book.id}
                        variant={selected ? "default" : "outline"}
                        className={
                          selected
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() =>
                          setCourseForm((current) => ({
                            ...current,
                            relatedBookIds: selected
                              ? current.relatedBookIds.filter((id) => id !== book.id)
                              : [...current.relatedBookIds, book.id],
                          }))
                        }
                      >
                        {book.title}
                      </Button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Bağlı düğümler">
                <div className="flex flex-wrap gap-2">
                  {data.knowledgeNodes.map((node) => {
                    const selected = courseForm.relatedNodeIds.includes(node.id);

                    return (
                      <Button
                        key={node.id}
                        variant={selected ? "default" : "outline"}
                        className={
                          selected
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() =>
                          setCourseForm((current) => ({
                            ...current,
                            relatedNodeIds: selected
                              ? current.relatedNodeIds.filter((id) => id !== node.id)
                              : [...current.relatedNodeIds, node.id],
                          }))
                        }
                      >
                        {node.title}
                      </Button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Bağlı ispatlar">
                <div className="flex flex-wrap gap-2">
                  {data.proofs.map((proof) => {
                    const selected = courseForm.relatedProofIds.includes(proof.id);

                    return (
                      <Button
                        key={proof.id}
                        variant={selected ? "default" : "outline"}
                        className={
                          selected
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() =>
                          setCourseForm((current) => ({
                            ...current,
                            relatedProofIds: selected
                              ? current.relatedProofIds.filter((id) => id !== proof.id)
                              : [...current.relatedProofIds, proof.id],
                          }))
                        }
                      >
                        {proof.title}
                      </Button>
                    );
                  })}
                </div>
              </FormField>

              <Button
                className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                disabled={!canAddCourse || courseTitleExists}
                onClick={() => {
                  const categoryId =
                    courseForm.categoryId || learningCategories[0]?.id || "";

                  if (!canAddCourse || !categoryId || courseTitleExists) {
                    return;
                  }

                  addLearningCourse({
                    title: courseForm.title.trim(),
                    categoryId,
                    level: courseForm.level,
                    progress: 0,
                    status: "sırada",
                    summary: courseForm.summary.trim(),
                    nextStep: courseForm.nextStep.trim() || "İlk küçük adımı tanımla.",
                    topics: courseForm.topics
                      .split(",")
                      .map((topic) => topic.trim())
                      .filter(Boolean),
                    resourceIds: courseForm.resourceIds,
                    relatedBookIds: courseForm.relatedBookIds,
                    relatedNodeIds: courseForm.relatedNodeIds,
                    relatedProofIds: courseForm.relatedProofIds,
                  });

                  setCourseForm({
                    title: "",
                    categoryId: "",
                    level: "temel",
                    summary: "",
                    nextStep: "",
                    topics: "",
                    resourceIds: [],
                    relatedBookIds: [],
                    relatedNodeIds: [],
                    relatedProofIds: [],
                  });
                  setFeedback({
                    tone: "success",
                    text: "Yeni kurs eklendi.",
                  });
                }}
              >
                <Plus className="size-4" />
                Kurs ekle
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                  Yeni kaynak
                </p>
                <h2 className="mt-2 font-heading text-xl text-white">
                  Kaynak havuzunu genişlet
                </h2>
              </div>

              <FormField label="Başlık">
                <input
                  className={textInputClassName()}
                  value={resourceForm.title}
                  onChange={(event) =>
                    setResourceForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </FormField>
              {resourceTitleExists ? (
                <p className="text-sm text-zinc-300">
                  Bu başlıkta bir kaynak zaten var.
                </p>
              ) : null}

              <FormField label="Yazar / kurum">
                <input
                  className={textInputClassName()}
                  value={resourceForm.author}
                  onChange={(event) =>
                    setResourceForm((current) => ({
                      ...current,
                      author: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Tür">
                <select
                  className={selectClassName()}
                  value={resourceForm.format}
                  onChange={(event) =>
                    setResourceForm((current) => ({
                      ...current,
                      format: event.target.value as LearningResourceFormat,
                    }))
                  }
                >
                  <option value="notlar">Notlar</option>
                  <option value="ders serisi">Ders serisi</option>
                  <option value="kitap">Kitap</option>
                  <option value="okuma listesi">Okuma listesi</option>
                </select>
              </FormField>

              <FormField label="Kısa not">
                <textarea
                  className={textAreaClassName()}
                  value={resourceForm.note}
                  onChange={(event) =>
                    setResourceForm((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                />
              </FormField>

              <Button
                className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                disabled={!canAddResource || resourceTitleExists}
                onClick={() => {
                  if (!canAddResource || resourceTitleExists) {
                    return;
                  }

                  addLearningResource({
                    title: resourceForm.title.trim(),
                    author: resourceForm.author.trim(),
                    format: resourceForm.format,
                    note: resourceForm.note.trim(),
                  });

                  setResourceForm({
                    title: "",
                    author: "",
                    format: "notlar",
                    note: "",
                  });
                  setFeedback({
                    tone: "success",
                    text: "Yeni kaynak eklendi.",
                  });
                }}
              >
                <Plus className="size-4" />
                Kaynağı ekle
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                  Yeni içerik
                </p>
                <h2 className="mt-2 font-heading text-xl text-white">
                  İzlenebilir bağlantı ekle
                </h2>
              </div>

              <FormField label="Bağlanacak kaynak">
                <select
                  className={selectClassName()}
                  value={contentForm.resourceId}
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      resourceId: event.target.value,
                    }))
                  }
                >
                  <option value="">Kaynak seç</option>
                  {learningResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.title}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="İçerik başlığı">
                <input
                  className={textInputClassName()}
                  value={contentForm.title}
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Tür">
                  <select
                    className={selectClassName()}
                    value={contentForm.kind}
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        kind: event.target.value as LearningContentKind,
                      }))
                    }
                  >
                    <option value="video">Video</option>
                    <option value="not">Not</option>
                    <option value="pdf">PDF</option>
                    <option value="makale">Makale</option>
                  </select>
                </FormField>

                <FormField label="Süre etiketi">
                  <input
                    className={textInputClassName()}
                    placeholder="Örn. 12 dk"
                    value={contentForm.durationLabel}
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        durationLabel: event.target.value,
                      }))
                    }
                  />
                </FormField>
              </div>

              <FormField label="Bağlantı">
                <input
                  className={textInputClassName()}
                  placeholder="YouTube, PDF ya da /learning-embed/... bağlantısı"
                  value={contentForm.url}
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Kaynak etiketi">
                <input
                  className={textInputClassName()}
                  placeholder="Örn. YouTube, Cinarithm içeriği"
                  value={contentForm.sourceLabel}
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      sourceLabel: event.target.value,
                    }))
                  }
                />
              </FormField>

              <FormField label="Kısa açıklama">
                <textarea
                  className={textAreaClassName("min-h-[110px]")}
                  value={contentForm.summary}
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                />
              </FormField>

              <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4 text-sm leading-7 text-white/56">
                YouTube linki verirsen gömülü açmayı dener. PDF ve site içi
                not sayfaları da doğrudan görüntülenir.
              </div>

              <Button
                className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                disabled={!canAddContent}
                onClick={() => {
                  const resourceId =
                    contentForm.resourceId || learningResources[0]?.id || "";

                  if (!canAddContent || !resourceId) {
                    return;
                  }

                  addLearningContent(resourceId, {
                    title: contentForm.title.trim(),
                    kind: contentForm.kind,
                    url: contentForm.url.trim(),
                    summary: contentForm.summary.trim() || "Kısa açıklama eklenmedi.",
                    durationLabel: contentForm.durationLabel.trim(),
                    sourceLabel: contentForm.sourceLabel.trim(),
                  });

                  setContentForm({
                    resourceId: "",
                    title: "",
                    kind: "video",
                    url: "",
                    summary: "",
                    durationLabel: "",
                    sourceLabel: "",
                  });
                  setFeedback({
                    tone: "success",
                    text: "Yeni öğrenme içeriği eklendi.",
                  });
                }}
              >
                <Plus className="size-4" />
                İçeriği ekle
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/34">
            Kaynaklar
          </p>
          <h2 className="mt-2 font-heading text-2xl text-white">
            Türkçe akademik çizgiye uygun temel set
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              usageCount={resourceUsage[resource.id]?.count ?? 0}
              linkedCourseTitles={resourceUsage[resource.id]?.titles ?? []}
              contentCount={resource.items.length}
              onTitleChange={(title) =>
                updateLearningResource(resource.id, { title })
              }
              onAuthorChange={(author) =>
                updateLearningResource(resource.id, { author })
              }
              onFormatChange={(format) =>
                updateLearningResource(resource.id, { format })
              }
              onNoteChange={(note) =>
                updateLearningResource(resource.id, { note })
              }
              onDelete={() =>
                requestDelete("resource", resource.id, resource.title)
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/34">
            İçerik kütüphanesi
          </p>
          <h2 className="mt-2 font-heading text-2xl text-white">
            Site içinde açılabilen çalışma parçaları
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {learningResources
            .filter((resource) => resource.items.length > 0)
            .map((resource) => (
              <Card
                key={resource.id}
                className="surface-glow border-border bg-card backdrop-blur-xl"
              >
                <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {resource.title}
                      </p>
                      <p className="mt-1 text-sm text-white/52">
                        {resource.items.length} içerik
                      </p>
                    </div>
                    <Badge className="bg-white/10 text-white/72">
                      {resource.format}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {resource.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-white/54">
                              {item.summary}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                              onClick={() => {
                                setSelectedCourseId(
                                  learningCourses.find((course) =>
                                    course.resourceIds.includes(resource.id)
                                  )?.id ?? ""
                                );
                                setSelectedContentKey(`${resource.id}::${item.id}`);
                              }}
                            >
                              Aç
                            </button>
                            <Link
                              href={item.url}
                              target="_blank"
                              className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                            >
                              <ExternalLink className="mr-2 size-4" />
                              Dışarıda aç
                            </Link>
                            <Button
                              variant="destructive"
                              className="rounded-2xl"
                              onClick={() => {
                                deleteLearningContent(resource.id, item.id);
                                setFeedback({
                                  tone: "warning",
                                  text: `${item.title} içerik listesinden kaldırıldı.`,
                                });
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      <section>
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/34">
                Ana akış
              </p>
              <h2 className="mt-2 font-heading text-2xl text-white">
                Learning Hub artık diğer bölümlerle aynı sistemde çalışıyor
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                Kurslarını burada kur, sonra kitap, düğüm ve ispat üzerinden
                doğal biçimde ilerlet.
              </p>
            </div>

            <Link
              href="/"
              className="flex h-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              Ana Sayfaya dön
            </Link>
          </CardContent>
        </Card>
      </section>
    </SectionShell>
  );
}
