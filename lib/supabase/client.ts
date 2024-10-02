// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
