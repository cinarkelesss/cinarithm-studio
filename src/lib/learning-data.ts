import type {
  LearningCategory,
  LearningCourse,
  LearningResource,
} from "@/lib/types";

export const defaultLearningCategories: LearningCategory[] = [
  {
    id: "math-language",
    title: "Matematiğin Dili",
    description:
      "Tanım okuma, niceleyici kullanımı ve örnek-karşı örnek sezgisi burada oturur.",
    emphasis: "İlk hedef: dili temiz kurmak.",
  },
  {
    id: "proof-writing",
    title: "İspat Yazımı",
    description:
      "Doğrudan ispat, çelişki, tümevarım ve yapılandırılmış çözüm yazımı için çekirdek alan.",
    emphasis: "Yazmadan ilerleme sayılmıyor.",
  },
  {
    id: "core-analysis",
    title: "Analize Giriş",
    description:
      "Limit fikri, epsilon yaklaşımı ve gerçek sayı sezgisini yavaş ama sağlam kuran rota.",
    emphasis: "Sezgi ile tanımı birlikte taşı.",
  },
  {
    id: "linear-algebra",
    title: "Lineer Cebir Temelleri",
    description:
      "Vektör uzayı, doğrusal dönüşüm ve baz kavramını soyut ama okunabilir bir çizgide ele alır.",
    emphasis: "Tanım, örnek, karşı örnek üçlüsü.",
  },
];

export const defaultLearningResources: LearningResource[] = [
  {
    id: "ali-nesin-notes",
    title: "Matematik ve Matematiksel Düşünme Notları",
    author: "Ali Nesin",
    format: "notlar",
    note: "Türkçe akademik ton için temel referans çizgilerinden biri.",
    items: [
      {
        id: "content-definition-reading",
        title: "Tanım Okuma Kartı",
        kind: "not",
        url: "/learning-embed/tanim-okuma-karti",
        summary:
          "Tanım metnini yavaş okuyup nesne, koşul ve sonuç parçalarına ayırman için kısa bir iç not.",
        durationLabel: "7 dk",
        sourceLabel: "Cinarithm içeriği",
      },
    ],
  },
  {
    id: "nesin-videos",
    title: "Nesin Matematik Köyü Ders Kayıtları",
    author: "Nesin Matematik Köyü",
    format: "ders serisi",
    note: "Kavramların Türkçe anlatım ritmini korumak için güçlü kaynak.",
    items: [],
  },
  {
    id: "book-of-proof",
    title: "Book of Proof",
    author: "Richard Hammack",
    format: "kitap",
    note: "İspat yazımını oturtmak için mevcut uygulama verisiyle de uyumlu.",
    items: [
      {
        id: "content-proof-flow",
        title: "İspat Akışı Kartı",
        kind: "not",
        url: "/learning-embed/ispat-akisi-karti",
        summary:
          "Bir ispatı hedef, veri ve geçiş adımlarına bölerek yazmanı kolaylaştıran kısa rehber.",
        durationLabel: "9 dk",
        sourceLabel: "Cinarithm içeriği",
      },
    ],
  },
  {
    id: "spivak",
    title: "Calculus",
    author: "Michael Spivak",
    format: "kitap",
    note: "Analize girişte kavram odaklı ilerleme için güçlü omurga.",
    items: [],
  },
  {
    id: "axler",
    title: "Linear Algebra Done Right",
    author: "Sheldon Axler",
    format: "kitap",
    note: "Lineer cebiri işlem ezberi yerine yapı üzerinden kurar.",
    items: [],
  },
  {
    id: "reading-sequence",
    title: "Türkçe Akademik Okuma Sırası",
    author: "Cinarithm önerisi",
    format: "okuma listesi",
    note: "Tanım, örnek, kısa ispat, tekrar döngüsüne göre düzenlenmiş liste.",
    items: [],
  },
];

export const defaultLearningCourses: LearningCourse[] = [
  {
    id: "course-language",
    title: "Tanım Okuma ve Matematiksel Dil",
    categoryId: "math-language",
    level: "temel",
    progress: 68,
    status: "derinleşiyor",
    summary:
      "Kümeler, bağıntılar ve fonksiyonlar üzerinden matematik cümlesi okumayı temizle.",
    nextStep: "Birebir-örten örneklerini kendi cümlelerinle yeniden yaz.",
    topics: ["kümeler", "niceleyiciler", "fonksiyon dili", "karşı örnek"],
    resourceIds: ["ali-nesin-notes", "nesin-videos", "book-of-proof"],
    relatedBookIds: ["book-proof"],
    relatedNodeIds: ["node-sets", "node-functions"],
    relatedProofIds: ["proof-1"],
  },
  {
    id: "course-proof",
    title: "İspat Teknikleri Atölyesi",
    categoryId: "proof-writing",
    level: "temel",
    progress: 54,
    status: "derinleşiyor",
    summary:
      "Doğrudan ispat, çelişki ve tümevarımı kısa ama düzenli yazı bloklarıyla oturt.",
    nextStep: "Aynı önermeyi iki farklı teknikle yazıp farkı günlüğe geçir.",
    topics: ["doğrudan ispat", "çelişki", "tümevarım", "ispat taslağı"],
    resourceIds: ["book-of-proof", "ali-nesin-notes", "reading-sequence"],
    relatedBookIds: ["book-proof"],
    relatedNodeIds: ["node-induction"],
    relatedProofIds: ["proof-1", "proof-2"],
  },
  {
    id: "course-analysis",
    title: "Analize Yavaş Giriş",
    categoryId: "core-analysis",
    level: "orta",
    progress: 29,
    status: "başladı",
    summary:
      "Limit ve süreklilik fikrini işlem yarışına girmeden, kavram ve sezgi üstünden kur.",
    nextStep: "Limit örneklerini grafik sezgisi ve tanım cümlesiyle eşleştir.",
    topics: ["gerçek sayılar", "limit fikri", "epsilon sezgisi", "süreklilik"],
    resourceIds: ["spivak", "nesin-videos", "reading-sequence"],
    relatedBookIds: ["book-spivak"],
    relatedNodeIds: [],
    relatedProofIds: [],
  },
  {
    id: "course-linear",
    title: "Lineer Cebire Açılış",
    categoryId: "linear-algebra",
    level: "orta",
    progress: 17,
    status: "sırada",
    summary:
      "Vektör uzayı ve doğrusal dönüşüm kavramlarını erken dönemde soyut ama korkutmayan bir çizgide aç.",
    nextStep: "Bir bazın neden seçim işi olduğunu örneklerle notlaştır.",
    topics: ["vektör uzayı", "baz", "boyut", "doğrusal dönüşüm"],
    resourceIds: ["axler", "ali-nesin-notes"],
    relatedBookIds: ["book-axler"],
    relatedNodeIds: [],
    relatedProofIds: [],
  },
];
