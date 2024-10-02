// lib/supabase/serverUtils.ts

import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import { Company } from "@/types/supabase"

/**
 * Fetches the authenticated user and their associated company.
 * Redirects to sign-in or company creation pages if necessary.
 *
 * @returns An object containing the user and company data.
 */
export async function getAuthenticatedUserAndCompany(): Promise<{ user: any; company: Company }> {
	const supabase = createServerSupabaseClient()

	// Fetch the authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		redirect("/sign-in")
	}

	// Fetch the user's company
	const { data: company, error } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (error || !company) {
		redirect("/company/create")
	}

	return { user, company: company as Company }
}
