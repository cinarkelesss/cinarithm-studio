import { BookOpenText, Trash2 } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import {
  selectClassName,
  textAreaClassName,
  textInputClassName,
} from "@/components/app/fields";
import type { LearningResource, LearningResourceFormat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ResourceCardProps = {
  resource: LearningResource;
  usageCount: number;
  linkedCourseTitles: string[];
  contentCount: number;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onFormatChange: (value: LearningResourceFormat) => void;
  onNoteChange: (value: string) => void;
  onDelete: () => void;
};

export function ResourceCard({
  resource,
  usageCount,
  linkedCourseTitles,
  contentCount,
  onTitleChange,
  onAuthorChange,
  onFormatChange,
  onNoteChange,
  onDelete,
}: ResourceCardProps) {
  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="space-y-3 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/78">
            <BookOpenText className="size-5" />
          </div>
          <Button
            variant="destructive"
            className="rounded-2xl"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
            Sil
          </Button>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/72">
                Kullanım durumu
              </p>
              <p className="mt-2 font-heading text-2xl text-white">
                {usageCount} kurs
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100/18 bg-zinc-100/10 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-200/72">
                İçerik
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-50">
                {contentCount}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/46">
            {linkedCourseTitles.length > 0
              ? linkedCourseTitles.slice(0, 2).join(", ")
              : "Henüz hiçbir kursa bağlanmadı."}
          </p>
          <p className="mt-2 text-xs leading-6 text-white/40">
            {contentCount > 0
              ? "Learning Hub izleme alanında doğrudan açılabilir."
              : "Henüz izlenebilir içerik eklenmedi."}
          </p>
        </div>
        <FormField label="Başlık">
          <input
            className={textInputClassName()}
            value={resource.title}
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </FormField>
        <FormField label="Yazar / kurum">
          <input
            className={textInputClassName()}
            value={resource.author}
            onChange={(event) => onAuthorChange(event.target.value)}
          />
        </FormField>
        <FormField label="Tür">
          <select
            className={selectClassName()}
            value={resource.format}
            onChange={(event) =>
              onFormatChange(event.target.value as LearningResourceFormat)
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
            className={textAreaClassName("min-h-[110px]")}
            value={resource.note}
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </FormField>
      </CardContent>
    </Card>
  );
}
