// app/locations/page.tsx

import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { redirect } from "next/navigation"
import { ClientSideMap } from "@/components/locations/ClientSideMap"
import { Company } from "@/types/supabase"
import { getServerUser } from "@/lib/supabase/auth"
import { getCompanyByUserId } from "@/lib/supabase/company"

export const metadata: Metadata = {
	title: `${app.name} - Services`,
	description: "Manage your company services",
}

const ServicesPage = async () => {
	// Fetch the authenticated user
	const { user, error: authError } = await getServerUser()

	if (authError || !user) {
		// Redirect to sign-in page if not authenticated
		redirect("/sign-in")
	}

	// Fetch the user's company using a helper function
	const { company, error: companyError } = await getCompanyByUserId(user.id)

	if (companyError || !company) {
		// Redirect to CreateCompanyPage if no company is found
		redirect("/create-company")
	}

	return <div></div>
}

export default ServicesPage
