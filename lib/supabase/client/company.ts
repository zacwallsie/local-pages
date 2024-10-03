// lib/supabase/company.ts

import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"
import { Company } from "@/types/supabase"

/**
 * Represents the result of a company-related operation.
 * It can either contain a `Company` object or an error message.
 *
 * @typedef {Object} CompanyResult
 * @property {Company | null} company - The company data if the operation was successful.
 * @property {string | null} error - The error message if the operation failed.
 */
export type CompanyResult = { company: Company | null; error: string | null }

/**
 * Retrieves a company associated with a specific user ID.
 *
 * @async
 * @function getCompanyByUserId
 * @param {string} userId - The ID of the user whose company is to be fetched.
 * @returns {Promise<CompanyResult>} An object containing the `Company` data if found, or an error message.
 *
 * @example
 * ```typescript
 * const result = await getCompanyByUserId("user-123");
 * if (result.company) {
 *   console.log("Company Name:", result.company.name);
 * } else {
 *   console.error("Error fetching company:", result.error);
 * }
 * ```
 */
export async function getCompanyByUserId(userId: string): Promise<CompanyResult> {
	const { data, error } = await supabaseClient.from("companies").select("*").eq("user_id", userId).single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

/**
 * Creates a new company record in the database.
 *
 * @async
 * @function createCompany
 * @param {Omit<Company, "id" | "created_at" | "updated_at">} companyData - The data for the new company excluding `id`, `created_at`, and `updated_at` fields.
 * @returns {Promise<CompanyResult>} An object containing the newly created `Company` data or an error message.
 *
 * @example
 * ```typescript
 * const newCompany = {
 *   name: "Tech Innovators",
 *   user_id: "user-123",
 *   email: "contact@techinnovators.com",
 *   // ...other fields
 * };
 * const result = await createCompany(newCompany);
 * if (result.company) {
 *   console.log("Company created with ID:", result.company.id);
 * } else {
 *   console.error("Error creating company:", result.error);
 * }
 * ```
 */
export async function createCompany(companyData: Omit<Company, "id" | "created_at" | "updated_at">): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").insert(companyData).select().single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

/**
 * Updates an existing company record in the database.
 *
 * @async
 * @function updateCompany
 * @param {Partial<Company> & { id: string }} companyData - An object containing the fields to update along with the `id` of the company.
 * @returns {Promise<CompanyResult>} An object containing the updated `Company` data or an error message.
 *
 * @example
 * ```typescript
 * const updatedData = {
 *   id: "company-456",
 *   name: "Tech Pioneers",
 * };
 * const result = await updateCompany(updatedData);
 * if (result.company) {
 *   console.log("Company updated:", result.company.name);
 * } else {
 *   console.error("Error updating company:", result.error);
 * }
 * ```
 */
export async function updateCompany(companyData: Partial<Company> & { id: string }): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").update(companyData).eq("id", companyData.id).select().single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

/**
 * Retrieves a company associated with a specific user email.
 *
 * @async
 * @function getCompanyByUserEmail
 * @param {string} userEmail - The email of the user whose company is to be fetched.
 * @returns {Promise<CompanyResult>} An object containing the `Company` data if found, or an error message.
 *
 * @example
 * ```typescript
 * const result = await getCompanyByUserEmail("user@example.com");
 * if (result.company) {
 *   console.log("Company Name:", result.company.name);
 * } else {
 *   console.error("Error fetching company:", result.error);
 * }
 * ```
 */
export async function getCompanyByUserEmail(userEmail: string): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").select("*").eq("email", userEmail).single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

/**
 * Deletes a company record from the database.
 *
 * @async
 * @function deleteCompany
 * @param {string} companyId - The ID of the company to be deleted.
 * @returns {Promise<{ success: boolean; error: string | null }>} An object indicating whether the deletion was successful or containing an error message.
 *
 * @example
 * ```typescript
 * const result = await deleteCompany("company-456");
 * if (result.success) {
 *   console.log("Company deleted successfully.");
 * } else {
 *   console.error("Error deleting company:", result.error);
 * }
 * ```
 */
export async function deleteCompany(companyId: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("companies").delete().eq("id", companyId)

	if (error) {
		return { success: false, error: error.message }
	}
	return { success: true, error: null }
}
