import type { LearningContentItem } from "@/lib/types";

export type LearningContentPresentation =
  | { mode: "iframe"; src: string }
  | { mode: "video"; src: string }
  | { mode: "external"; src: string };

function isYouTubeUrl(url: URL) {
  return (
    url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")
  );
}

function getYouTubeEmbedUrl(url: URL) {
  if (url.hostname.includes("youtu.be")) {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (url.pathname.startsWith("/embed/")) {
    return `https://www.youtube-nocookie.com${url.pathname}`;
  }

  const id = url.searchParams.get("v");
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function isVideoFile(pathname: string) {
  return /\.(mp4|webm|ogg)$/i.test(pathname);
}

function isPdfFile(pathname: string) {
  return /\.pdf$/i.test(pathname);
}

export function getLearningContentPresentation(
  item: LearningContentItem
): LearningContentPresentation {
  if (item.url.startsWith("/")) {
    if (isVideoFile(item.url)) {
      return { mode: "video", src: item.url };
    }

    return { mode: "iframe", src: item.url };
  }

  try {
    const parsed = new URL(item.url);

    if (isYouTubeUrl(parsed)) {
      const embedUrl = getYouTubeEmbedUrl(parsed);
      if (embedUrl) {
        return { mode: "iframe", src: embedUrl };
      }
    }

    if (isVideoFile(parsed.pathname)) {
      return { mode: "video", src: item.url };
    }

    if (isPdfFile(parsed.pathname)) {
      return { mode: "iframe", src: item.url };
    }

    return { mode: "external", src: item.url };
  } catch {
    return { mode: "external", src: item.url };
  }
}

export function isEmbeddableLearningContent(item: LearningContentItem) {
  const presentation = getLearningContentPresentation(item);
  return presentation.mode !== "external";
}
