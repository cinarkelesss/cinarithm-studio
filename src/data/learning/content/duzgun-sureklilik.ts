import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const duzgunSureklilikLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-uniform-continuity",
  courseSlug: "real-analysis",
  lessonSlug: "uniform-continuity",
  status: "published",
  version: 1,
  conceptIds: [
    "concept-functions",
    "concept-continuity",
    "concept-uniform-continuity",
    "concept-real-numbers",
  ],
  exerciseIds: [
    "exercise-uniform-continuity",
    "exercise-uniform-continuity-definition",
    "exercise-uniform-continuity-reciprocal",
    "exercise-uniform-continuity-domain-comparison",
    "exercise-uniform-continuity-sum-proof",
  ],
  review: createValidatedLessonReview(["Manual multi-subject validation tamamlandi."]),
  reviewNotes: ["Yayinlanan validated lesson; editorial pipeline icinde korunur."],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Manual editorial validation",
  intro:
    "Düzgün süreklilik, süreklilikteki yerel δ seçimini bütün aralık için tek bir kontrol ilkesine dönüştürür.",
  prerequisites: [
    {
      label: "Fonksiyonlar",
      href: "/concepts?concept=functions",
    },
    {
      label: "Süreklilik",
      href: "/concepts?concept=continuity",
    },
    {
      label: "Gerçel sayılar",
      href: "/concepts?concept=real-numbers",
    },
  ],
  studyGuide: [
    {
      title: "1. Noktasal süreklilik ile başla",
      body: [
        "Süreklilikte x0 noktasını sabitleriz; ε > 0 verildiğinde δ seçimi x0'a göre değişebilir.",
        "Bu yüzden sıradan süreklilik, fonksiyonun her noktada iyi davranmasını ister ama bütün kümede tek bir kontrol sayısı vermez.",
      ],
    },
    {
      title: "2. Düzgün süreklilikte δ ortaktır",
      body: [
        "Düzgün süreklilikte aynı ε için seçilen δ, x ve y hangi noktalar olursa olsun bütün kümede çalışır.",
        "Asıl fark budur: kontrol artık noktasal değil, küme düzeyindedir.",
      ],
      statement:
        "∀ ε > 0 ∃ δ > 0 öyle ki x,y ∈ A ve |x - y| < δ ise |f(x) - f(y)| < ε.",
      note:
        "Buradaki δ yalnızca ε'ye bağlıdır; x ya da y'ye göre yeniden seçilmez.",
    },
    {
      title: "3. Tanım kümesi neden önemlidir?",
      body: [
        "Kapalı ve sınırlı aralıklarda sürekli fonksiyonların daha güçlü kontrol verdiğini sık sık görürüz.",
        "Buna karşılık açık ya da sınırsız kümelerde fonksiyon, bazı bölgelere yaklaşırken kontrolden çıkabilir.",
      ],
    },
    {
      title: "4. Karşı örnek arama alışkanlığı kur",
      body: [
        "Bir fonksiyonun düzgün sürekli olmadığını göstermek için birbirine yaklaşan ama görüntüleri yaklaşmayan nokta çiftleri üretmek çok etkilidir.",
        "Özellikle uç noktaya ya da sonsuza yaklaşan diziler bu tür karşı örneklerde sık kullanılır.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-functions",
      summary: "Düzgün süreklilik, yalnızca fonksiyon fikrinin değil tanım kümesinin de davranışını hesaba katar.",
    },
    {
      conceptId: "concept-continuity",
      summary: "Sıradan süreklilikte δ, seçilen noktaya bağlı olabilir; düzgün süreklilik bu bağımlılığı kaldırır.",
    },
    {
      conceptId: "concept-uniform-continuity",
      summary: "Aynı ε için bütün kümede geçerli tek bir δ bulunabilmesidir.",
    },
    {
      conceptId: "concept-real-numbers",
      summary: "Aralıkların kapalı, açık ya da sınırsız oluşu düzgün süreklilik kararını doğrudan etkileyebilir.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "f(x) = x² on [0,1]",
    overview:
      "Klasik bir örnek olarak x² fonksiyonunun kapalı bir aralıkta neden düzgün sürekli olduğunu doğrudan eşitsizlikle görebiliriz.",
    steps: [
      "[0,1] içindeki x ve y için |x² - y²| = |x - y||x + y| yazılır.",
      "Bu aralıkta 0 ≤ x + y ≤ 2 olduğundan |x² - y²| ≤ 2|x - y| elde edilir.",
      "ε > 0 verildiğinde δ = ε/2 seçmek yeterlidir.",
      "Böylece |x - y| < δ ise |x² - y²| < ε olur; üstelik bu seçim bütün aralık için aynıdır.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Aynı fikir x² fonksiyonu için bütün ℝ üzerinde aynı kolaylıkla çalışmaz; çünkü |x + y| terimi artık tek bir sayıyla sınırlanamaz.",
      "Benzer şekilde 1/x fonksiyonu (0,1) üzerinde sürekli olsa da 0'a yaklaşırken düzgün süreklilik kaybolur.",
    ],
    takeaway:
      "Düzgün süreklilikte önemli olan yalnızca fonksiyon formülü değil, fonksiyonun hangi kümede incelendiğidir.",
  },
};
