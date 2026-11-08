import type {
  AppData,
  Book,
  KnowledgeNode,
  LearningCategory,
  LearningCourse,
  LearningResource,
  Proof,
} from "@/lib/types";

export type LearningCourseLinks = {
  courseId: string;
  books: Book[];
  knowledgeNodes: KnowledgeNode[];
  proofs: Proof[];
};

export type LearningFocusSnapshot = {
  course: LearningCourse;
  links: LearningCourseLinks;
};

const STOP_WORDS = new Set([
  "ve",
  "ile",
  "icin",
  "için",
  "giris",
  "giriş",
  "temel",
  "matematik",
  "matematiksel",
  "akademik",
  "cinarithm",
  "cinarithm",
  "kendi",
  "ders",
  "notlar",
]);

function normalizeText(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}

function extractTokens(input: string) {
  return normalizeText(input)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function buildCourseKeywords(
  course: LearningCourse,
  category: LearningCategory | undefined,
  resources: LearningResource[]
) {
  return unique([
    ...extractTokens(course.title),
    ...extractTokens(course.summary),
    ...extractTokens(course.nextStep),
    ...course.topics.flatMap((topic) => extractTokens(topic)),
    ...(category
      ? [
          ...extractTokens(category.title),
          ...extractTokens(category.description),
          ...extractTokens(category.emphasis),
        ]
      : []),
    ...resources.flatMap((resource) => [
      ...extractTokens(resource.title),
      ...extractTokens(resource.author),
      ...extractTokens(resource.note),
    ]),
  ]);
}

function matchesKeywords(input: string, keywords: string[]) {
  const haystack = normalizeText(input);
  return keywords.some((keyword) => haystack.includes(keyword));
}

function buildBookHaystack(book: Book) {
  return [book.title, book.author, book.currentSection, book.note].join(" ");
}

function buildNodeHaystack(node: KnowledgeNode) {
  return [node.title, node.branch, node.note].join(" ");
}

function buildProofHaystack(proof: Proof) {
  return [proof.title, proof.source, proof.technique, proof.note].join(" ");
}

function filterByIds<T extends { id: string }>(items: T[], ids: string[]) {
  const idSet = new Set(ids);
  return items.filter((item) => idSet.has(item.id));
}

export function buildLearningCourseLinks(data: AppData): LearningCourseLinks[] {
  return data.learningCourses.map((course) => {
    const category = data.learningCategories.find(
      (item) => item.id === course.categoryId
    );
    const resources = data.learningResources.filter((resource) =>
      course.resourceIds.includes(resource.id)
    );
    const hasExplicitLinks =
      course.relatedBookIds.length > 0 ||
      course.relatedNodeIds.length > 0 ||
      course.relatedProofIds.length > 0;
    const keywords = buildCourseKeywords(course, category, resources);

    return {
      courseId: course.id,
      books: hasExplicitLinks
        ? filterByIds(data.books, course.relatedBookIds)
        : data.books.filter((book) =>
            matchesKeywords(buildBookHaystack(book), keywords)
          ),
      knowledgeNodes: hasExplicitLinks
        ? filterByIds(data.knowledgeNodes, course.relatedNodeIds)
        : data.knowledgeNodes.filter((node) =>
            matchesKeywords(buildNodeHaystack(node), keywords)
          ),
      proofs: hasExplicitLinks
        ? filterByIds(data.proofs, course.relatedProofIds)
        : data.proofs.filter((proof) =>
            matchesKeywords(buildProofHaystack(proof), keywords)
          ),
    };
  });
}

function incrementCount(
  counts: Record<string, number>,
  ids: string[]
) {
  ids.forEach((id) => {
    counts[id] = (counts[id] ?? 0) + 1;
  });
}

export function buildLearningReverseCounts(data: AppData) {
  const links = buildLearningCourseLinks(data);
  const bookCounts: Record<string, number> = {};
  const nodeCounts: Record<string, number> = {};
  const proofCounts: Record<string, number> = {};

  links.forEach((link) => {
    incrementCount(
      bookCounts,
      link.books.map((book) => book.id)
    );
    incrementCount(
      nodeCounts,
      link.knowledgeNodes.map((node) => node.id)
    );
    incrementCount(
      proofCounts,
      link.proofs.map((proof) => proof.id)
    );
  });

  return {
    bookCounts,
    nodeCounts,
    proofCounts,
  };
}

const courseStatusPriority: Record<LearningCourse["status"], number> = {
  derinleşiyor: 0,
  başladı: 1,
  sırada: 2,
  tamamlandı: 3,
};

function compareLearningCourses(left: LearningCourse, right: LearningCourse) {
  const statusDelta =
    courseStatusPriority[left.status] - courseStatusPriority[right.status];

  if (statusDelta !== 0) {
    return statusDelta;
  }

  const progressDelta = right.progress - left.progress;
  if (progressDelta !== 0) {
    return progressDelta;
  }

  return left.title.localeCompare(right.title, "tr");
}

export function getLearningFocusSnapshot(
  data: AppData
): LearningFocusSnapshot | null {
  const links = buildLearningCourseLinks(data);
  const sortedCourses = [...data.learningCourses].sort(compareLearningCourses);
  const focusCourse =
    sortedCourses.find((course) => course.status !== "tamamlandı") ??
    sortedCourses[0];

  if (!focusCourse) {
    return null;
  }

  return {
    course: focusCourse,
    links:
      links.find((link) => link.courseId === focusCourse.id) ?? {
        courseId: focusCourse.id,
        books: [],
        knowledgeNodes: [],
        proofs: [],
      },
  };
}
