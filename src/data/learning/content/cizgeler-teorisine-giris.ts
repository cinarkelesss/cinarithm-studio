import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const cizgelerTeorisineGirisLessonContent: LessonRichContent = {
  lessonId: "lesson-discrete-mathematics-graph-theory-paths-and-trees",
  courseSlug: "discrete-mathematics",
  lessonSlug: "graph-theory-paths-and-trees",
  status: "published",
  version: 1,
  conceptIds: [
    "concept-graph-theory",
    "concept-vertex",
    "concept-edge",
    "concept-path",
    "concept-cycle",
    "concept-graph-connectedness",
  ],
  exerciseIds: [
    "exercise-graph-tree",
    "exercise-graph-vertices-and-edges",
    "exercise-graph-degree-sequence",
    "exercise-path-vs-cycle",
    "exercise-graph-connected-example",
  ],
  review: createValidatedLessonReview(["Manual multi-subject validation tamamlandi."]),
  reviewNotes: ["Yayinlanan discrete mathematics validation dersi."],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Manual editorial validation",
  intro:
    "Çizge teorisi, sonlu ya da ayrık ilişkileri düğüm ve kenar diliyle düzenli biçimde okumayı sağlar.",
  prerequisites: [
    {
      label: "Kümeler",
      href: "/concepts?concept=sets",
    },
    {
      label: "Fonksiyonlar",
      href: "/concepts?concept=functions",
    },
    {
      label: "İspat ve gerekçelendirme",
      href: "/concepts?concept=proof-and-reasoning",
    },
  ],
  studyGuide: [
    {
      title: "1. Çizgeyi veri yapısı gibi değil nesne gibi oku",
      body: [
        "Bir çizge genellikle G = (V, E) ile yazılır; burada V düğüm kümesi, E ise kenar kümesidir.",
        "Bu yazım yalnızca listeleme değil, hangi tür ilişkilerin kabul edildiğini açıkça söyleyen yapısal bir tanımdır.",
      ],
    },
    {
      title: "2. Derece yerel bilgiyi taşır",
      body: [
        "Bir düğümün derecesi, ona kaç kenarın bağlandığını söyler.",
        "Böylece çizgenin tamamına bakmadan yerel yoğunluk hakkında bilgi alabiliriz.",
      ],
      statement: "deg(v) = v düğümüne komşu kenar sayısı",
    },
    {
      title: "3. Yol ve çevrim küresel davranışı gösterir",
      body: [
        "Yol, düğümler arasında hareket imkanı verir; çevrim ise başlangıç noktasına geri dönebilen kapalı yapı kurar.",
        "Bir çizgede çevrim bulunup bulunmaması, özellikle ağaçlar gibi özel sınıfları ayırırken belirleyicidir.",
      ],
    },
    {
      title: "4. Bağlantılılık ana sorudur",
      body: [
        "İki düğüm arasında yol varsa çizge içinde bilgi taşıyabiliriz; yol yoksa yapı bileşenlere ayrılmıştır.",
        "Bu yüzden bağlantılılık, bir çizgenin tek parça mı yoksa dağınık mı olduğunu söyler.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-graph-theory",
      summary: "Ayrık ilişkileri düğüm ve kenar diliyle modelleyen genel çerçevedir.",
    },
    {
      conceptId: "concept-vertex",
      summary: "Çizgenin temel noktalarıdır; ilişkiler bunlar arasında kurulur.",
    },
    {
      conceptId: "concept-edge",
      summary: "İki düğüm arasındaki doğrudan bağlantıdır.",
    },
    {
      conceptId: "concept-path",
      summary: "Bir düğümden diğerine kenarlar boyunca ilerlemeyi mümkün kılan dizidir.",
    },
    {
      conceptId: "concept-cycle",
      summary: "Başladığı düğüme dönen kapalı yol, çizgenin ağaç benzeri olup olmadığını ayırmada önemlidir.",
    },
    {
      conceptId: "concept-graph-connectedness",
      summary: "Her iki düğüm arasında en az bir yol bulunması, çizgenin tek parça olduğunu gösterir.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "G = (V, E), V = {1,2,3,4}, E = {{1,2}, {2,3}, {3,4}}",
    overview:
      "Bu çizge, yol yapısını ve derece hesabını aynı anda görebileceğimiz en temel örneklerden biridir.",
    steps: [
      "Bu çizgede 1 ve 4 uç düğümlerdir; dereceleri 1'dir.",
      "2 ve 3 düğümleri iki kenara bağlı olduğu için dereceleri 2'dir.",
      "1'den 4'e gitmek için 1-2-3-4 yolu kullanılır; dolayısıyla çizge bağlantılıdır.",
      "Ancak başladığın yere dönmeyi sağlayan kapalı bir yol yoktur; bu yüzden çevrim içermez.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Şimdi {4,1} kenarını eklersen 1-2-3-4-1 çevrimi oluşur.",
      "Tek bir kenar eklemek, çizgenin hem yerel derecelerini hem de küresel yapısını değiştirir.",
    ],
    takeaway:
      "Çizge teorisinde küçük bir yerel değişiklik bile yol, çevrim ve bağlantılılık davranışını ciddi biçimde etkileyebilir.",
  },
};
