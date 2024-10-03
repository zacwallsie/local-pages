import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"
import { Company } from "@/types/supabase"

export type CompanyResult = { company: Company | null; error: string | null }

export async function getCompanyByUserId(userId: string): Promise<CompanyResult> {
	const { data, error } = await supabaseClient.from("companies").select("*").eq("user_id", userId).single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

export async function createCompany(companyData: Omit<Company, "id" | "created_at" | "updated_at">): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").insert(companyData).select().single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

export async function updateCompany(companyData: Partial<Company> & { id: string }): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").update(companyData).eq("id", companyData.id).select().single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

export async function getCompanyByUserEmail(userEmail: string): Promise<CompanyResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("companies").select("*").eq("email", userEmail).single()

	if (error) {
		return { company: null, error: error.message }
	}
	return { company: data, error: null }
}

export async function deleteCompany(companyId: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("companies").delete().eq("id", companyId)

	if (error) {
		return { success: false, error: error.message }
	}
	return { success: true, error: null }
}
