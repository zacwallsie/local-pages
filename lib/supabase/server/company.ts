"use server"

import { createServerSupabaseClient } from "@/lib/supabase/client/serverClient"
import { createCompany, updateCompany, getCompanyByUserEmail, deleteCompany } from "@/lib/supabase/client/company"
import { Company } from "@/types/supabase"

/**
 * Represents the result of an action, indicating success or failure.
 *
 * @template T - The type of data returned on success.
 */
type ActionResult<T> = { success: true; message: string; data?: T } | { success: false; error: string }

/**
 * Handles the creation of a new company.
 *
 * @param {FormData} formData - The FormData object containing user inputs.
 * @returns {Promise<ActionResult<Company>>} The result of the create company operation.
 */
export async function createCompanyAction(formData: FormData): Promise<ActionResult<Company>> {
	// Initialize Supabase client
	const supabase = createServerSupabaseClient()

	// Retrieve authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	// Check for authentication errors or missing user
	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Check if the user already has a company
	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (existingCompany.company) {
		return { success: false, error: "User already has a company" }
	}

	// Extract and sanitize form data
	const companyName = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	// Prepare company data payload
	const companyData: Omit<Company, "id" | "created_at" | "updated_at"> = {
		user_id: user.id,
		company_name: companyName,
		description: description,
		email: user.email!,
		website_url: websiteUrl,
		phone_number: phoneNumber,
		address: address,
	}

	// Validate and parse logo data if provided
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

	// Create the company in the database
	const result = await createCompany(companyData)

	// Handle potential errors during company creation
	if (result.error) {
		return { success: false, error: "Error creating company: " + result.error }
	}

	// Return success response with created company data
	return { success: true, message: "Company created successfully", data: result.company! }
}

/**
 * Handles updating an existing company.
 *
 * @param {FormData} formData - The FormData object containing user inputs.
 * @returns {Promise<ActionResult<Company>>} The result of the update company operation.
 */
export async function updateCompanyAction(formData: FormData): Promise<ActionResult<Company>> {
	// Initialize Supabase client
	const supabase = createServerSupabaseClient()

	// Retrieve authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	// Check for authentication errors or missing user
	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Fetch the existing company associated with the user
	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (!existingCompany.company) {
		return { success: false, error: "Company not found" }
	}

	// Extract and sanitize form data
	const companyName = formData.get("company_name")?.toString() || ""
	const description = formData.get("description")?.toString() || ""
	const websiteUrl = formData.get("website_url")?.toString() || null
	const phoneNumber = formData.get("phone_number")?.toString() || null
	const address = formData.get("address")?.toString() || null
	const logoString = formData.get("logo")?.toString() || null

	// Prepare update payload with existing company ID
	const updatePayload: Partial<Company> & { id: string } = {
		id: existingCompany.company.id,
		company_name: companyName,
		description: description,
		website_url: websiteUrl,
		phone_number: phoneNumber,
		address: address,
	}

	// Validate and parse logo data if provided
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

	// Update the company in the database
	const result = await updateCompany(updatePayload)

	// Handle potential errors during company update
	if (result.error) {
		return { success: false, error: "Error updating company: " + result.error }
	}

	// Return success response with updated company data
	return { success: true, message: "Company updated successfully", data: result.company! }
}

/**
 * Retrieves the authenticated user's company information.
 *
 * @returns {Promise<ActionResult<Company>>} The result of the get company operation.
 */
export async function getCompanyAction(): Promise<ActionResult<Company>> {
	// Initialize Supabase client
	const supabase = createServerSupabaseClient()

	// Retrieve authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	// Check for authentication errors or missing user
	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Fetch the company associated with the user's email
	const result = await getCompanyByUserEmail(user.email!)

	// Handle potential errors during company retrieval
	if (result.error) {
		return { success: false, error: "Error fetching company: " + result.error }
	}

	// Check if the company exists
	if (!result.company) {
		return { success: false, error: "Company not found" }
	}

	// Return success response with fetched company data
	return { success: true, message: "Company fetched successfully", data: result.company }
}

/**
 * Deletes the authenticated user's company.
 *
 * @returns {Promise<ActionResult<null>>} The result of the delete company operation.
 */
export async function deleteCompanyAction(): Promise<ActionResult<null>> {
	// Initialize Supabase client
	const supabase = createServerSupabaseClient()

	// Retrieve authenticated user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	// Check for authentication errors or missing user
	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Fetch the existing company associated with the user's email
	const existingCompany = await getCompanyByUserEmail(user.email!)
	if (!existingCompany.company) {
		return { success: false, error: "Company not found" }
	}

	// Attempt to delete the company
	const result = await deleteCompany(existingCompany.company.id)

	// Handle potential errors during company deletion
	if (!result.success) {
		return { success: false, error: "Error deleting company: " + result.error }
	}

	// Return success response indicating successful deletion
	return { success: true, message: "Company deleted successfully" }
}
