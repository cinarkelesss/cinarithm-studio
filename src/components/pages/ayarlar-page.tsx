"use client";

import { useState } from "react";

import { RefreshCcw } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import { textInputClassName } from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export function AyarlarPageView() {
  const { data, resetAllData, updateProfile } = useAppState();
  const [form, setForm] = useState({
    displayName: data.profile.displayName,
    slogan: data.profile.slogan,
    focusArea: data.profile.focusArea,
    dailyGoalHours: String(data.profile.dailyGoalHours),
  });

  const supabaseReady = hasSupabaseEnv();

  return (
    <SectionShell
      title="Ayarlar"
      description="Kişisel görünümü, günlük hedefi ve veri kipini buradan yönet. Şimdilik uygulama tamamen Türkçe ve yerel depolama ile çalışıyor."
      eyebrow="Kontrol paneli"
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Profil</h2>

            <FormField label="Görünen ad">
              <input
                className={textInputClassName()}
                value={form.displayName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    displayName: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Slogan">
              <input
                className={textInputClassName()}
                value={form.slogan}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slogan: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Odak alanı">
              <input
                className={textInputClassName()}
                value={form.focusArea}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    focusArea: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Günlük hedef saat">
              <input
                type="number"
                min="1"
                max="12"
                className={textInputClassName()}
                value={form.dailyGoalHours}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dailyGoalHours: event.target.value,
                  }))
                }
              />
            </FormField>

            <Button
              className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() =>
                updateProfile({
                  displayName: form.displayName.trim() || "Çınar",
                  slogan: form.slogan.trim() || "Matematikte derinleşmek için.",
                  focusArea: form.focusArea.trim() || "Hazırlık yılı temelleri",
                  dailyGoalHours: Number(form.dailyGoalHours) || 3,
                })
              }
            >
              Değişiklikleri kaydet
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <h2 className="font-heading text-xl text-white">Veri kipi</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/10 text-white/72">
                  {data.settings.storageMode}
                </Badge>
                <Badge
                  className={
                    supabaseReady
                      ? "bg-zinc-300/16 text-zinc-200"
                      : "bg-white/10 text-white/55"
                  }
                >
                  {supabaseReady ? "Supabase hazır" : "Supabase anahtarı bekliyor"}
                </Badge>
              </div>
              <p className="text-sm leading-7 text-white/52">
                Şu an uygulama yerel depolama ile tamamen kullanılabilir. Ortam
                değişkenleri eklendiğinde Supabase eşitlemesi için altyapı hazır.
              </p>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <h2 className="font-heading text-xl text-white">Sıfırla</h2>
              <p className="text-sm leading-7 text-white/52">
                Demo veriye dönmek istersen tüm yerel kayıtları varsayılan duruma
                çekebilirsin.
              </p>
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                onClick={() => {
                  if (
                    window.confirm(
                      "Tüm yerel verileri sıfırlamak istediğine emin misin?"
                    )
                  ) {
                    resetAllData();
                  }
                }}
              >
                <RefreshCcw className="size-4" />
                Demo veriye dön
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
