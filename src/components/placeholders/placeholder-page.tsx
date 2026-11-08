import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <Card className="surface-glow overflow-hidden border-border bg-card backdrop-blur-2xl">
        <CardContent className="relative px-5 py-8 sm:px-6 md:px-8 md:py-10">

          <Badge className="bg-white/10 text-white/72">Yakında</Badge>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
            {description}
          </p>
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-white/80">
            <Sparkles className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-2xl text-white">
            Bu bölüm hazır bekliyor
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/52">
            Cinarithm Alpha sürümünde öncelik Ana Sayfa deneyimi. Bu ekran,
            sonraki adımda gerçek veri akışı ve etkileşimlerle doldurulacak.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
