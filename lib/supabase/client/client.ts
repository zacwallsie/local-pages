// lib/supabase/client.ts

import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/supabase"

/**
 * The URL of your Supabase instance.
 * It should be stored in the environment variable `NEXT_PUBLIC_SUPABASE_URL`.
 *
 * @constant
 * @type {string}
 * @throws Will throw an error if `NEXT_PUBLIC_SUPABASE_URL` is not defined.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

/**
 * The anonymous public key for your Supabase instance.
 * It should be stored in the environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 *
 * @constant
 * @type {string}
 * @throws Will throw an error if `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not defined.
 */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Initializes and exports the Supabase client for browser-side usage.
 * This client is used to interact with your Supabase backend for authentication,
 * database operations, and other services provided by Supabase.
 *
 * @constant
 * @type {ReturnType<typeof createBrowserClient>}
 *
 * @example
 * ```typescript
 * import { supabaseClient } from "@/lib/supabase/client";
 *
 * Fetch user profile
 * const { data, error } = await supabaseClient
 *   .from("profiles")
 *   .select("*")
 *   .eq("id", userId);
 * ```
 */
export const supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
