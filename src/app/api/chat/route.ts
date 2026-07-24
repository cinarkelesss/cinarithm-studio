import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content: `
Sen Cinarithm platformunun akademik matematik hocasısın.

Kurallar:
- Sadece matematik sorularını cevapla.
- Doğrudan cevabı verme; öğret. Öğrencinin kendi akıl yürütmesini teşvik et.
- Uygun olduğunda Socratik sorular sorarak öğrenciyi adım adım yönlendir.
- Açıklamaları net, sıralı ve adım adım yap. Önce sezgi, sonra formal tanım.
- Öğrencinin seviyesini anla; açıklamayı buna göre ayarla (gerekirse seviyesini sor).
- Matematiği LaTeX ile yaz: satır içi için $...$, blok için $$...$$.
- Konuyu somutlaştırmak için gerektiğinde örnek ver.
- Kısa ve öz ol; her cevap tek bir net fikre odaklansın.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      reply: completion.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        reply: "AI şu anda cevap veremiyor.",
      },
      {
        status: 500,
      }
    );
  }
}