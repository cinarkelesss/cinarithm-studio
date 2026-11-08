const HARD_INVALID_SUFFIXES = [".part", ".temp", ".tmp"];
const TECHNICAL_TRACK_SUFFIXES = [".f137", ".f140", ".f251", ".f299"];
const INVALID_TOKENS = ["fragment", "audio only", "video only"];
const KNOWN_INSTRUCTORS = [
  "Ali Nesin",
  "Yusuf Ünlü",
  "Özlem Beyarslan",
  "Chris Stephenson",
] as const;
const MIN_PLAYABLE_VIDEO_BYTES = 50 * 1024 * 1024;

export type RawDriveArchiveFile = {
  id: string;
  title: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

export type DriveArchiveLecture = {
  sourceOrder: number;
  title: string;
  normalizedTitle: string;
  instructor?: string;
  driveFileId: string;
  driveUrl: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  canonicalKey: string;
  isPlayable: boolean;
  hasTechnicalTrackSuffix: boolean;
  rejectionReason: string | null;
};

export function normalizeDriveFile(fileName: string) {
  return fileName
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/[–—]/g, "-")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForCompare(value: string) {
  return normalizeDriveFile(value)
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

function stripFileExtension(value: string) {
  return value.replace(/\.(mp4|m4v|mov|mkv)$/i, "");
}

function stripTechnicalSuffixes(value: string) {
  return value
    .replace(/\.mp4\.part-frag\d+\.part$/i, "")
    .replace(/\.part$/i, "")
    .replace(/\.temp$/i, "")
    .replace(/\.tmp$/i, "")
    .replace(/\.f\d+$/i, "")
    .replace(/\s*-\(\d+p\d+\)$/i, "")
    .replace(/\s+\d+\s*$/i, "")
    .trim();
}

function hasHardInvalidSuffix(normalizedFileName: string) {
  return HARD_INVALID_SUFFIXES.some((suffix) => normalizedFileName.endsWith(suffix));
}

function hasTechnicalTrackSuffix(normalizedFileName: string) {
  return TECHNICAL_TRACK_SUFFIXES.some((suffix) => normalizedFileName.includes(suffix));
}

function isKnownLectureMimeType(mimeType: string) {
  return mimeType === "video/mp4" || mimeType === "video/quicktime";
}

function getRejectionReason(
  normalizedFileName: string,
  mimeType: string,
  sizeBytes: number
) {
  if (!isKnownLectureMimeType(mimeType)) {
    return `unsupported mime type: ${mimeType}`;
  }

  if (hasHardInvalidSuffix(normalizedFileName)) {
    return "hard invalid suffix (.part/.temp/.tmp)";
  }

  if (INVALID_TOKENS.some((token) => normalizedFileName.includes(token))) {
    return "invalid fragment token in filename";
  }

  if (sizeBytes < MIN_PLAYABLE_VIDEO_BYTES) {
    return `below playable size threshold (${MIN_PLAYABLE_VIDEO_BYTES} bytes)`;
  }

  return null;
}

export function extractInstructor(fileName: string) {
  const normalizedFileName = normalizeForCompare(fileName);
  const instructor = KNOWN_INSTRUCTORS.find((candidate) =>
    normalizedFileName.includes(normalizeForCompare(candidate))
  );

  return instructor ?? null;
}

export function extractLectureTitle(fileName: string) {
  const normalized = stripFileExtension(fileName.normalize("NFKD").replace(/[–—]/g, "-"));
  const sourceOrder = extractSourceOrder(normalized);
  const withoutOrder = sourceOrder
    ? normalized.replace(/^\s*\d{1,3}\s+/, "")
    : normalized;
  const segments = withoutOrder.split(/\s+-\s+/);

  if (segments.length > 1) {
    const trailingSegment = segments.at(-1)?.trim() ?? "";
    const isInstructorSegment = KNOWN_INSTRUCTORS.some((candidate) =>
      normalizeForCompare(trailingSegment).startsWith(normalizeForCompare(candidate))
    );

    if (isInstructorSegment) {
      return stripTechnicalSuffixes(segments.slice(0, -1).join(" - ")).trim();
    }
  }

  return stripTechnicalSuffixes(withoutOrder).trim();
}

export function isValidLessonVideo(fileName: string) {
  const normalized = normalizeDriveFile(fileName);
  if (!normalized) {
    return false;
  }

  if (hasHardInvalidSuffix(normalized)) {
    return false;
  }

  return !INVALID_TOKENS.some((token) => normalized.includes(token));
}

export function extractSourceOrder(fileName: string) {
  const match = normalizeDriveFile(fileName).match(/^(\d{1,3})/);
  return match ? Number(match[1]) : null;
}

export function createLessonSlug(title: string) {
  return normalizeForCompare(title)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function classifyLesson(fileName: string) {
  return {
    isValid: isValidLessonVideo(fileName),
    sourceOrder: extractSourceOrder(fileName),
    normalizedFileName: normalizeDriveFile(fileName),
    instructor: extractInstructor(fileName),
    lectureTitle: extractLectureTitle(fileName),
  };
}

export function parseDriveArchiveFile(file: RawDriveArchiveFile): DriveArchiveLecture | null {
  const sourceOrder = extractSourceOrder(file.title);
  const lectureTitle = extractLectureTitle(file.title);

  if (!sourceOrder || !lectureTitle) {
    return null;
  }

  const normalizedFileName = normalizeDriveFile(file.title);
  const instructor = extractInstructor(file.title) ?? undefined;
  const hardInvalid = hasHardInvalidSuffix(normalizedFileName);
  const technicalTrackSuffix = hasTechnicalTrackSuffix(normalizedFileName);
  const rejectionReason = getRejectionReason(
    normalizedFileName,
    file.mimeType,
    file.sizeBytes
  );
  const isPlayable = !hardInvalid && rejectionReason === null;

  return {
    sourceOrder,
    title: lectureTitle,
    normalizedTitle: lectureTitle,
    instructor,
    driveFileId: file.id,
    driveUrl: file.url,
    originalFileName: file.title,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    canonicalKey: [
      sourceOrder,
      createLessonSlug(lectureTitle),
      instructor ? createLessonSlug(instructor) : "unknown",
    ].join(":"),
    isPlayable,
    hasTechnicalTrackSuffix: technicalTrackSuffix,
    rejectionReason,
  };
}

export function groupDuplicateLectureFiles(files: RawDriveArchiveFile[]) {
  const groups = new Map<string, DriveArchiveLecture[]>();

  files.forEach((file) => {
    const parsed = parseDriveArchiveFile(file);
    if (!parsed) {
      return;
    }

    const current = groups.get(parsed.canonicalKey) ?? [];
    current.push(parsed);
    groups.set(parsed.canonicalKey, current);
  });

  return groups;
}

function canonicalScore(file: DriveArchiveLecture) {
  const plainMp4Bonus =
    file.originalFileName.toLocaleLowerCase("en-US").endsWith(".mp4") &&
    !file.hasTechnicalTrackSuffix
      ? 20
      : 0;
  const trackPenalty = file.hasTechnicalTrackSuffix ? 5 : 0;

  return (
    (file.isPlayable ? 1_000_000_000 : 0) +
    plainMp4Bonus +
    Math.min(file.sizeBytes, 999_999_999) -
    trackPenalty
  );
}

export function chooseCanonicalVideo(files: DriveArchiveLecture[]) {
  if (files.length === 0) {
    return null;
  }

  return [...files].sort((left, right) => canonicalScore(right) - canonicalScore(left))[0];
}
