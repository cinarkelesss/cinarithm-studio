export type EmbeddedLearningPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  bullets: string[];
  prompt: string;
};

export const embeddedLearningPages: EmbeddedLearningPage[] = [
  {
    slug: "tanim-okuma-karti",
    title: "Tanım Okuma Kartı",
    eyebrow: "Temel Okuma Ritmi",
    summary:
      "Bir tanımı hızlı tüketmek yerine parçalara ayır. Nesne, koşul ve sonuç cümlelerini ayrı ayrı gör.",
    bullets: [
      "Önce tanımın hangi nesne hakkında konuştuğunu yaz.",
      "Sonra koşulları tek tek işaretle; gizli niceleyicileri özellikle ara.",
      "Bir örnek ve bir karşı örnek üretmeden tanımı geçtiğini sayma.",
    ],
    prompt:
      "Bugün çalıştığın tanımı kendi kelimelerinle üç satırda yeniden yaz ve en az bir karşı örnek dene.",
  },
  {
    slug: "ispat-akisi-karti",
    title: "İspat Akışı Kartı",
    eyebrow: "Yazma Disiplini",
    summary:
      "İspat yazarken hedefi, veri setini ve kullanılacak tekniği baştan görünür kıl. Akış net olunca cümleler daha az dağılıyor.",
    bullets: [
      "İlk satırda neyi göstereceğini açıkça yaz.",
      "Elindeki varsayımları ayrı bir satırda sadeleştir.",
      "Geçişlerin her birinde neden o adımı attığını tek cümleyle savun.",
    ],
    prompt:
      "Aynı önermeyi bir kez doğrudan, bir kez çelişkiyle kurup hangisinin daha doğal aktığını günlüğe not et.",
  },
];

export function getEmbeddedLearningPage(slug: string) {
  return embeddedLearningPages.find((page) => page.slug === slug) ?? null;
}
