import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { ClientSideMap } from "@/components/locations/ClientSideMap"
import { getAuthenticatedUserAndCompany } from "@/lib/supabase/serverUtils"

export const metadata: Metadata = {
	title: `${app.name} - Locations`,
	description: "Manage your company locations",
}

const LocationsPage = async () => {
	// Fetch authenticated user and their company
	const { user, company } = await getAuthenticatedUserAndCompany()

	// Render the protected content
	return <ClientSideMap company={company} />
}

export default LocationsPage
