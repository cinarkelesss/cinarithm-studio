import type { VideoSource } from "@/lib/learning/domain";

function getGoogleDrivePreviewUrl(fileId?: string) {
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

function getGoogleDriveOpenUrl(fileId?: string) {
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : null;
}

export function getVideoPlaybackUrl(videoSource?: VideoSource | null) {
  if (!videoSource) {
    return null;
  }

  if (videoSource.provider === "google-drive") {
    return getGoogleDrivePreviewUrl(videoSource.fileId);
  }

  if (videoSource.provider === "local") {
    return videoSource.path ?? null;
  }

  return videoSource.url ?? null;
}

export function getVideoOpenUrl(videoSource?: VideoSource | null) {
  if (!videoSource) {
    return null;
  }

  if (videoSource.provider === "google-drive") {
    return videoSource.openUrl ?? getGoogleDriveOpenUrl(videoSource.fileId);
  }

  if (videoSource.provider === "local") {
    return videoSource.path ?? null;
  }

  return videoSource.openUrl ?? videoSource.url ?? null;
}

export function isIframeVideoSource(videoSource?: VideoSource | null) {
  if (!videoSource) {
    return false;
  }

  return videoSource.provider !== "local";
}
