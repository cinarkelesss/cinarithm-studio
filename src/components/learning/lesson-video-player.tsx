"use client";

import { useState } from "react";
import { AlertCircle, ExternalLink, MonitorPlay, PlayCircle } from "lucide-react";

import type { LearningLesson } from "@/lib/learning/domain";
import {
  getVideoOpenUrl,
  getVideoPlaybackUrl,
  isIframeVideoSource,
} from "@/lib/learning/video";
import { Badge } from "@/components/ui/badge";

type LessonVideoPlayerProps = {
  lesson: LearningLesson;
};

export function LessonVideoPlayer({ lesson }: LessonVideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const videoUrl = getVideoPlaybackUrl(lesson.videoSource);
  const openUrl = getVideoOpenUrl(lesson.videoSource) ?? lesson.driveUrl ?? null;
  const isIframe = isIframeVideoSource(lesson.videoSource);

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-black/35 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-4 text-sm text-white/58">
        <div className="flex items-center gap-2">
          <MonitorPlay className="size-4" />
          <span>Ders Videosu</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {lesson.sourceOrder ? (
            <Badge className="bg-white/10 text-white/70">Archive #{lesson.sourceOrder}</Badge>
          ) : null}
          {lesson.durationMinutes ? (
            <Badge className="bg-white/10 text-white/70">
              {lesson.durationMinutes} dk
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="relative aspect-video bg-[#111113]">
        {!videoUrl ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-2xl text-white">Video oynatılamıyor</h3>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-white/56">
                Ders arşivi bağlı görünüyor fakat sayfa içi oynatıcı yüklenemedi.
                Oynatma engellenirse dersi doğrudan Drive üzerinden açabilirsin.
              </p>
              {openUrl ? (
                <a
                  href={openUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white transition hover:bg-white/[0.12]"
                >
                  <ExternalLink className="size-4" />
                  Drive&apos;da aç
                </a>
              ) : null}
            </div>
          </div>
        ) : isIframe ? (
          <>
            {!loaded ? (
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30 text-sm text-white/58">
                <PlayCircle className="size-5 animate-pulse" />
                Yükleniyor...
              </div>
            ) : null}
            <iframe
              src={videoUrl}
              title={lesson.title}
              className="h-full w-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          </>
        ) : (
          <video
            controls
            poster={lesson.videoSource?.poster}
            className="h-full w-full bg-black"
            onLoadedData={() => setLoaded(true)}
          >
            <source src={videoUrl} />
          </video>
        )}
      </div>

      {(lesson.instructor || (openUrl && videoUrl)) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-5 py-4 text-sm text-white/54">
          <div className="flex flex-wrap items-center gap-3">
            {lesson.instructor ? <span>{lesson.instructor}</span> : null}
            {lesson.fileSizeBytes ? (
              <span>{Math.round(lesson.fileSizeBytes / 1024 / 1024)} MB arşiv dosyası</span>
            ) : null}
            {loaded ? <span className="text-zinc-300/80">Oynatıcı hazır</span> : null}
          </div>
          {openUrl ? (
            <a
              href={openUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white/72 transition hover:text-white"
            >
              <span>Drive&apos;da aç</span>
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </div>
      )}
    </section>
  );
}
