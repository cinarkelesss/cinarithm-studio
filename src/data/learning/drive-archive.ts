import {
  chooseCanonicalVideo,
  groupDuplicateLectureFiles,
  parseDriveArchiveFile,
  type DriveArchiveLecture,
  type RawDriveArchiveFile,
} from "@/lib/learning/ingestion";

const rawDriveArchiveFiles: RawDriveArchiveFile[] = [
  {
    id: "1keikO--Vt6ZZeI6RsUeyj0T_V4u9gph-",
    title: "001 Biraz Felsefe - Ali Nesin 1-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 312777170,
    url: "https://drive.google.com/file/d/1keikO--Vt6ZZeI6RsUeyj0T_V4u9gph-/view?usp=drivesdk",
  },
  {
    id: "1-akd0yzO9KUf0E8tG8sBAZSwodC67HVw",
    title: "002 Eleman ve Küme - Ali Nesin 2-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 208357589,
    url: "https://drive.google.com/file/d/1-akd0yzO9KUf0E8tG8sBAZSwodC67HVw/view?usp=drivesdk",
  },
  {
    id: "1XmGwir3QzCW6xQ0_fS6DtATQYnmbnHTk",
    title: "003 Matematiğin Dili ve Aksiyomları - Ali Nesin 3-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 239344262,
    url: "https://drive.google.com/file/d/1XmGwir3QzCW6xQ0_fS6DtATQYnmbnHTk/view?usp=drivesdk",
  },
  {
    id: "1edk6jy8fhVG2il6UpITODx_SsD2rXYxU",
    title: "004 Modus Ponens - Ali Nesin 4-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 185278215,
    url: "https://drive.google.com/file/d/1edk6jy8fhVG2il6UpITODx_SsD2rXYxU/view?usp=drivesdk",
  },
  {
    id: "1B3Gl_GTj7Zs9tTRqUVP2HtT5S23kuBHx",
    title: "005 Bézout Teoremi - Yusuf Ünlü 1-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 228004671,
    url: "https://drive.google.com/file/d/1B3Gl_GTj7Zs9tTRqUVP2HtT5S23kuBHx/view?usp=drivesdk",
  },
  {
    id: "1xW3tOTSuFY15HdhpF7yzkouWsffuoQ_x",
    title: "006 Aritmetik Aksiyomları - Yusuf Ünlü 2-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 152284135,
    url: "https://drive.google.com/file/d/1xW3tOTSuFY15HdhpF7yzkouWsffuoQ_x/view?usp=drivesdk",
  },
  {
    id: "1jQ-zUiK6kRAkWcBhtsqk9oj0IN24sHtG",
    title: "007 Fonksiyon Nedir - Yusuf Ünlü 3-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 118206062,
    url: "https://drive.google.com/file/d/1jQ-zUiK6kRAkWcBhtsqk9oj0IN24sHtG/view?usp=drivesdk",
  },
  {
    id: "1oBBp7tzVA2hywX6GhjF6ITZDzNyEyRJv",
    title: "008 Aritmetik Özellikler - Yusuf Ünlü 4-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 298082610,
    url: "https://drive.google.com/file/d/1oBBp7tzVA2hywX6GhjF6ITZDzNyEyRJv/view?usp=drivesdk",
  },
  {
    id: "1RVsODIzZ2b30_ol2IHkUjqwh4sHyQ9aY",
    title: "009 Sıralama Aksiyomları - Yusuf Ünlü 5-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 162983257,
    url: "https://drive.google.com/file/d/1RVsODIzZ2b30_ol2IHkUjqwh4sHyQ9aY/view?usp=drivesdk",
  },
  {
    id: "1xIWaO-joVbNK7LNvgouGJaVwrkizBFUU",
    title: "010 Kümeler Kuramının Önemi ve Sonsuzları Karşılaştırmak - Ali Nesin 5-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 463166301,
    url: "https://drive.google.com/file/d/1xIWaO-joVbNK7LNvgouGJaVwrkizBFUU/view?usp=drivesdk",
  },
  {
    id: "1u6wymRJCuj-TaPTAUE4e9mFG2Hx17CiP",
    title: "011 Hilbert'in Sonsuz Oteli - Ali Nesin 6-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 851189973,
    url: "https://drive.google.com/file/d/1u6wymRJCuj-TaPTAUE4e9mFG2Hx17CiP/view?usp=drivesdk",
  },
  {
    id: "172CRROoI0STjMu8jyxOWzRT7i-BXo11w",
    title: "012 Sıralama Özellikleri - Yusuf Ünlü 6-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 420185294,
    url: "https://drive.google.com/file/d/172CRROoI0STjMu8jyxOWzRT7i-BXo11w/view?usp=drivesdk",
  },
  {
    id: "14sscKS2eu_JxiJZmQ-BBvCdiwyV47gEy",
    title: "013 Mutlak Değer - Yusuf Ünlü 7-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 199358949,
    url: "https://drive.google.com/file/d/14sscKS2eu_JxiJZmQ-BBvCdiwyV47gEy/view?usp=drivesdk",
  },
  {
    id: "1KopD5oedrMsEEOFydlvJxidmV7LCMYvZ",
    title: "014 Tamlık Özelliği - Yusuf Ünlü 8-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 73375955,
    url: "https://drive.google.com/file/d/1KopD5oedrMsEEOFydlvJxidmV7LCMYvZ/view?usp=drivesdk",
  },
  {
    id: "15O8Gg56gJAXabavmWHqtli2haTOHF2_X",
    title: "015 Gerçel Sayılar Rasyonel Sayıları İçerir - Yusuf Ünlü 9-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 263466908,
    url: "https://drive.google.com/file/d/15O8Gg56gJAXabavmWHqtli2haTOHF2_X/view?usp=drivesdk",
  },
  {
    id: "1TutgDY4gObcCVmIqrUMMhi9aTj7gCAnd",
    title: "016 Supremum - Yusuf Ünlü 10-(1080p25).f137.mp4.part",
    mimeType: "application/octet-stream",
    sizeBytes: 293598283,
    url: "https://drive.google.com/file/d/1TutgDY4gObcCVmIqrUMMhi9aTj7gCAnd/view?usp=drivesdk",
  },
  {
    id: "1ZYuuBhHJ6dVLx9wF9D-0bvkU8No9hFmc",
    title: "017 Çizgeler Teorisine Giriş - Özlem Beyarslan 1-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 284278101,
    url: "https://drive.google.com/file/d/1ZYuuBhHJ6dVLx9wF9D-0bvkU8No9hFmc/view?usp=drivesdk",
  },
  {
    id: "1LRyKWkl6p0nQWA8lI4PJsCCx8YjYuCvi",
    title: "018 Graf İzomorfizma ve Otomorfizması - Özlem Beyarslan 2-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 111628320,
    url: "https://drive.google.com/file/d/1LRyKWkl6p0nQWA8lI4PJsCCx8YjYuCvi/view?usp=drivesdk",
  },
  {
    id: "1sRxr6jj_e-yIvNdZu4hdB-3FSiy_yGrr",
    title: "019 Meşhur Graflar - Özlem Beyarslan 3-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 171909384,
    url: "https://drive.google.com/file/d/1sRxr6jj_e-yIvNdZu4hdB-3FSiy_yGrr/view?usp=drivesdk",
  },
  {
    id: "1t-Qbstau2kgljWB-nCzOh2HTHIz9HqWK",
    title: "020 Diziden Grafa ve Graf İzomorfaları - Özlem Beyarslan 4-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 210554385,
    url: "https://drive.google.com/file/d/1t-Qbstau2kgljWB-nCzOh2HTHIz9HqWK/view?usp=drivesdk",
  },
  {
    id: "1F1K9g7ONS1bIbqMUgEqyahQUo46v3aZH",
    title: "021 Graf Otomorfizmaları - Özlem Beyarslan 5-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 235765420,
    url: "https://drive.google.com/file/d/1F1K9g7ONS1bIbqMUgEqyahQUo46v3aZH/view?usp=drivesdk",
  },
  {
    id: "1VMfF_TZ1kIdIJVTdJe4a50Jzi2n4f9TG",
    title: "022 Düzlemsel ve Renkli Graflar - Özlem Beyarslan 6-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 138253211,
    url: "https://drive.google.com/file/d/1VMfF_TZ1kIdIJVTdJe4a50Jzi2n4f9TG/view?usp=drivesdk",
  },
  {
    id: "1aIWLBuLSHyCK_vqzxoUUkLrBry-fE8yj",
    title: "023 Arşimet Özelliği ve Yoğunluk - Yusuf Ünlü 11-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 316852414,
    url: "https://drive.google.com/file/d/1aIWLBuLSHyCK_vqzxoUUkLrBry-fE8yj/view?usp=drivesdk",
  },
  {
    id: "1_eK-SFlQliGZSFTiRbjC8FyLtru7R22Z",
    title: "024 Üst Sınır Teoremi ve Tekrar - Yusuf Ünlü 12-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 363427244,
    url: "https://drive.google.com/file/d/1_eK-SFlQliGZSFTiRbjC8FyLtru7R22Z/view?usp=drivesdk",
  },
  {
    id: "1op0ENsOVoHWEx4HprSgcB211XyOaL-dk",
    title: "025 Kombinasyon Hesapları Ödev Çözümü - Ali Nesin 7-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 717417809,
    url: "https://drive.google.com/file/d/1op0ENsOVoHWEx4HprSgcB211XyOaL-dk/view?usp=drivesdk",
  },
  {
    id: "1YY9RBzI-1UYfuvn3Dq9WVm4D1VbnDXOP",
    title: "027 Gerçel Sayılarda n'inci Kök - Yusuf Ünlü 13-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 750865470,
    url: "https://drive.google.com/file/d/1YY9RBzI-1UYfuvn3Dq9WVm4D1VbnDXOP/view?usp=drivesdk",
  },
  {
    id: "1JOElL2JKdw01CLF-FN8tQQCfzpno8L-U",
    title: "029 Kümeler Kuramında Fonksiyonlar - Ali Nesin 10-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 494038354,
    url: "https://drive.google.com/file/d/1JOElL2JKdw01CLF-FN8tQQCfzpno8L-U/view?usp=drivesdk",
  },
  {
    id: "1IA_0koxtUK2SJTMe06NrxASttcde0fTX",
    title: "033 Metrik Uzay - Ali Nesin 12-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 213059597,
    url: "https://drive.google.com/file/d/1IA_0koxtUK2SJTMe06NrxASttcde0fTX/view?usp=drivesdk",
  },
  {
    id: "1GVOpMk-CLLkEAx_39w8bjmrsO_Oz1-3p",
    title: "034 Ultra Metrik  - Ali Nesin 13-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 308333939,
    url: "https://drive.google.com/file/d/1GVOpMk-CLLkEAx_39w8bjmrsO_Oz1-3p/view?usp=drivesdk",
  },
  {
    id: "1Rf6-IfrpQWT4kdcn0oDBebPn-S1kGtOD",
    title: "035 Metrik Örnekleri, Cauchy-Schwartz, Minkowski - Yusuf Ünlü 16-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 429733041,
    url: "https://drive.google.com/file/d/1Rf6-IfrpQWT4kdcn0oDBebPn-S1kGtOD/view?usp=drivesdk",
  },
  {
    id: "12FseDxYRCVFamn_OSv2HT0nijEVjAkYa",
    title: "037 Kümeler Kuramı Aksiyom 3  - Ali Nesin 14-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 336243718,
    url: "https://drive.google.com/file/d/12FseDxYRCVFamn_OSv2HT0nijEVjAkYa/view?usp=drivesdk",
  },
  {
    id: "15JMpxS03IPY4znlIuWKkMhbQCyhNgqG7",
    title: "038 Russell Paradoksu  - Ali Nesin 15-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 159261671,
    url: "https://drive.google.com/file/d/15JMpxS03IPY4znlIuWKkMhbQCyhNgqG7/view?usp=drivesdk",
  },
  {
    id: "1qllXxb9Koxh1pK2ihEZuRdXfxwrl7gGf",
    title: "039 Açık Kümeler ve Denk Topolojiler - Yusuf Ünlü 18-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 494818802,
    url: "https://drive.google.com/file/d/1qllXxb9Koxh1pK2ihEZuRdXfxwrl7gGf/view?usp=drivesdk",
  },
  {
    id: "1TUIAQAyI_i-5RtR3uBZzmcJWRmESF3cW",
    title: "040 Yığılma Noktaları - Yusuf Ünlü 19-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 428918746,
    url: "https://drive.google.com/file/d/1TUIAQAyI_i-5RtR3uBZzmcJWRmESF3cW/view?usp=drivesdk",
  },
  {
    id: "11ghXk6Dr8lXZn7Nj33S_uOf91Pk7MVEt",
    title: "041 İlk 6 Aksiyom ve İlk Birkaç Doğal Sayı - Ali Nesin 16-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 501402358,
    url: "https://drive.google.com/file/d/11ghXk6Dr8lXZn7Nj33S_uOf91Pk7MVEt/view?usp=drivesdk",
  },
  {
    id: "1ZbT6lMFptfqyolmIjyWRGiFTIN3HbJPi",
    title: "042 Metrik Uzayda Dizi - Ali Nesin 17-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 825388968,
    url: "https://drive.google.com/file/d/1ZbT6lMFptfqyolmIjyWRGiFTIN3HbJPi/view?usp=drivesdk",
  },
  {
    id: "1bneV0RefR5tvVe2x_8k-_TzliLDoSEXk",
    title: "043 Alt Uzayda Açık Küme - Yusuf Ünlü 20-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 295154374,
    url: "https://drive.google.com/file/d/1bneV0RefR5tvVe2x_8k-_TzliLDoSEXk/view?usp=drivesdk",
  },
  {
    id: "1JMVBsNWWVYFtJYkfsGyUHIm7f6P9E4X4",
    title: "133 İyi Sıralı Kümeler 2 - Ali Nesin 50-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 452949518,
    url: "https://drive.google.com/file/d/1JMVBsNWWVYFtJYkfsGyUHIm7f6P9E4X4/view?usp=drivesdk",
  },
  {
    id: "1O-O-gwJy5PA_-ttK3P07aFUScissuYT8",
    title: "134 İyi Sıralı Kümeler 3 -  Ali Nesin 51-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 464380068,
    url: "https://drive.google.com/file/d/1O-O-gwJy5PA_-ttK3P07aFUScissuYT8/view?usp=drivesdk",
  },
  {
    id: "1RaHl-wrC_vztjCn2jPtgPlKB3ukUVkft",
    title: "135 İyi Sıralı Kümeler 4 - Ali Nesin 52-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 412136497,
    url: "https://drive.google.com/file/d/1RaHl-wrC_vztjCn2jPtgPlKB3ukUVkft/view?usp=drivesdk",
  },
  {
    id: "10pICOwTWBHt1tFMmxqdQRVEu5N1Ez6d6",
    title: "136 Ordinaller 1 - Ali Nesin 53-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 535268571,
    url: "https://drive.google.com/file/d/10pICOwTWBHt1tFMmxqdQRVEu5N1Ez6d6/view?usp=drivesdk",
  },
  {
    id: "1C7jPkzfJxlhnz8HZvUid8Q_HRuCicqoN",
    title: "138 Sıralı Küme Homomorfizması  - Ali Nesin 55-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 505550612,
    url: "https://drive.google.com/file/d/1C7jPkzfJxlhnz8HZvUid8Q_HRuCicqoN/view?usp=drivesdk",
  },
  {
    id: "108KUg6bq6XXk9bw097A-jIEh7MOKzEbZ",
    title: "139 Ordinaller 2 - Ali Nesin 56-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 360275359,
    url: "https://drive.google.com/file/d/108KUg6bq6XXk9bw097A-jIEh7MOKzEbZ/view?usp=drivesdk",
  },
  {
    id: "1Q2amd9CZ8gB10ZSUuRw1eCtngNERC_LK",
    title: "140 Ordinaller 3 - Ali Nesin 57-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 479987880,
    url: "https://drive.google.com/file/d/1Q2amd9CZ8gB10ZSUuRw1eCtngNERC_LK/view?usp=drivesdk",
  },
  {
    id: "1J-1CMv1ou8zTlF0QobXp1154ODdIdEgk",
    title: "141 Simetrik Polinomlar - Özlem Beyarslan 7-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 2491773239,
    url: "https://drive.google.com/file/d/1J-1CMv1ou8zTlF0QobXp1154ODdIdEgk/view?usp=drivesdk",
  },
  {
    id: "1ZrjLVEW3uALWD9EL5NyddOJZuaCtydrT",
    title: "142 Ordinaller 4 - Ali Nesin 58-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 692935762,
    url: "https://drive.google.com/file/d/1ZrjLVEW3uALWD9EL5NyddOJZuaCtydrT/view?usp=drivesdk",
  },
  {
    id: "1DPAW58jIIfFxnF8OaPFCtm_ZYUMvhwZa",
    title: "143 Ordinaller 5 - Ali Nesin 59-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 172622087,
    url: "https://drive.google.com/file/d/1DPAW58jIIfFxnF8OaPFCtm_ZYUMvhwZa/view?usp=drivesdk",
  },
  {
    id: "1I8m4OJZqpO-KsORDPHZprfM3hL3ZSaYy",
    title: "144 Ordinallerde Üs Alma - Ali Nesin 60-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 88981175,
    url: "https://drive.google.com/file/d/1I8m4OJZqpO-KsORDPHZprfM3hL3ZSaYy/view?usp=drivesdk",
  },
  {
    id: "1gNjxPWAs9_ZoYJ8wFiVydB85xA-vu0yd",
    title: "145 Düzgün Süreklilik - Yusuf Ünlü 70-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 739937885,
    url: "https://drive.google.com/file/d/1gNjxPWAs9_ZoYJ8wFiVydB85xA-vu0yd/view?usp=drivesdk",
  },
  {
    id: "1kflaC8fbzNdovTD1u31Iy8N4cvS7MSbV",
    title: "146 Ordinallerde Cantor Normal Form - Ali Nesin 61-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 556322011,
    url: "https://drive.google.com/file/d/1kflaC8fbzNdovTD1u31Iy8N4cvS7MSbV/view?usp=drivesdk",
  },
  {
    id: "1vMPrbbmKt09jmYv0wy7nAg3d_vuxOh16",
    title: "147 Ödev ve Soru - Yusuf Ünlü 71-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1127225103,
    url: "https://drive.google.com/file/d/1vMPrbbmKt09jmYv0wy7nAg3d_vuxOh16/view?usp=drivesdk",
  },
  {
    id: "1FI8mYzK3gtupqLIYqw2xCa-J8lyieUyn",
    title: "148 Düzgün Yakınsaklık - Yusuf Ünlü 72-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1239333511,
    url: "https://drive.google.com/file/d/1FI8mYzK3gtupqLIYqw2xCa-J8lyieUyn/view?usp=drivesdk",
  },
  {
    id: "1yGx9uJbtGqN2Cmp7t6PD7cMLgN21Cpbi",
    title: "149 Lebesgue ve Borel Ölçülebilir - Yusuf Ünlü 73-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 532664861,
    url: "https://drive.google.com/file/d/1yGx9uJbtGqN2Cmp7t6PD7cMLgN21Cpbi/view?usp=drivesdk",
  },
  {
    id: "1Y7aVu5nMLyGEewE0wPN333n8wdiJiH40",
    title: "150 Kare Boyama Problemleri - Ali Nesin 62-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 362978759,
    url: "https://drive.google.com/file/d/1Y7aVu5nMLyGEewE0wPN333n8wdiJiH40/view?usp=drivesdk",
  },
  {
    id: "1JlHNh6tQq3UoNNxo7jt-d2EK2AxAMZqc",
    title: "151 Ordinallerde Toplama ve Çarpma Formülü - Ali Nesin 63-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 480356715,
    url: "https://drive.google.com/file/d/1JlHNh6tQq3UoNNxo7jt-d2EK2AxAMZqc/view?usp=drivesdk",
  },
  {
    id: "1Ff4nTF6hAecCgn8x8Nrp5nOmcpOzfs9r",
    title: "152 Limit Girişi ve Yoğunlaşma Noktası - Ali Nesin 64-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 493788232,
    url: "https://drive.google.com/file/d/1Ff4nTF6hAecCgn8x8Nrp5nOmcpOzfs9r/view?usp=drivesdk",
  },
  {
    id: "1zZgm_p5g3F1cvSb-P9XVP-FlVaxO7dgY",
    title: "153 Eşitsizlikler - Yusuf Ünlü 74-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 649705198,
    url: "https://drive.google.com/file/d/1zZgm_p5g3F1cvSb-P9XVP-FlVaxO7dgY/view?usp=drivesdk",
  },
  {
    id: "1pw2BJpZhC3ib20z6raduX2PUbKc5yzw_",
    title: "154 Limit ve Yoğunlaşma Noktası Özellikleri - Ali Nesin 65-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1716510463,
    url: "https://drive.google.com/file/d/1pw2BJpZhC3ib20z6raduX2PUbKc5yzw_/view?usp=drivesdk",
  },
  {
    id: "1ECCgu5_WADjySG3L_E7Ti0cTgo0mDlzy",
    title: "155 Üstel Fonksiyonlar ve Limitleri - Yusuf Ünlü 75-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1744707734,
    url: "https://drive.google.com/file/d/1ECCgu5_WADjySG3L_E7Ti0cTgo0mDlzy/view?usp=drivesdk",
  },
  {
    id: "1sZ7aEvyRXUVmjGAkjYp6ug5wQeRNC19O",
    title: "156 Düzgün Süreklilik - Ali Nesin 66-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1358081223,
    url: "https://drive.google.com/file/d/1sZ7aEvyRXUVmjGAkjYp6ug5wQeRNC19O/view?usp=drivesdk",
  },
  {
    id: "1jdJsNPT6b6Lg8-86SDLpyk21EkoBmQ0E",
    title: "157 İç Çarpım ve Hilbert Uzayı - Yusuf Ünlü 76-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 749743697,
    url: "https://drive.google.com/file/d/1jdJsNPT6b6Lg8-86SDLpyk21EkoBmQ0E/view?usp=drivesdk",
  },
  {
    id: "1lguO2u9W7634VQTqMeNMa-PDaWyK2kXF",
    title: "158 Alıştırmalar - Yusuf Ünlü 77-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 332074340,
    url: "https://drive.google.com/file/d/1lguO2u9W7634VQTqMeNMa-PDaWyK2kXF/view?usp=drivesdk",
  },
  {
    id: "1fWZi1fp0Mkqtlaqdf9wiuqx5MqaKbdez",
    title: "159 Eşitsizlikler - Yusuf Ünlü 78-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 801375194,
    url: "https://drive.google.com/file/d/1fWZi1fp0Mkqtlaqdf9wiuqx5MqaKbdez/view?usp=drivesdk",
  },
  {
    id: "197Lyb9XtHw2qniIvV9Q6BXWCdAfv6BCe",
    title: "160 Türev Özellikleri ve Trigonometri - Ali Nesin 67-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 798878983,
    url: "https://drive.google.com/file/d/197Lyb9XtHw2qniIvV9Q6BXWCdAfv6BCe/view?usp=drivesdk",
  },
  {
    id: "1JnoPbDpN5meabCM3FDeeIKOXvKGY4Y83",
    title: "161 Eşitsizlikler, Oran ve Kök Testi - Yusuf Ünlü 79-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 638247966,
    url: "https://drive.google.com/file/d/1JnoPbDpN5meabCM3FDeeIKOXvKGY4Y83/view?usp=drivesdk",
  },
  {
    id: "1GLQuvoGD4dXjXqjc6xERmTiRRyAtyF2i",
    title: "162 Logaritma, Limit ve L'Hospital - Yusuf Ünlü 80-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 851619291,
    url: "https://drive.google.com/file/d/1GLQuvoGD4dXjXqjc6xERmTiRRyAtyF2i/view?usp=drivesdk",
  },
  {
    id: "1lrjzyJLMVb6whb4atXTA6tJ8nvfTq0gR",
    title: "163 Calculus - Ali Nesin 68-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 638187460,
    url: "https://drive.google.com/file/d/1lrjzyJLMVb6whb4atXTA6tJ8nvfTq0gR/view?usp=drivesdk",
  },
  {
    id: "1wyL17tm7NdvoMjmlWlezjYdRzxIVz7xR",
    title: "164 Problemler - Yusuf Ünlü 81-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 452128836,
    url: "https://drive.google.com/file/d/1wyL17tm7NdvoMjmlWlezjYdRzxIVz7xR/view?usp=drivesdk",
  },
  {
    id: "1fodXm4hVOYLLP983Bnk9j-1__QQRLHS1",
    title: "185 Taban - Yusuf Ünlü 91-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1125116071,
    url: "https://drive.google.com/file/d/1fodXm4hVOYLLP983Bnk9j-1__QQRLHS1/view?usp=drivesdk",
  },
  {
    id: "18R6Wb8DIc4PzcT3y1ALfn-456LaFitZI",
    title: "197 Grup Teori Özellikleri - Özlem Beyarslan 9-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 696303167,
    url: "https://drive.google.com/file/d/18R6Wb8DIc4PzcT3y1ALfn-456LaFitZI/view?usp=drivesdk",
  },
  {
    id: "1d1wIX69at2l6u1fVvmIujUdATQzAn5_w",
    title: "198 Üreteçler ve Grup Eylemleri - Özlem Beyarslan 10-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 963391409,
    url: "https://drive.google.com/file/d/1d1wIX69at2l6u1fVvmIujUdATQzAn5_w/view?usp=drivesdk",
  },
  {
    id: "1Pq9VgT7RGoJhF3HO-aXhbz3evykpRc77",
    title: "199 Grup Etkisi - Özlem Beyarslan 11-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 702541742,
    url: "https://drive.google.com/file/d/1Pq9VgT7RGoJhF3HO-aXhbz3evykpRc77/view?usp=drivesdk",
  },
  {
    id: "12J2kKWOF1GK-M-cBCFjKr7Wvc-3HW1Kc",
    title: "200 Centralizers - Ali Nesin 85-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 375176261,
    url: "https://drive.google.com/file/d/12J2kKWOF1GK-M-cBCFjKr7Wvc-3HW1Kc/view?usp=drivesdk",
  },
  {
    id: "1-2yYPSy5KiQzcGjY86t-sVu_mMDPf4Tt",
    title: "202 Commutators - Ali Nesin 87-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 309535539,
    url: "https://drive.google.com/file/d/1-2yYPSy5KiQzcGjY86t-sVu_mMDPf4Tt/view?usp=drivesdk",
  },
  {
    id: "16TqoYf57PPfXm-YQqEXkZyOHK6ourc7M",
    title: "203 Türev - Yusuf Ünlü 97-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 683695510,
    url: "https://drive.google.com/file/d/16TqoYf57PPfXm-YQqEXkZyOHK6ourc7M/view?usp=drivesdk",
  },
  {
    id: "1CXF-ChWAxsptuq2FBGpeufQ3Lca1NdF7",
    title: "204 Türev ve Taylor Teoremi - Yusuf Ünlü 98-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1136556796,
    url: "https://drive.google.com/file/d/1CXF-ChWAxsptuq2FBGpeufQ3Lca1NdF7/view?usp=drivesdk",
  },
  {
    id: "1bGKL2XWNcZ5e3I-0snQZdmBztkGFHtfL",
    title: "205 Türev ve Düzgün Yakınsaklık - Yusuf Ünlü 99-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 621167552,
    url: "https://drive.google.com/file/d/1bGKL2XWNcZ5e3I-0snQZdmBztkGFHtfL/view?usp=drivesdk",
  },
  {
    id: "1YeTdJp7qeb3d2BxcmL8sJ-xFiQKOgugr",
    title: "206 Grup Teori Soruları - Ali Nesin 88-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 193726656,
    url: "https://drive.google.com/file/d/1YeTdJp7qeb3d2BxcmL8sJ-xFiQKOgugr/view?usp=drivesdk",
  },
  {
    id: "1snA929cquJxl9EBA-IaFRjArUZog-560",
    title: "207  Düzgün Yakınsaklık - Yusuf Ünlü 100-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 463173476,
    url: "https://drive.google.com/file/d/1snA929cquJxl9EBA-IaFRjArUZog-560/view?usp=drivesdk",
  },
  {
    id: "1RoMSiaF8MSICyPxFSo4V8DrJb0j740Ma",
    title: "208 Kümeler Kuramı ve Sayılar - Ali Nesin 89-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 1541224239,
    url: "https://drive.google.com/file/d/1RoMSiaF8MSICyPxFSo4V8DrJb0j740Ma/view?usp=drivesdk",
  },
  {
    id: "1aU8q9-omnvwH9XY2mCsKKKO2Ya5Uficw",
    title: "208 Kümeler Kuramı ve Sayılar - Ali Nesin 89-(1080p25).temp.mp4",
    mimeType: "video/mp4",
    sizeBytes: 597426224,
    url: "https://drive.google.com/file/d/1aU8q9-omnvwH9XY2mCsKKKO2Ya5Uficw/view?usp=drivesdk",
  },
  {
    id: "1167MIkYJSOiA6G8GuSSxWHg8LCizOHyo",
    title: "209 Türev Problemleri 1 - Yusuf Ünlü 101-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 649444502,
    url: "https://drive.google.com/file/d/1167MIkYJSOiA6G8GuSSxWHg8LCizOHyo/view?usp=drivesdk",
  },
  {
    id: "1m78reKvng-OWyPND1FZ2rUY4wbRJDblX",
    title: "209 Türev Problemleri 1 - Yusuf Ünlü 101-(1080p25).temp.mp4",
    mimeType: "video/mp4",
    sizeBytes: 565968944,
    url: "https://drive.google.com/file/d/1m78reKvng-OWyPND1FZ2rUY4wbRJDblX/view?usp=drivesdk",
  },
  {
    id: "1ZJyaONc9A-I9DLmGSLTPFNbBEovEA89c",
    title: "210 Grup Teori： Sonlu Endeks Soruları - Ali Nesin 90-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 545070756,
    url: "https://drive.google.com/file/d/1ZJyaONc9A-I9DLmGSLTPFNbBEovEA89c/view?usp=drivesdk",
  },
  {
    id: "11a3tPgnRPQibDmZl_QQF2YoRT8mZhNOt",
    title: "211 Türev Problemleri 2 - Yusuf Ünlü 102-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 449913641,
    url: "https://drive.google.com/file/d/11a3tPgnRPQibDmZl_QQF2YoRT8mZhNOt/view?usp=drivesdk",
  },
  {
    id: "1Ok5-nG8iJG8Bx8HCoJJNJ-8hY45hVLWv",
    title: "212 Sabit Nokta Teoremi - Yusuf Ünlü 103-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 836601089,
    url: "https://drive.google.com/file/d/1Ok5-nG8iJG8Bx8HCoJJNJ-8hY45hVLWv/view?usp=drivesdk",
  },
  {
    id: "1inj1VSEsBba5ZhIc6xz1wV8eXeFaDDm3",
    title: "213 Riemann İntegrali 1 - Yusuf Ünlü 104-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 807166758,
    url: "https://drive.google.com/file/d/1inj1VSEsBba5ZhIc6xz1wV8eXeFaDDm3/view?usp=drivesdk",
  },
  {
    id: "1qngPo5EbAYubvo4gfkIKHBszj5Fwv_LD",
    title: "214 Grup Teori Alıştırmaları (Cauchy Teoremi, p-grup,...) - Ali Nesin 91-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 529230462,
    url: "https://drive.google.com/file/d/1qngPo5EbAYubvo4gfkIKHBszj5Fwv_LD/view?usp=drivesdk",
  },
  {
    id: "1DN_pRwsIBu8SkFfOnXq9ygwMUyjTjM3G",
    title: "215 Riemann İntegrali 2 - Yusuf Ünlü 105-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 41374520,
    url: "https://drive.google.com/file/d/1DN_pRwsIBu8SkFfOnXq9ygwMUyjTjM3G/view?usp=drivesdk",
  },
  {
    id: "1KTJ5mdYgDi90gA0iRzwu0_JT7P5DUJHB",
    title: "215 Riemann İntegrali 2 - Yusuf Ünlü 105-(1080p25).f140.mp4",
    mimeType: "video/mp4",
    sizeBytes: 261120,
    url: "https://drive.google.com/file/d/1KTJ5mdYgDi90gA0iRzwu0_JT7P5DUJHB/view?usp=drivesdk",
  },
  {
    id: "1iHeraNM6k_N97zBXjKAu2CBZFpR_mPiW",
    title: "217 Analizin Esas Teoremi - Yusuf Ünlü 107-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 487839776,
    url: "https://drive.google.com/file/d/1iHeraNM6k_N97zBXjKAu2CBZFpR_mPiW/view?usp=drivesdk",
  },
  {
    id: "1ptNLcR215nijpScLvQr4a6zovMWLYCrV",
    title: "219 Belirsiz İntegral Hesabı - Yusuf Ünlü 108-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 472675432,
    url: "https://drive.google.com/file/d/1ptNLcR215nijpScLvQr4a6zovMWLYCrV/view?usp=drivesdk",
  },
  {
    id: "1_H-td0h0OaaTKkMYyqR1R8m2EHjqrrIF",
    title: "219 Belirsiz İntegral Hesabı - Yusuf Ünlü 108-(1080p25).f140.mp4",
    mimeType: "video/mp4",
    sizeBytes: 41990268,
    url: "https://drive.google.com/file/d/1_H-td0h0OaaTKkMYyqR1R8m2EHjqrrIF/view?usp=drivesdk",
  },
  {
    id: "1qvJrymXWLW6iwAUMqwa4ZTs5TbY36L9K",
    title: "221 Makinanın Formel Tanımına Doğru - Chris Stephenson 9-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 114538534,
    url: "https://drive.google.com/file/d/1qvJrymXWLW6iwAUMqwa4ZTs5TbY36L9K/view?usp=drivesdk",
  },
  {
    id: "1T2_6wtXJeQF6gzww16GO_1ZzcdZvb-rn",
    title: "221 Makinanın Formel Tanımına Doğru - Chris Stephenson 9-(1080p25).f140.mp4",
    mimeType: "video/mp4",
    sizeBytes: 44029680,
    url: "https://drive.google.com/file/d/1T2_6wtXJeQF6gzww16GO_1ZzcdZvb-rn/view?usp=drivesdk",
  },
  {
    id: "11l17dv_0MkJso2B2p--PpGD0JzVw9K41",
    title: "222 Belirsiz İntegral ve Riemann Lebesgue Lemma - Yusuf Ünlü 109-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 2096128,
    url: "https://drive.google.com/file/d/11l17dv_0MkJso2B2p--PpGD0JzVw9K41/view?usp=drivesdk",
  },
  {
    id: "10D0hjgCpJ7OVhYrf486a1LBsEgFJRbcf",
    title: "223 Farklı Diller Arasında İlişki Bulmak - Chris Stephenson 10-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 70,
    url: "https://drive.google.com/file/d/10D0hjgCpJ7OVhYrf486a1LBsEgFJRbcf/view?usp=drivesdk",
  },
  {
    id: "1WHMPWHr_47qtE8EtYClkQ_tOSPlJOa1L",
    title: "224 Non-determinisitik Sonlu Durum Makinesi (Nondeterministic Finite Automata) - Chris Stephenson 11-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 523264,
    url: "https://drive.google.com/file/d/1WHMPWHr_47qtE8EtYClkQ_tOSPlJOa1L/view?usp=drivesdk",
  },
  {
    id: "1X4ngBBPjni8iheu3b3oI-KZjkmvtK26S",
    title: "225 Sylow Teoremleri - Ali Nesin 93-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 2096128,
    url: "https://drive.google.com/file/d/1X4ngBBPjni8iheu3b3oI-KZjkmvtK26S/view?usp=drivesdk",
  },
  {
    id: "1dfOpIGBFZf1yONqY9VB-N2oQZ4QHBHWB",
    title: "225 Sylow Teoremleri - Ali Nesin 93-(1080p25).f140.mp4",
    mimeType: "video/mp4",
    sizeBytes: 261120,
    url: "https://drive.google.com/file/d/1dfOpIGBFZf1yONqY9VB-N2oQZ4QHBHWB/view?usp=drivesdk",
  },
  {
    id: "1cFgRnHOyr6Yaf7ST5KTwsuJWQU03phIy",
    title: "026 İlk Sınav Çözümü - Ali Nesin 8-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 410588043,
    url: "https://drive.google.com/file/d/1cFgRnHOyr6Yaf7ST5KTwsuJWQU03phIy/view?usp=drivesdk",
  },
  {
    id: "19SHCLrpA7kWwDTEJGBB87klT95n0LVlF",
    title: "028 Özel bir Fonksiyon Arayışında - Ali Nesin 9-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 109571738,
    url: "https://drive.google.com/file/d/19SHCLrpA7kWwDTEJGBB87klT95n0LVlF/view?usp=drivesdk",
  },
  {
    id: "1FYskzMEJke8oGbExs-s4Zz3LJxb6keqH",
    title: "031 Metrik Uzaylar - Yusuf Ünlü 15-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 399885886,
    url: "https://drive.google.com/file/d/1FYskzMEJke8oGbExs-s4Zz3LJxb6keqH/view?usp=drivesdk",
  },
  {
    id: "1KGto_Dk_sbeWLKXbGOpS2o5YJRVMJqwc",
    title: "032 Bir Soru - Ali Nesin 11-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 74115276,
    url: "https://drive.google.com/file/d/1KGto_Dk_sbeWLKXbGOpS2o5YJRVMJqwc/view?usp=drivesdk",
  },
  {
    id: "1iCtTC42zm6AqX0jgwPPLLb3G7s0CluGf",
    title: "165 Aritmetik Geometrik Ortalama - Yusuf Ünlü 82-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 737719563,
    url: "https://drive.google.com/file/d/1iCtTC42zm6AqX0jgwPPLLb3G7s0CluGf/view?usp=drivesdk",
  },
  {
    id: "1vd1gt8cq0vWEMfvMSq9TrI3m1gKE_NS5",
    title: "185 Taban - Yusuf Ünlü 91-(1080p25).mp4.part-Frag603.part",
    mimeType: "video/mp2t",
    sizeBytes: 960598,
    url: "https://drive.google.com/file/d/1vd1gt8cq0vWEMfvMSq9TrI3m1gKE_NS5/view?usp=drivesdk",
  },
  {
    id: "1KGwZ6kbf9HO2_xmHXTk61CiYHVbAmcHn",
    title: "185 Taban - Yusuf Ünlü 91-(1080p25).mp4.part-Frag601.part",
    mimeType: "video/mp2t",
    sizeBytes: 523264,
    url: "https://drive.google.com/file/d/1KGwZ6kbf9HO2_xmHXTk61CiYHVbAmcHn/view?usp=drivesdk",
  },
  {
    id: "1YK_UJo-5awf8KdMhDqVt8P0FbtAgbBla",
    title: "189 Cisim Genişlemesi - Yusuf Ünlü 93-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 1014938019,
    url: "https://drive.google.com/file/d/1YK_UJo-5awf8KdMhDqVt8P0FbtAgbBla/view?usp=drivesdk",
  },
  {
    id: "1zUlNeV2NnRxt5FVc6Vnpt1kXD5rgLadO",
    title: "193 Grup Teorisinin Temel Teoremi - Ali Nesin 83-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 301507081,
    url: "https://drive.google.com/file/d/1zUlNeV2NnRxt5FVc6Vnpt1kXD5rgLadO/view?usp=drivesdk",
  },
  {
    id: "1xZRv1QEHSoDgH4Dh_8IPZk9KGvzyEku3",
    title: "194 Weierstrass Yoğunluk Teoremi - Yusuf Ünlü 96-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 447524986,
    url: "https://drive.google.com/file/d/1xZRv1QEHSoDgH4Dh_8IPZk9KGvzyEku3/view?usp=drivesdk",
  },
  {
    id: "1C0b0ZUn3ehsF4TSlid-Kjrt0HopegkJn",
    title: "196 Normal Altgrup İncelemeleri - Özlem Beyarslan 8-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 585843043,
    url: "https://drive.google.com/file/d/1C0b0ZUn3ehsF4TSlid-Kjrt0HopegkJn/view?usp=drivesdk",
  },
  {
    id: "1XzexhWi3WTD07Li6OhYmk3pD2nN2djfD",
    title: "201 Conjugacy Classes - Ali Nesin 86-(1080p25).mp4",
    mimeType: "video/mp4",
    sizeBytes: 337618701,
    url: "https://drive.google.com/file/d/1XzexhWi3WTD07Li6OhYmk3pD2nN2djfD/view?usp=drivesdk",
  },
  {
    id: "1wkl1bicAq5gSbU-zKQ8YbpW7J9zfNpWk",
    title: "216 Riemann İntegrali 3 - Yusuf Ünlü 106-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 4797166,
    url: "https://drive.google.com/file/d/1wkl1bicAq5gSbU-zKQ8YbpW7J9zfNpWk/view?usp=drivesdk",
  },
  {
    id: "1jtpn_Squ8iVyWq4MfzubhqLKjXrIfUke",
    title: "218 Pergel, Cetvel - Özlem Beyarslan 12-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 191226232,
    url: "https://drive.google.com/file/d/1jtpn_Squ8iVyWq4MfzubhqLKjXrIfUke/view?usp=drivesdk",
  },
  {
    id: "1k6v9Y1hj2jlb8J4B9fdCIDZQPyx34N7S",
    title: "220 Group Etkileri - Ali Nesin 92-(1080p25).f137.mp4",
    mimeType: "video/mp4",
    sizeBytes: 382364746,
    url: "https://drive.google.com/file/d/1k6v9Y1hj2jlb8J4B9fdCIDZQPyx34N7S/view?usp=drivesdk",
  },
];

export const rawDriveArchiveFileCount = rawDriveArchiveFiles.length;
export const parsedDriveArchiveEntries = rawDriveArchiveFiles
  .map((file) => parseDriveArchiveFile(file))
  .filter((entry) => entry !== null);

const groupedArchiveEntries = groupDuplicateLectureFiles(rawDriveArchiveFiles);
const sourceOrderGroupedArchiveEntries = parsedDriveArchiveEntries.reduce<
  Map<number, DriveArchiveLecture[]>
>((groups, entry) => {
  const current = groups.get(entry.sourceOrder) ?? [];
  current.push(entry);
  groups.set(entry.sourceOrder, current);
  return groups;
}, new Map());

export const duplicateDriveArchiveGroups = [...groupedArchiveEntries.values()].filter(
  (group) => group.length > 1
);

export const canonicalDriveArchiveEntries = [...groupedArchiveEntries.values()]
  .map((group) => chooseCanonicalVideo(group))
  .filter((entry) => entry !== null);

export const rejectedDriveArchiveEntries = parsedDriveArchiveEntries.filter(
  (entry) => !entry.isPlayable
);

export const driveArchiveBySourceOrder = new Map(
  canonicalDriveArchiveEntries.map((entry) => [entry.sourceOrder, entry])
);

export type DriveArchiveVariantStatus =
  | "canonical"
  | "duplicate_variant"
  | "rejected_variant";

export type DriveArchiveSlotClassification =
  | "canonical_playable_lecture"
  | "duplicate_variant"
  | "broken_fragment_only"
  | "missing_from_accessible_drive_folder"
  | "intentionally_excluded";

export type DriveArchiveVariantAudit = DriveArchiveLecture & {
  canonicalStatus: DriveArchiveVariantStatus;
};

export type DriveArchiveSourceOrderAudit = {
  sourceOrder: number;
  classification: DriveArchiveSlotClassification;
  canonicalEntry: DriveArchiveLecture | null;
  mappedCourseSlugs: string[];
  variantEntries: DriveArchiveVariantAudit[];
  duplicateVariantCount: number;
  note: string | null;
};

function buildVariantAudits(entries: DriveArchiveLecture[], canonicalEntry: DriveArchiveLecture | null) {
  return entries.map<DriveArchiveVariantAudit>((entry) => {
    if (canonicalEntry && entry.driveFileId === canonicalEntry.driveFileId) {
      return {
        ...entry,
        canonicalStatus: "canonical",
      };
    }

    return {
      ...entry,
      canonicalStatus: entry.isPlayable ? "duplicate_variant" : "rejected_variant",
    };
  });
}

function getBrokenSlotNote(entries: DriveArchiveLecture[]) {
  const reasons = [...new Set(entries.map((entry) => entry.rejectionReason).filter(Boolean))];
  if (reasons.length === 0) {
    return "No playable canonical file could be selected.";
  }

  return `No playable canonical file could be selected: ${reasons.join("; ")}.`;
}

const sourceOrderToMappedCourseSlugs = new Map<number, string[]>([
  [1, ["foundations-of-mathematics"]],
  [2, ["foundations-of-mathematics"]],
  [3, ["foundations-of-mathematics"]],
  [4, ["foundations-of-mathematics"]],
  [5, ["foundations-of-mathematics"]],
  [6, ["foundations-of-mathematics"]],
  [7, ["foundations-of-mathematics"]],
  [8, ["foundations-of-mathematics"]],
  [9, ["foundations-of-mathematics"]],
  [10, ["set-theory-and-ordinals"]],
  [11, ["foundations-of-mathematics"]],
  [12, ["foundations-of-mathematics"]],
  [13, ["real-analysis"]],
  [14, ["real-analysis"]],
  [15, ["real-analysis"]],
  [16, ["real-analysis"]],
  [17, ["discrete-mathematics"]],
  [18, ["discrete-mathematics"]],
  [19, ["discrete-mathematics"]],
  [20, ["discrete-mathematics"]],
  [21, ["discrete-mathematics"]],
  [22, ["discrete-mathematics"]],
  [23, ["real-analysis"]],
  [24, ["real-analysis"]],
  [25, ["discrete-mathematics"]],
  [26, ["supplementary-and-miscellaneous"]],
  [27, ["real-analysis"]],
  [28, ["supplementary-and-miscellaneous"]],
  [29, ["set-theory-and-ordinals"]],
  [31, ["metric-spaces-and-topology"]],
  [32, ["supplementary-and-miscellaneous"]],
  [33, ["metric-spaces-and-topology"]],
  [34, ["metric-spaces-and-topology"]],
  [35, ["metric-spaces-and-topology"]],
  [37, ["set-theory-and-ordinals"]],
  [38, ["set-theory-and-ordinals"]],
  [39, ["metric-spaces-and-topology"]],
  [40, ["metric-spaces-and-topology"]],
  [41, ["set-theory-and-ordinals"]],
  [42, ["metric-spaces-and-topology"]],
  [43, ["metric-spaces-and-topology"]],
  [133, ["set-theory-and-ordinals"]],
  [134, ["set-theory-and-ordinals"]],
  [135, ["set-theory-and-ordinals"]],
  [136, ["set-theory-and-ordinals"]],
  [138, ["set-theory-and-ordinals"]],
  [139, ["set-theory-and-ordinals"]],
  [140, ["set-theory-and-ordinals"]],
  [141, ["abstract-algebra"]],
  [142, ["set-theory-and-ordinals"]],
  [143, ["set-theory-and-ordinals"]],
  [144, ["set-theory-and-ordinals"]],
  [145, ["real-analysis"]],
  [146, ["set-theory-and-ordinals"]],
  [147, ["supplementary-and-miscellaneous"]],
  [148, ["real-analysis"]],
  [149, ["real-analysis"]],
  [150, ["discrete-mathematics"]],
  [151, ["set-theory-and-ordinals"]],
  [152, ["real-analysis"]],
  [153, ["real-analysis"]],
  [154, ["real-analysis"]],
  [155, ["real-analysis"]],
  [156, ["real-analysis"]],
  [157, ["supplementary-and-miscellaneous"]],
  [158, ["supplementary-and-miscellaneous"]],
  [159, ["real-analysis"]],
  [160, ["real-analysis"]],
  [161, ["real-analysis"]],
  [162, ["real-analysis"]],
  [163, ["real-analysis"]],
  [164, ["real-analysis"]],
  [165, ["real-analysis"]],
  [185, ["supplementary-and-miscellaneous"]],
  [189, ["abstract-algebra"]],
  [193, ["abstract-algebra"]],
  [194, ["real-analysis"]],
  [196, ["abstract-algebra"]],
  [197, ["abstract-algebra"]],
  [198, ["abstract-algebra"]],
  [199, ["abstract-algebra"]],
  [200, ["abstract-algebra"]],
  [201, ["abstract-algebra"]],
  [202, ["abstract-algebra"]],
  [203, ["real-analysis"]],
  [204, ["real-analysis"]],
  [205, ["real-analysis"]],
  [206, ["abstract-algebra"]],
  [207, ["real-analysis"]],
  [208, ["set-theory-and-ordinals"]],
  [209, ["real-analysis"]],
  [210, ["abstract-algebra"]],
  [211, ["real-analysis"]],
  [212, ["supplementary-and-miscellaneous"]],
  [213, ["real-analysis"]],
  [214, ["abstract-algebra"]],
  [215, ["real-analysis"]],
  [217, ["real-analysis"]],
  [218, ["supplementary-and-miscellaneous"]],
  [219, ["real-analysis"]],
  [220, ["abstract-algebra"]],
  [221, ["theory-of-computation"]],
  [223, ["theory-of-computation"]],
  [224, ["theory-of-computation"]],
]);

export const driveArchiveSourceOrderAudit: DriveArchiveSourceOrderAudit[] = Array.from(
  { length: 225 },
  (_, index) => {
    const sourceOrder = index + 1;
    const entries = sourceOrderGroupedArchiveEntries.get(sourceOrder) ?? [];
    const canonicalEntry = entries.length > 0 ? chooseCanonicalVideo(entries) : null;
    const variantEntries = buildVariantAudits(entries, canonicalEntry);
    const duplicateVariantCount = variantEntries.filter(
      (entry) => entry.canonicalStatus !== "canonical"
    ).length;
    const mappedCourseSlugs = sourceOrderToMappedCourseSlugs.get(sourceOrder) ?? [];

    if (entries.length === 0) {
      return {
        sourceOrder,
        classification: "missing_from_accessible_drive_folder",
        canonicalEntry: null,
        mappedCourseSlugs,
        variantEntries,
        duplicateVariantCount,
        note: "No accessible file was found in the connected Drive folder listing.",
      };
    }

    if (!canonicalEntry?.isPlayable) {
      return {
        sourceOrder,
        classification: "broken_fragment_only",
        canonicalEntry,
        mappedCourseSlugs,
        variantEntries,
        duplicateVariantCount,
        note: getBrokenSlotNote(entries),
      };
    }

    return {
      sourceOrder,
      classification: "canonical_playable_lecture",
      canonicalEntry,
      mappedCourseSlugs,
      variantEntries,
      duplicateVariantCount,
      note:
        mappedCourseSlugs.length > 0
          ? null
          : "Playable canonical lecture exists in the archive but is not mapped into the curriculum.",
    };
  }
);

export const driveArchiveSourceOrderAuditBySourceOrder = new Map(
  driveArchiveSourceOrderAudit.map((entry) => [entry.sourceOrder, entry])
);

const supplementaryCourseSlug = "supplementary-and-miscellaneous";

export const driveArchiveCoverageSummary = {
  totalSourceOrderSlots: 225,
  accessibleSourceOrderSlots: driveArchiveSourceOrderAudit.filter(
    (entry) => entry.classification !== "missing_from_accessible_drive_folder"
  ).length,
  canonicalPlayableLectures: driveArchiveSourceOrderAudit.filter(
    (entry) => entry.classification === "canonical_playable_lecture"
  ).length,
  duplicateOnlyVariants: driveArchiveSourceOrderAudit.reduce(
    (total, entry) => total + entry.duplicateVariantCount,
    0
  ),
  brokenFragmentOnlySlots: driveArchiveSourceOrderAudit.filter(
    (entry) => entry.classification === "broken_fragment_only"
  ).length,
  trulyMissingUnavailableSlots: driveArchiveSourceOrderAudit.filter(
    (entry) => entry.classification === "missing_from_accessible_drive_folder"
  ).length,
  curriculumMappedSourceOrderSlots: driveArchiveSourceOrderAudit.filter(
    (entry) => entry.mappedCourseSlugs.length > 0
  ).length,
  supplementaryUnclassifiedCanonicalLessons: driveArchiveSourceOrderAudit.filter(
    (entry) =>
      entry.classification === "canonical_playable_lecture" &&
      entry.mappedCourseSlugs.includes(supplementaryCourseSlug)
  ).length,
};
