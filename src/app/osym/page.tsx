import { supabase } from "@/lib/supabase";
import OsymClient from "./OsymClient";
import AppShell from "@/components/layout/AppShell";

export default async function OsymPage() {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("*")
    .order("year", { ascending: false });

  if (error) {
    return (
      <AppShell>
        <p className="text-red-500">Hata: {error.message}</p>
      </AppShell>
    );
  }

  return <OsymClient questions={questions} />;
}