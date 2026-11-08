import { acikKumelerVeDenkTopolojilerLessonContent } from "@/data/learning/content/acik-kumeler-ve-denk-topolojiler";
import { cizgelerTeorisineGirisLessonContent } from "@/data/learning/content/cizgeler-teorisine-giris";
import { duzgunSureklilikLessonContent } from "@/data/learning/content/duzgun-sureklilik";
import { gercelSayilardaNinciKokLessonContent } from "@/data/learning/content/gercel-sayilarda-ninci-kok";
import { gercelSayilarRasyonelSayilariIcerirLessonContent } from "@/data/learning/content/gercel-sayilar-rasyonel-sayilari-icerir";
import { limitGirisiVeYogunlasmaNoktasiLessonContent } from "@/data/learning/content/limit-girisi-ve-yogunlasma-noktasi";
import { limitVeYogunlasmaNoktasiOzellikleriLessonContent } from "@/data/learning/content/limit-ve-yogunlasma-noktasi-ozellikleri";
import { logaritmaLimitVeLHospitalLessonContent } from "@/data/learning/content/logaritma-limit-ve-lhospital";
import { normalAltgrupIncelemeleriLessonContent } from "@/data/learning/content/normal-altgrup-incelemeleri";
import { arsimetOzelligiVeYogunlukLessonContent } from "@/data/learning/content/arsimet-ozelligi-ve-yogunluk";
import { tamlikOzelligiLessonContent } from "@/data/learning/content/tamlik-ozelligi";
import { ustSinirTeoremiVeTekrarLessonContent } from "@/data/learning/content/ust-sinir-teoremi-ve-tekrar";
import { ustelFonksiyonlarVeLimitleriLessonContent } from "@/data/learning/content/ustel-fonksiyonlar-ve-limitleri";
import { duzgunSureklilikIkiLessonContent } from "@/data/learning/content/duzgun-sureklilik-iki";
import { validateLessonRichContentEntries } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

const lessonContentEntries: LessonRichContent[] = [
  tamlikOzelligiLessonContent,
  duzgunSureklilikLessonContent,
  acikKumelerVeDenkTopolojilerLessonContent,
  normalAltgrupIncelemeleriLessonContent,
  cizgelerTeorisineGirisLessonContent,
  gercelSayilarRasyonelSayilariIcerirLessonContent,
  ustSinirTeoremiVeTekrarLessonContent,
  arsimetOzelligiVeYogunlukLessonContent,
  gercelSayilardaNinciKokLessonContent,
  limitGirisiVeYogunlasmaNoktasiLessonContent,
  limitVeYogunlasmaNoktasiOzellikleriLessonContent,
  ustelFonksiyonlarVeLimitleriLessonContent,
  duzgunSureklilikIkiLessonContent,
  logaritmaLimitVeLHospitalLessonContent,
];

const lessonContentByLessonId = new Map(
  lessonContentEntries.map((entry) => [entry.lessonId, entry])
);

const lessonContentBySlug = new Map(
  lessonContentEntries.map((entry) => [`${entry.courseSlug}/${entry.lessonSlug}`, entry])
);

const validationReport = validateLessonRichContentEntries(lessonContentEntries);

if (validationReport.issues.length > 0) {
  validationReport.issues.forEach((issue) => {
    console.warn(`[learning-content:${issue.severity}] ${issue.lessonId} - ${issue.message}`);
  });
}

if (validationReport.conceptDuplicateCandidates.length > 0) {
  const duplicateGroups = validationReport.conceptDuplicateCandidates.map((group) =>
    group.map((concept) => concept.name).join(" / ")
  );
  console.warn(
    `[learning-content:warning] Olası concept duplicate adayları: ${duplicateGroups.join("; ")}`
  );
}

export function getAllLessonRichContentEntries() {
  return lessonContentEntries;
}

export function getBaseLessonRichContentByLessonId(lessonId: string) {
  return lessonContentByLessonId.get(lessonId) ?? null;
}

export function getBaseLessonRichContentBySlug(courseSlug: string, lessonSlug: string) {
  return lessonContentBySlug.get(`${courseSlug}/${lessonSlug}`) ?? null;
}

export function getLessonContentValidationReport() {
  return validationReport;
}

export function getPublishedLessonRichContent(courseSlug: string, lessonSlug: string) {
  const entry = getBaseLessonRichContentBySlug(courseSlug, lessonSlug);
  return entry?.status === "published" ? entry : null;
}
