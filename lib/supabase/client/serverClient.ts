// lib/supabase/serverClient.ts

import { createServerClient } from "@supabase/ssr"
import { Database } from "@/types/supabase"
import { cookies } from "next/headers"

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
 * Initializes and exports the Supabase client for server-side usage.
 * This client is used to interact with your Supabase backend for authentication,
 * database operations, and other services provided by Supabase.
 *
 * @function createServerSupabaseClient
 * @returns {ReturnType<typeof createServerClient>} The initialized Supabase client.
 *
 * @example
 * ```typescript
 * import { createServerSupabaseClient } from "@/lib/supabase/serverClient";
 *
 * export async function handler(req: NextApiRequest, res: NextApiResponse) {
 *   const supabase = createServerSupabaseClient();
 *   const { data, error } = await supabase.from("users").select("*");
 *   if (error) {
 *     return res.status(500).json({ error: error.message });
 *   }
 *   return res.status(200).json({ data });
 * }
 * ```
 */
export const createServerSupabaseClient = () => {
	const cookieStore = cookies()

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			/**
			 * Retrieves all cookies from the incoming request.
			 *
			 * @function getAll
			 * @returns {Array<{ name: string; value: string; options?: any }>} An array of cookie objects.
			 */
			getAll: () => cookieStore.getAll(),

			/**
			 * Sets multiple cookies on the outgoing response.
			 *
			 * @function setAll
			 * @param {Array<{ name: string; value: string; options?: any }>} cookiesToSet - An array of cookies to set.
			 */
			setAll: (cookiesToSet) => {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options)
					})
				} catch (error) {
					// Handle error if necessary
					console.error("Error setting cookies:", error)
				}
			},
		},
	})
}
