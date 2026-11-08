import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const logaritmaLimitVeLHospitalLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-logaritma-limit-ve-lhospital",
  courseSlug: "real-analysis",
  lessonSlug: "logaritma-limit-ve-lhospital",
  status: "draft",
  version: 2,
  conceptIds: ["concept-limit", "concept-continuity", "concept-derivative"],
  exerciseIds: [
    "ex-real-analysis-logarithm-limit-lhospital-indeterminate-01",
    "ex-real-analysis-logarithm-limit-lhospital-log-limit-02",
    "ex-real-analysis-logarithm-limit-lhospital-warning-03",
    "ex-real-analysis-logarithm-limit-lhospital-differentiation-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "L'Hospital kuralı uygun 0/0 ve ∞/∞ oranları için kısıtlı ve doğru biçimde yeniden yazıldı.",
      "Logaritma için x > 0 ve genel taban koşulları açıklandı.",
      "Örnek, belirsiz biçim ve türev koşullarını görünür kılacak şekilde ln x ile yeniden yazıldı.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: logaritma domain koşulları açıkça eklendi.",
    "L'Hospital kuralı 'payı ve paydayı türevle' düzeyinden çıkarılıp kısıtlı doğru hipotezlerle yazıldı.",
    "Örnek ve alıştırmalar belirsiz biçim kontrolünü önceleyen dille sıkılaştırıldı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 2",
  intro:
    "Bu ders, logaritma dönüşümleri ile L'Hospital kuralını bir hesap hilesi gibi değil, belirli hipotezler altında limit davranışını çözümleyen iki kontrollü araç olarak konumlandırır.",
  prerequisites: [
    { label: "Limit", href: "/concepts?concept=limit" },
    { label: "Süreklilik", href: "/concepts?concept=continuity" },
    { label: "Türev", href: "/concepts?concept=derivative" },
  ],
  studyGuide: [
    {
      title: "1. Önce biçimi tanı",
      body: [
        "L'Hospital kuralına gitmeden önce ifadenin gerçekten 0/0 ya da ∞/∞ tipinde olup olmadığını kontrol etmek gerekir.",
        "Bu teşhis adımı atlanırsa kural teknik olarak yanlış bir yerde kullanılabilir.",
      ],
    },
    {
      title: "2. Logaritmanın da domaini vardır",
      body: [
        "Doğal logaritma ln x yalnızca x > 0 için tanımlıdır.",
        "Daha genel log_a x ifadesinde de a > 0, a ≠ 1 ve x > 0 koşulları gerekir; bu yüzden logaritmik dönüşüm ancak pozitif ifadelerde kullanılabilir.",
      ],
    },
    {
      title: "3. L'Hospital yerel değişim hızlarını karşılaştırır",
      body: [
        "Pay ve payda aynı anda 0'a ya da ±∞'ye giderken, hangisinin daha hızlı değiştiği belirleyici olabilir.",
        "Türev bilgisi bu yerel değişim ritmini ölçtüğü için kural burada devreye girer.",
      ],
      statement:
        "Kısıtlı biçimde: f ve g, a'nın delinmiş bir komşuluğunda türevlenebilir, g'(x) ≠ 0 ve f/g oranı 0/0 ya da ∞/∞ tipindeyse; ayrıca lim f'(x)/g'(x) varsa, uygun koşullarda lim f(x)/g(x) aynı limite gider.",
    },
    {
      title: "4. Her limitte ilk seçenek bu değildir",
      body: [
        "Çarpanlara ayırma, eşdeğer dönüşüm ya da standart limitler bazen daha temiz yoldur.",
        "Bu derste asıl amaç, aracı seçmek ile araca koşullanmak arasındaki farkı görmektir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-limit",
      summary: "Kural ve dönüşümlerin tümü limit davranışını daha okunur hale getirmek için kullanılır.",
    },
    {
      conceptId: "concept-derivative",
      summary: "L'Hospital, pay ve paydanın yerel değişim hızlarını türevler üzerinden karşılaştırır.",
    },
    {
      conceptId: "concept-continuity",
      summary: "Logaritma ve bileşik fonksiyon dönüşümleri, uygun domainlerde süreklilik altyapısına dayanır.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "lim_{x → 1} (ln x)/(x - 1)",
    overview:
      "Bu örnek, hem belirsiz biçim tespitini hem de L'Hospital uygulamasının neden makul olduğunu görmek için klasiktir.",
    steps: [
      "x, 1'e sağdan ya da soldan yeterince yakınken ln x tanımlıdır ve hem pay hem payda 0'a gider; dolayısıyla 0/0 biçimi vardır.",
      "Payın türevi 1/x, paydanın türevi 1 olur.",
      "Türev oranı x → 1 iken 1'e gider.",
      "Bu nedenle uygun L'Hospital koşulları altında limit 1 olur.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Bazı oranlarda önce cebirsel sadeleştirme yapmak L'Hospital'dan daha doğrudan olabilir.",
      "Logaritma dönüşümü ise daha çok pozitif üstel ya da kuvvetli biçimlerde devreye girer.",
    ],
    takeaway:
      "Doğru limit aracını seçmek, tek bir kurala bağlanmaktan daha değerli bir analiz refleksidir.",
  },
};
