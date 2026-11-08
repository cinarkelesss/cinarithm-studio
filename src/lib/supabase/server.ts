import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseConfig } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          const writableCookieStore = cookieStore as typeof cookieStore & {
            set: (
              name: string,
              value: string,
              options: Record<string, unknown>
            ) => void;
          };

          cookiesToSet.forEach(({ name, value, options }) => {
            writableCookieStore.set(name, value, options);
          });
        } catch {
          // Server component render sırasında cookie yazımı desteklenmeyebilir.
        }
      },
    },
  });
}
