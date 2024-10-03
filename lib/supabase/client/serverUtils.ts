// lib/supabase/serverUtils.ts

import { createServerSupabaseClient } from "@/lib/supabase/client/serverClient"
import { redirect } from "next/navigation"
import { Company } from "@/types/supabase"
import { User } from "@supabase/supabase-js"

/**
 * Represents the result of fetching the authenticated user and their associated company.
 *
 * @typedef {Object} AuthenticatedUserCompanyResult
 * @property {User} user - The authenticated user's data.
 * @property {Company} company - The company associated with the authenticated user.
 */
export interface AuthenticatedUserCompanyResult {
	user: User
	company: Company
}

/**
 * Fetches the authenticated user and their associated company.
 * Redirects to the sign-in page if the user is not authenticated.
 * Redirects to the company creation page if the user does not have an associated company.
 *
 * @async
 * @function getAuthenticatedUserAndCompany
 * @returns {Promise<AuthenticatedUserCompanyResult>} An object containing the authenticated user and their company data.
 *
 * @throws Will redirect the user to "/sign-in" if not authenticated.
 * @throws Will redirect the user to "/company/create" if no company is associated with the authenticated user.
 *
 * @example
 * ```typescript
 * export default async function Page() {
 *   const { user, company } = await getAuthenticatedUserAndCompany();
 *   return (
 *     <div>
 *       <h1>Welcome, {user.email}</h1>
 *       <p>Company: {company.name}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export async function getAuthenticatedUserAndCompany(): Promise<AuthenticatedUserCompanyResult> {
	const supabase = createServerSupabaseClient()

	// Fetch the authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		// Redirect to sign-in page if there's an authentication error or no user is found
		redirect("/sign-in")
	}

	// Fetch the user's associated company
	const { data: company, error: companyError } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (companyError || !company) {
		// Redirect to company creation page if there's an error fetching the company or no company is found
		redirect("/company/create")
	}

	return { user: user as User, company: company as Company }
}
