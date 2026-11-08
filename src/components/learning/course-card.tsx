import Link from "next/link";
import {
  ArrowUpRight,
  BookMarked,
  CircleDot,
  Layers3,
  Network,
  Sigma,
  Trash2,
} from "lucide-react";

import {
  selectClassName,
  textAreaClassName,
  textInputClassName,
} from "@/components/app/fields";
import type {
  Book,
  KnowledgeNode,
  LearningCategory,
  LearningCourse,
  LearningCourseStatus,
  LearningLevel,
  LearningResource,
  Proof,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type CourseCardProps = {
  course: LearningCourse;
  categoryTitle: string;
  categories: LearningCategory[];
  selectedResources: LearningResource[];
  availableResources: LearningResource[];
  contentCount: number;
  books: Book[];
  nodes: KnowledgeNode[];
  proofs: Proof[];
  onTitleChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onTopicsChange: (value: string[]) => void;
  onProgressChange: (value: number) => void;
  onCategoryChange: (categoryId: string) => void;
  onLevelChange: (level: LearningLevel) => void;
  onStatusChange: (status: LearningCourseStatus) => void;
  onNextStepChange: (value: string) => void;
  onResourceIdsChange: (ids: string[]) => void;
  onRelatedBooksChange: (ids: string[]) => void;
  onRelatedNodesChange: (ids: string[]) => void;
  onRelatedProofsChange: (ids: string[]) => void;
  onOpenContent: () => void;
  onDelete: () => void;
  linkedBooks: Book[];
  linkedNodes: KnowledgeNode[];
  linkedProofs: Proof[];
};

const statusToneMap = {
  başladı: "bg-zinc-100/14 text-zinc-200",
  derinleşiyor: "bg-zinc-300/14 text-zinc-200",
  sırada: "bg-white/10 text-white/72",
  tamamlandı: "bg-zinc-200/16 text-zinc-200",
} as const;

export function CourseCard({
  course,
  categoryTitle,
  categories,
  selectedResources,
  availableResources,
  contentCount,
  books,
  nodes,
  proofs,
  onTitleChange,
  onSummaryChange,
  onTopicsChange,
  onProgressChange,
  onCategoryChange,
  onLevelChange,
  onStatusChange,
  onNextStepChange,
  onResourceIdsChange,
  onRelatedBooksChange,
  onRelatedNodesChange,
  onRelatedProofsChange,
  onOpenContent,
  onDelete,
  linkedBooks,
  linkedNodes,
  linkedProofs,
}: CourseCardProps) {
  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="space-y-5 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/38">
              {categoryTitle}
            </p>
            <input
              className={textInputClassName("mt-2 h-12 text-lg font-semibold")}
              value={course.title}
              onChange={(event) => onTitleChange(event.target.value)}
            />
            <textarea
              className={textAreaClassName("mt-3 min-h-[110px]")}
              value={course.summary}
              onChange={(event) => onSummaryChange(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={statusToneMap[course.status]}>{course.status}</Badge>
            <Badge className="bg-white/10 text-white/72">{course.level}</Badge>
            <Button
              variant="outline"
              className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              onClick={onOpenContent}
            >
              {contentCount > 0 ? `${contentCount} içerik aç` : "İçerik ekle"}
            </Button>
            <Button
              variant="destructive"
              className="rounded-2xl"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
              Sil
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-white/52">
            <span>Kurs ilerlemesi</span>
            <span>%{course.progress}</span>
          </div>
          <Progress value={course.progress} className="[&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100" />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={course.progress}
            onChange={(event) => onProgressChange(Number(event.target.value))}
            className="w-full accent-zinc-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            ["sırada", "başladı", "derinleşiyor", "tamamlandı"] as const
          ).map((status) => (
            <Button
              key={status}
              variant={course.status === status ? "default" : "outline"}
              className={
                course.status === status
                  ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                  : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              }
              onClick={() => onStatusChange(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/72">
              <Layers3 className="size-4" />
              Odak başlıkları
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                className={textInputClassName()}
                value={course.topics.join(", ")}
                onChange={(event) =>
                  onTopicsChange(
                    event.target.value
                      .split(",")
                      .map((topic) => topic.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Örn. kümeler, fonksiyonlar, niceleyiciler"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-white/72">
              <BookMarked className="size-4" />
              Kurs ayarları
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/34">
                  Kategori
                </p>
                <select
                  className={selectClassName()}
                  value={course.categoryId}
                  onChange={(event) => onCategoryChange(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/34">
                  Seviye
                </p>
                <select
                  className={selectClassName()}
                  value={course.level}
                  onChange={(event) =>
                    onLevelChange(event.target.value as LearningLevel)
                  }
                >
                  <option value="temel">Temel</option>
                  <option value="orta">Orta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/72">
                Kaynak çizgisi
              </p>
              <p className="mt-1 text-sm leading-6 text-white/46">
                Bu kurs hangi ders notu, kitap veya okuma listesiyle ilerliyor?
              </p>
            </div>
            <Badge className="bg-white/10 text-white/72">
              {selectedResources.length} kaynak
            </Badge>
          </div>

          {selectedResources.length > 0 ? (
            <div className="space-y-2">
              {selectedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border border-white/8 bg-black/10 px-3 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white">{resource.title}</p>
                    <Badge className="bg-white/10 text-white/72">
                      {resource.format}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-white/44">{resource.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-white/46">
              Henüz kaynak bağlanmadı. En az bir temel kaynak seçmek bu kursu
              daha okunabilir hale getirir.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {availableResources.map((resource) => {
              const selected = course.resourceIds.includes(resource.id);

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
                    onResourceIdsChange(
                      selected
                        ? course.resourceIds.filter((id) => id !== resource.id)
                        : [...course.resourceIds, resource.id]
                    )
                  }
                >
                  {resource.title}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Link
            href="/kutuphanem"
            className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4 transition hover:bg-black/18"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-white/72">
              <BookMarked className="size-4" />
              Kütüphanem
            </div>
            <p className="mt-2 font-heading text-2xl text-white">
              {linkedBooks.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {linkedBooks[0]?.title ?? "Henüz eşleşen kitap yok."}
            </p>
          </Link>

          <Link
            href="/bilgi-agaci"
            className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4 transition hover:bg-black/18"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-white/72">
              <Network className="size-4" />
              Bilgi Ağacı
            </div>
            <p className="mt-2 font-heading text-2xl text-white">
              {linkedNodes.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {linkedNodes[0]?.title ?? "Henüz eşleşen düğüm yok."}
            </p>
          </Link>

          <Link
            href="/ispatlarim"
            className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4 transition hover:bg-black/18"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-white/72">
              <Sigma className="size-4" />
              İspatlarım
            </div>
            <p className="mt-2 font-heading text-2xl text-white">
              {linkedProofs.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {linkedProofs[0]?.title ?? "Henüz eşleşen ispat yok."}
            </p>
          </Link>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-white/72">Açık bağlantılar</p>
            <p className="mt-1 text-sm leading-6 text-white/46">
              Bu kursun bağlanacağı kitap, düğüm ve ispatları doğrudan seç.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              Kitaplar
            </p>
            <div className="flex flex-wrap gap-2">
              {books.map((book) => {
                const selected = course.relatedBookIds.includes(book.id);

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
                      onRelatedBooksChange(
                        selected
                          ? course.relatedBookIds.filter((id) => id !== book.id)
                          : [...course.relatedBookIds, book.id]
                      )
                    }
                  >
                    {book.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              Düğümler
            </p>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => {
                const selected = course.relatedNodeIds.includes(node.id);

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
                      onRelatedNodesChange(
                        selected
                          ? course.relatedNodeIds.filter((id) => id !== node.id)
                          : [...course.relatedNodeIds, node.id]
                      )
                    }
                  >
                    {node.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              İspatlar
            </p>
            <div className="flex flex-wrap gap-2">
              {proofs.map((proof) => {
                const selected = course.relatedProofIds.includes(proof.id);

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
                      onRelatedProofsChange(
                        selected
                          ? course.relatedProofIds.filter((id) => id !== proof.id)
                          : [...course.relatedProofIds, proof.id]
                      )
                    }
                  >
                    {proof.title}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-black/10 px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white/72">
            <CircleDot className="size-4" />
            Sıradaki net adım
          </div>
          <div className="mt-3">
            <textarea
              className={textAreaClassName("min-h-[100px]")}
              value={course.nextStep}
              onChange={(event) => onNextStepChange(event.target.value)}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/34">
            <ArrowUpRight className="size-3.5" />
            Küçük ama düzenli ilerleme
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
