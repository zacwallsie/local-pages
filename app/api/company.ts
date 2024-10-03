"use server"

import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { createCompany, updateCompany, getCompanyByUserEmail, deleteCompany } from "@/lib/supabase/company"
import { Company } from "@/types/supabase"

type ActionResult<T> = { success: true; message: string; data?: T } | { success: false; error: string }

export async function createCompanyAction(formData: FormData): Promise<ActionResult<Company>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Check if the user already has a company
	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (existingCompany.company) {
		return { success: false, error: "User already has a company" }
	}

	const companyName = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	const companyData: Omit<Company, "id" | "created_at" | "updated_at"> = {
		user_id: user.id,
		company_name: companyName,
		description: description,
		email: user.email!,
		website_url: websiteUrl,
		phone_number: phoneNumber,
		address: address,
	}

	if (logoString) {
		try {
			const parsedLogoString = JSON.parse(logoString)
			if (typeof parsedLogoString === "string" && parsedLogoString.startsWith("data:image/")) {
				companyData.logo = parsedLogoString
			} else {
				return { success: false, error: "Invalid logo data format" }
			}
		} catch (error) {
			return { success: false, error: "Error processing logo data: " + (error as Error).message }
		}
	}

	const result = await createCompany(companyData)

	if (result.error) {
		return { success: false, error: "Error creating company: " + result.error }
	}

	return { success: true, message: "Company created successfully", data: result.company! }
}

export async function updateCompanyAction(formData: FormData): Promise<ActionResult<Company>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (!existingCompany.company) {
		return { success: false, error: "Company not found" }
	}

	const company_name = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	const updatePayload: Partial<Company> & { id: string } = {
		id: existingCompany.company.id,
		company_name,
		description,
		website_url: websiteUrl,
		phone_number: phoneNumber,
		address: address,
	}

	if (logoString) {
		try {
			const parsedLogoString = JSON.parse(logoString)
			if (typeof parsedLogoString === "string" && parsedLogoString.startsWith("data:image/")) {
				updatePayload.logo = parsedLogoString
			} else {
				return { success: false, error: "Invalid logo data format" }
			}
		} catch (error) {
			return { success: false, error: "Error processing logo data: " + (error as Error).message }
		}
	}

	const result = await updateCompany(updatePayload)

	if (result.error) {
		return { success: false, error: "Error updating company: " + result.error }
	}

	return { success: true, message: "Company updated successfully", data: result.company! }
}

export async function getCompanyAction(): Promise<ActionResult<Company>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const result = await getCompanyByUserEmail(user.email!)

	if (result.error) {
		return { success: false, error: "Error fetching company: " + result.error }
	}

	if (!result.company) {
		return { success: false, error: "Company not found" }
	}

	return { success: true, message: "Company fetched successfully", data: result.company }
}

export async function deleteCompanyAction(): Promise<ActionResult<null>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (!existingCompany.company) {
		return { success: false, error: "Company not found" }
	}

	const result = await deleteCompany(existingCompany.company.id)

	if (!result.success) {
		return { success: false, error: "Error deleting company: " + result.error }
	}

	return { success: true, message: "Company deleted successfully" }
}
