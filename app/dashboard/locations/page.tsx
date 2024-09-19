// app/locations/page.tsx

import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { LocationsMap } from "@/components/locations/LocationsMap"
import { Company } from "@/types/company"

export const metadata: Metadata = {
	title: `${app.name} - Locations`,
	description: "Manage your company locations",
}

export default async function LocationsPage() {
	const supabase = createClient()

	// Get the authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		// Redirect to sign-in page if not authenticated
		redirect("/sign-in")
	}

	// Fetch the user's company
	const { data: company, error } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (error || !company) {
		// Redirect to CreateCompanyPage if no company is found
		redirect("/create-company")
	}

	return <LocationsMap company={company as Company} />
}
