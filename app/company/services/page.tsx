import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { getAuthenticatedUserAndCompany } from "@/lib/supabase/client/serverUtils"
import { ServicesDataTable } from "@/components/services/ServicesDataTable"

export const metadata: Metadata = {
	title: `${app.name} - Services`,
	description: "Manage your company services",
}

const ServicesPage = async () => {
	// Fetch authenticated user and their company
	const { user, company } = await getAuthenticatedUserAndCompany()

	if (!user.email) {
		return null
	}

	return (
		<div className="container mx-auto py-10 mt-6">
			<ServicesDataTable companyId={company.id} userEmail={user.email} />
		</div>
	)
}

export default ServicesPage
