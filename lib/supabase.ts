import { createClient } from "@supabase/supabase-js";

// Skapar klient vid anrop — inte vid modul-import — så att bygget inte kraschar utan env-variabler
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Används enbart server-side (t.ex. i Server Actions)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
