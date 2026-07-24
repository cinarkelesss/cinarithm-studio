import type { Concept } from "@/types/concept";

export const concepts: Concept[] = [
  {
    slug: "proof-techniques",
    title: "İspat Teknikleri",
    domain: "Foundations",
    summary:
      "Doğrudan ispat, çelişki, karşıt örnek ve tümevarım gibi temel matematiksel argüman kalıpları.",
    mastery: 82,
    status: "stable",
    prerequisites: [],
    related: ["mathematical-logic", "metric-space"],
    proofPattern: "Önce varsayımları netleştir, sonra çıkarımı küçük lemma adımlarına böl.",
    questionSignal: "Tanım çözümleme ve ispat tamamlama sorularında temel rol oynar.",
    courseSlug: "foundations-of-mathematics",
  },
  {
    slug: "mathematical-logic",
    title: "Matematiksel Mantık",
    domain: "Foundations",
    summary:
      "Önermeler, niceleyiciler ve doğruluk yapıları üzerinden sağlam akıl yürütme omurgası.",
    mastery: 73,
    status: "stable",
    prerequisites: ["proof-techniques"],
    related: ["proof-techniques", "set-theory"],
    proofPattern: "Her teoremde niceleyici sırasını ve önermenin mantıksal iskeletini ayır.",
    questionSignal: "Tanım dönüşümü, karşı örnek üretimi ve formalizasyon sorularında belirleyici.",
    courseSlug: "foundations-of-mathematics",
  },
  {
    slug: "set-theory",
    title: "Kümeler ve Fonksiyonlar",
    domain: "Foundations",
    summary:
      "Kümeler, bağıntılar ve fonksiyonlar üzerinden ileri analiz ve cebir dili kuruluyor.",
    mastery: 64,
    status: "growing",
    prerequisites: ["proof-techniques"],
    related: ["mathematical-logic", "metric-space", "linear-transformation"],
    proofPattern: "Alt küme ilişkilerini fonksiyon davranışıyla birlikte düşün.",
    questionSignal: "Tanım tabanlı çok adımlı sorularda çerçeve sağlayan ilk modül.",
    courseSlug: "foundations-of-mathematics",
  },
  {
    slug: "metric-space",
    title: "Metrik Uzay",
    domain: "Analysis",
    summary:
      "Uzaklık fikrini soyutlayarak limit, yakınsaklık ve süreklilik dilini taşıyan yapı.",
    mastery: 39,
    status: "growing",
    prerequisites: ["set-theory", "proof-techniques"],
    related: ["limit-definition", "continuity", "compactness"],
    proofPattern: "Açık küreler ve epsilon komşulukları üzerinden soyut sezgi kur.",
    questionSignal: "Gerçek analiz ve topolojiye geçişte kavramsal kırılma noktasıdır.",
    courseSlug: "real-analysis",
  },
  {
    slug: "limit-definition",
    title: "Limit Tanımı",
    domain: "Analysis",
    summary:
      "Epsilon-delta tanımıyla fonksiyon davranışını lokal ve ölçülebilir biçimde tarif eder.",
    mastery: 31,
    status: "new",
    prerequisites: ["metric-space", "mathematical-logic"],
    related: ["continuity", "compactness"],
    proofPattern: "Her kanıtta epsilon seçimini görünür ve takip edilebilir kıl.",
    questionSignal: "Sık sık sezgi ile formal tanım arasındaki boşluğu test eder.",
    courseSlug: "real-analysis",
  },
  {
    slug: "linear-transformation",
    title: "Lineer Dönüşüm",
    domain: "Algebra",
    summary:
      "Cebirsel yapıları fonksiyon perspektifiyle yorumlayan, kernel ve image etrafında örülen çekirdek kavram.",
    mastery: 56,
    status: "growing",
    prerequisites: ["set-theory"],
    related: ["eigenvalues"],
    proofPattern: "Kernel-image ayrımını baz seçimi ile birlikte takip et.",
    questionSignal: "Lineer cebirde yapı sorularının neredeyse tamamına temas eder.",
    courseSlug: "linear-algebra",
  },
  {
    slug: "eigenvalues",
    title: "Özdeğerler",
    domain: "Algebra",
    summary:
      "Dönüşümün kararlı yönlerini ortaya çıkaran ve matris davranışını özetleyen ana fikir.",
    mastery: 22,
    status: "new",
    prerequisites: ["linear-transformation"],
    related: ["linear-transformation"],
    proofPattern: "Önce geometrik anlamı kur, sonra determinant üzerinden cebirsel koşulu bağla.",
    questionSignal: "Sınav ve uygulama problemlerinde hesap ile yorum dengesini ölçer.",
    courseSlug: "linear-algebra",
  },
];

export function getConceptBySlug(slug: string) {
  return concepts.find((concept) => concept.slug === slug);
}

export function getConceptsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getConceptBySlug(slug))
    .filter((concept): concept is Concept => Boolean(concept));
}

export function getConceptsByCourseSlug(courseSlug: string) {
  return concepts.filter((concept) => concept.courseSlug === courseSlug);
}

function normalizeConceptText(text: string) {
  return text
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

export function getSuggestedConceptsForLesson(params: {
  courseSlug: string;
  moduleTitle: string;
  lessonConcepts: string[];
  limit?: number;
}) {
  const { courseSlug, moduleTitle, lessonConcepts, limit = 3 } = params;
  const courseConcepts = getConceptsByCourseSlug(courseSlug);
  const normalizedModuleTitle = normalizeConceptText(moduleTitle);
  const normalizedLessonConcepts = lessonConcepts.map(normalizeConceptText);

  return [...courseConcepts]
    .map((concept) => {
      const searchableText = normalizeConceptText(
        `${concept.title} ${concept.summary} ${concept.proofPattern} ${concept.questionSignal}`
      );

      let score = 0;

      if (searchableText.includes(normalizedModuleTitle)) {
        score += 4;
      }

      for (const lessonConcept of normalizedLessonConcepts) {
        if (lessonConcept.length > 0 && searchableText.includes(lessonConcept)) {
          score += 3;
        }
      }

      if (concept.domain === "Foundations" && normalizedModuleTitle.includes("mantik")) {
        score += 1;
      }

      return { concept, score };
    })
    .sort((left, right) => right.score - left.score || right.concept.mastery - left.concept.mastery)
    .slice(0, limit)
    .map((item) => item.concept);
}
