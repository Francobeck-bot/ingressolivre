import { createBrowserClient } from "@supabase/ssr";

// We use untyped client and cast results at call sites via our own types
// to avoid conflicts with Supabase's generated-type expectations.
export function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
