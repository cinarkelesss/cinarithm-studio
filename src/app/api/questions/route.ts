import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      exam,
      year,
      topic,
      difficulty,
      image_url,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("questions")
      .insert([
        {
          exam,
          year,
          topic,
          difficulty,
          image_url,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}