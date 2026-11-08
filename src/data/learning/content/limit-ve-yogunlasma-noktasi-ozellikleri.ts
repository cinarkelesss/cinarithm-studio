import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const limitVeYogunlasmaNoktasiOzellikleriLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-limits-of-functions",
  courseSlug: "real-analysis",
  lessonSlug: "limits-of-functions",
  status: "draft",
  version: 2,
  conceptIds: [
    "concept-limit",
    "concept-accumulation-point",
    "concept-continuity",
    "concept-functions",
  ],
  exerciseIds: [
    "ex-real-analysis-limits-of-functions-deleted-neighborhood-01",
    "ex-real-analysis-limits-of-functions-sum-law-02",
    "ex-real-analysis-limits-of-functions-accumulation-03",
    "ex-real-analysis-limits-of-functions-epsilon-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Fonksiyon limiti için birikim noktası ve delinmiş komşuluk koşulları açık yazıldı.",
      "Fonksiyon kavramı, dizi sezgisinin yerine ana kavram olarak geri alındı.",
      "ε–δ dili ve noktasal değer/limit ayrımı daha kesin hale getirildi.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: a noktasının tanım kümesinde olmak zorunda olmadığı, ama tanım kümesinin yığılma noktası olması gerektiği açıklandı.",
    "Silinmiş komşuluk ve limit tanımı aynı terminolojiyle yeniden yazıldı.",
    "Fonksiyon limiti dersinin concept seti, dizi sezgisi yerine fonksiyon bağlamına hizalandı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 2",
  intro:
    "Fonksiyon limitleri, dizilerden gelen yakınlaşma fikrini bu kez girdinin hedef noktaya yaklaşması üzerinden yeniden kurar; burada önemli olan f(a) değil, x'in a'ya yaklaşırkenki davranışıdır.",
  prerequisites: [
    { label: "Limit", href: "/concepts?concept=limit" },
    { label: "Yoğunlaşma noktası", href: "/concepts?concept=accumulation-point" },
    { label: "Fonksiyonlar", href: "/concepts?concept=functions" },
  ],
  studyGuide: [
    {
      title: "1. Noktadaki değeri ile noktaya yakın davranışı ayır",
      body: [
        "Fonksiyon limiti, x = a noktasındaki tek bir değere değil, x'in a'ya yaklaşırken izlediği davranışa bakar.",
        "Bu yüzden limit tanımında genellikle x ≠ a koşulu kullanılır ve silinmiş komşuluk dili devreye girer.",
      ],
      statement:
        "lim_{x→a} f(x) = L demek: her ε > 0 için bir δ > 0 vardır ve x tanım kümesinde, 0 < |x-a| < δ ise |f(x)-L| < ε olur.",
    },
    {
      title: "2. Yığılma noktası teknik bir gereksinimdir",
      body: [
        "a noktasına gerçekten yaklaşan başka tanım kümesi noktalarının bulunması gerekir.",
        "Bu nedenle a, mutlaka tanım kümesinin yığılma noktası olmalıdır; a'nın tanım kümesinde yer alması zorunlu değildir.",
      ],
    },
    {
      title: "3. Cebirsel limit kuralları varsayımlarla çalışır",
      body: [
        "Toplam, fark ve çarpım gibi işlemlerin limit altında korunması, hesapları parçalara ayırmayı sağlar.",
        "Ancak her kuralın varsayımı vardır; örneğin bölüm kuralında paydanın limiti sıfır olmamalıdır.",
      ],
    },
    {
      title: "4. Süreklilik ayrı bir ek koşuldur",
      body: [
        "Süreklilik, limitin var olmasına ek olarak f(a) = lim_{x→a} f(x) eşitliğini ister.",
        "Bu nedenle limit ile süreklilik ilişkili kavramlardır ama aynı kavram değildir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-limit",
      summary: "Fonksiyon limiti, x hedef noktaya yaklaşırken f(x)'in sergilediği çıktı davranışıdır.",
    },
    {
      conceptId: "concept-accumulation-point",
      summary: "Limiti test edebilmek için hedef noktanın çevresinde başka tanım kümesi noktaları gerekir.",
    },
    {
      conceptId: "concept-continuity",
      summary: "Süreklilik, limit ile noktadaki değerin çakıştığı özel durumdur.",
    },
    {
      conceptId: "concept-functions",
      summary: "Fonksiyon limitinde hem tanım kümesi hem de çıktı davranışı birlikte okunur.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "f(x) = (x² - 1)/(x - 1), x ≠ 1",
    overview:
      "Bu klasik örnek, fonksiyonun hedef noktadaki değerinden bağımsız olarak limit davranışının nasıl okunabildiğini gösterir.",
    steps: [
      "Pay çarpanlara ayrılınca f(x) = x + 1 olur; fakat bu eşdeğerlik yalnızca x ≠ 1 için geçerlidir.",
      "x, 1'e yaklaşırken x + 1 ifadesi 2'ye yaklaşır.",
      "Bu nedenle lim_{x→1} f(x) = 2'dir.",
      "Fonksiyon 1'de tanımlı olmasa bile limitin var olabilmesi, silinmiş komşuluk fikrini açıklar.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Eğer ayrıca f(1) = 5 diye tanımlansaydı limit yine 2 olurdu.",
      "Bu fark, limit ile noktasal değerin aynı kavram olmadığını açıkça gösterir.",
    ],
    takeaway:
      "Fonksiyon limitinde asıl mesele, noktadaki etiket değil, o noktaya yaklaşırken görülen davranıştır.",
  },
};
