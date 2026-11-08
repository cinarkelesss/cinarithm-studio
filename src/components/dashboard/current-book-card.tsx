import Link from "next/link";
import { BookOpenText, MoveRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

type CurrentBook = {
  title: string;
  author: string;
  progress: number;
  currentSection: string;
  note: string;
};

type CurrentBookCardProps = {
  book: CurrentBook;
};

export function CurrentBookCard({ book }: CurrentBookCardProps) {
  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-heading text-xl text-white">
            Aktif Kitap
          </CardTitle>
          <Badge className="bg-zinc-100/14 text-zinc-200">Odakta</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-[1.7rem] border border-white/8 bg-zinc-900/70 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-heading text-2xl text-white">{book.title}</p>
              <p className="mt-2 text-sm text-white/46">{book.author}</p>
            </div>
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/80">
              <BookOpenText className="size-5" />
            </div>
          </div>

          <div className="mt-6">
            <Progress value={book.progress} className="gap-2">
              <div className="flex w-full items-center gap-3">
                <ProgressLabel className="text-xs uppercase tracking-[0.2em] text-white/42">
                  İlerleme
                </ProgressLabel>
                <ProgressValue className="text-xs text-white/62" />
              </div>
            </Progress>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/36">
              Sıradaki bölüm
            </p>
            <p className="mt-3 font-medium text-white">{book.currentSection}</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/36">
              Not
            </p>
            <p className="mt-3 text-sm leading-6 text-white/56">{book.note}</p>
          </div>
        </div>

        <Link
          href="/kutuphanem"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] text-sm font-medium text-white transition hover:bg-white/[0.08]"
        >
          Kitap notlarına geç
          <MoveRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
