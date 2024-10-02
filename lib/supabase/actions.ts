// lib/supabase/actions.ts
"use server"

import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Company } from "@/types/supabase"

export type ActionResult = { success: true; message: string } | { error: string }

// Authentication Actions
export const signUpAction = async (formData: FormData): Promise<ActionResult> => {
	const email = formData.get("email")?.toString()
	const password = formData.get("password")?.toString()
	const supabase = createServerSupabaseClient()
	const origin = headers().get("origin")

	if (!email || !password) {
		return { error: "Email and password are required" }
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		console.error(`${error.code} ${error.message}`)
		return { error: error.message }
	} else {
		return { success: true, message: "Thanks for signing up! Please check your email for a verification link." }
	}
}

export const signInAction = async (formData: FormData): Promise<ActionResult> => {
	const email = formData.get("email")?.toString()
	const password = formData.get("password")?.toString()
	const supabase = createServerSupabaseClient()

	if (!email || !password) {
		return { error: "Email and password are required" }
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return { error: error.message }
	}

	return { success: true, message: "Signed in successfully" }
}

export const forgotPasswordAction = async (formData: FormData): Promise<ActionResult> => {
	const email = formData.get("email")?.toString()
	const supabase = createServerSupabaseClient()
	const origin = headers().get("origin")

	if (!email) {
		return { error: "Email is required" }
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/company/reset-password`,
	})

	if (error) {
		return { error: "Could not reset password: " + error.message }
	}

	return { success: true, message: "Check your email for a link to reset your password." }
}

export const resetPasswordAction = async (formData: FormData): Promise<ActionResult> => {
	const supabase = createServerSupabaseClient()

	const password = formData.get("password")?.toString()
	const confirmPassword = formData.get("confirmPassword")?.toString()

	if (!password || !confirmPassword) {
		return { error: "Password and confirm password are required" }
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match" }
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	})

	if (error) {
		return { error: "Password update failed: " + error.message }
	}

	return { success: true, message: "Password updated successfully" }
}

export const signOutAction = async () => {
	const supabase = createServerSupabaseClient()
	await supabase.auth.signOut()
	return redirect("/sign-in")
}

// Company Actions
export const createCompanyAction = async (formData: FormData): Promise<ActionResult> => {
	const supabase = createServerSupabaseClient()

	// Get the authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { error: "User not authenticated" }
	}

	// Check if the user already has a company
	const { data: existingCompany, error: companyError } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (existingCompany) {
		return { error: "User already has a company" }
	}

	// Extract all fields from the formData
	const companyName = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	// Prepare the company data
	const companyData: Partial<Company> = {
		user_id: user.id,
		company_name: companyName,
		description: description,
		email: user.email,
	}

	// Add optional fields if they exist
	if (websiteUrl) companyData.website_url = websiteUrl
	if (phoneNumber) companyData.phone_number = phoneNumber
	if (address) companyData.address = address

	// Handle logo data
	if (logoString) {
		try {
			// Parse the stringified data URL
			const parsedLogoString = JSON.parse(logoString)

			// Validate the parsed data (ensure it's a data URL)
			if (typeof parsedLogoString === "string" && parsedLogoString.startsWith("data:image/")) {
				companyData.logo = parsedLogoString
			} else {
				return { error: "Invalid logo data format" }
			}
		} catch (error) {
			return { error: "Error processing logo data: " + (error as Error).message }
		}
	}

	// Insert the new company into the database
	const { error } = await supabase.from("companies").insert(companyData).select().single()

	if (error) {
		return { error: "Error creating company: " + error.message }
	}

	// Success
	return { success: true, message: "Company created successfully" }
}

export const updateCompanyAction = async (formData: FormData): Promise<ActionResult> => {
	const supabase = createServerSupabaseClient()

	// Get the authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { error: "User not authenticated" }
	}

	// Fetch the user's existing company
	const { data: existingCompany, error: companyError } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (companyError || !existingCompany) {
		return { error: "Company not found" }
	}

	// Extract all fields from the formData
	const company_name = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	// Prepare the company data
	const updatePayload: Partial<Company> = {
		company_name,
		description,
		website_url: websiteUrl || null,
		phone_number: phoneNumber || null,
		address: address || null,
	}

	// Handle logo data
	if (logoString) {
		try {
			// Parse the stringified data URL
			const parsedLogoString = JSON.parse(logoString)

			// Validate the parsed data (ensure it's a data URL)
			if (typeof parsedLogoString === "string" && parsedLogoString.startsWith("data:image/")) {
				updatePayload.logo = parsedLogoString
			} else {
				return { error: "Invalid logo data format" }
			}
		} catch (error) {
			return { error: "Error processing logo data: " + (error as Error).message }
		}
	}

	const { error } = await supabase.from("companies").update(updatePayload).eq("id", existingCompany.id)

	if (error) {
		return { error: "Error updating company: " + error.message + " " + JSON.stringify(updatePayload) }
	}

	// Success
	return { success: true, message: "Company updated successfully." }
}
