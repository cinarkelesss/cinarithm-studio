import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const normalAltgrupIncelemeleriLessonContent: LessonRichContent = {
  lessonId: "lesson-abstract-algebra-normal-altgrup-incelemeleri",
  courseSlug: "abstract-algebra",
  lessonSlug: "normal-altgrup-incelemeleri",
  status: "published",
  version: 1,
  conceptIds: [
    "concept-group",
    "concept-subgroup",
    "concept-normal-subgroup",
    "concept-coset",
  ],
  exerciseIds: [
    "exercise-subgroup-test-z",
    "exercise-normal-subgroup-in-z",
    "exercise-cosets-in-s3",
    "exercise-center-is-normal",
    "exercise-index-two-normal",
  ],
  review: createValidatedLessonReview(["Manual multi-subject validation tamamlandi."]),
  reviewNotes: ["Yayinlanan algebra validation dersi."],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Manual editorial validation",
  intro:
    "Normal altgrup fikri, bir altgrubun grup içindeki konumunun yalnızca kümesel değil yapısal olarak da kararlı olup olmadığını ölçer.",
  prerequisites: [
    {
      label: "Fonksiyonlar",
      href: "/concepts?concept=functions",
    },
    {
      label: "İspat ve gerekçelendirme",
      href: "/concepts?concept=proof-and-reasoning",
    },
    {
      label: "Kümeler",
      href: "/concepts?concept=sets",
    },
  ],
  studyGuide: [
    {
      title: "1. Önce grup ve altgrup dilini sabitle",
      body: [
        "Bir altgrup, büyük gruptaki işlemi devralır ve kendi içinde yine grup olmayı sürdürür.",
        "Bu yüzden normal altgrup incelemesinde ilk soru yalnızca H'nin altgrup olup olmadığıdır.",
      ],
    },
    {
      title: "2. Yan sınıflar yapının kaydırılmış kopyalarıdır",
      body: [
        "gH ve Hg kümeleri, H'nin grup içinde soldan ya da sağdan taşınmış kopyaları gibi davranır.",
        "Bu iki taşıma türü her zaman aynı sonucu vermeyebilir; normal altgrup tam bu noktada ayrışır.",
      ],
      statement: "H normal ⇔ gH = Hg for every g ∈ G",
    },
    {
      title: "3. Eşlenim testi çoğu zaman daha kullanışlıdır",
      body: [
        "Bir altgrubun normal olup olmadığını kontrol etmenin etkili yolu, eşlenim altında kendine dönüp dönmediğine bakmaktır.",
        "Bu test özellikle permütasyon grupları ve matris grupları gibi örneklerde daha okunur hale gelir.",
      ],
      statement: "H normal ⇔ gHg^{-1} = H for every g ∈ G",
    },
    {
      title: "4. Neden önemlidir?",
      body: [
        "Normal altgruplar olmadan bölüm grubu kurmak mümkün değildir; çünkü yan sınıf çarpımı iyi tanımlanmaz.",
        "Dolayısıyla normal altgrup, yapıyı küçültürken işlemi kaybetmemeyi sağlayan doğru alt nesnedir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-group",
      summary: "Bir işlem altında kararlı davranan cebirsel yapıdır; normal altgrup sorusu bu yapının içinde sorulur.",
    },
    {
      conceptId: "concept-subgroup",
      summary: "Büyük grubun içindeki ve aynı işlemle kendi başına grup oluşturan alt kümedir.",
    },
    {
      conceptId: "concept-normal-subgroup",
      summary: "Soldan ve sağdan kaydırılınca aynı yan sınıfları veren altgruptur.",
    },
    {
      conceptId: "concept-coset",
      summary: "Bir altgrubun grup elemanlarıyla taşınmış kopyalarıdır; normallik bu kopyaların uyumunu ölçer.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "2ℤ ◁ (ℤ, +)",
    overview:
      "Toplamaya göre tam sayılar grubu, normal altgrup fikrinin neden doğal olduğunu görmek için en temiz örneklerden biridir.",
    steps: [
      "2ℤ kümesi 0'ı içerir, toplama altında kapalıdır ve her elemanının tersi yine 2ℤ içindedir; dolayısıyla altgruptur.",
      "(ℤ, +) abelyen olduğu için a + h = h + a her a ∈ ℤ ve h ∈ 2ℤ için geçerlidir.",
      "Bu nedenle sol ve sağ yan sınıflar arasında fark oluşmaz.",
      "Sonuç olarak 2ℤ, ℤ içinde normal altgruptur.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "S3 içinde H = {e, (12)} altgrubunu düşünürsen soldan ve sağdan kaydırmalar farklı sonuç verebilir.",
      "Bu fark, her altgrubun normal olmadığını ve abelyen örneklerin özel bir kolaylık sağladığını gösterir.",
    ],
    takeaway:
      "Normallik, altgrubun yalnızca kapalı olmasından daha güçlü bir uyumluluk talep eder.",
  },
};
