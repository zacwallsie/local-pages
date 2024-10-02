// lib/supabase/company.ts
import { supabaseClient } from "./client"
import { Company } from "@/types/supabase"

export const getCompanyByUserId = async (userId: string): Promise<{ company: Company | null; error: any }> => {
	const { data, error } = await supabaseClient.from("companies").select("*").eq("user_id", userId).single()

	return { company: data, error }
}

export const createCompany = async (companyData: Partial<Company>): Promise<{ company: Company | null; error: any }> => {
	const { data, error } = await supabaseClient.from("companies").insert(companyData).single()

	return { company: data, error }
}
