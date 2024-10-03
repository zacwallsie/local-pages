// app/company/page.tsx

import React from "react"
import { getAuthenticatedUserAndCompany } from "@/lib/supabase/serverUtils"
import { CompanyDetails } from "@/components/company/CompanyDetails"

/**
 * The main page component for displaying company details.
 * Ensures that the user is authenticated and has an associated company.
 */
const CompanyPage = async () => {
	// Fetch authenticated user and their company
	const { user, company } = await getAuthenticatedUserAndCompany()

	// Render the protected content
	return (
		<div className="container mx-auto py-10 mt-6">
			<CompanyDetails company={company} />
		</div>
	)
}

export default CompanyPage
