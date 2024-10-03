import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"

export type Service = {
	id: string
	company_id: string
	name: string
	description: string
	category: string
	email: string
	created_at: string
	updated_at: string
}

export type ServiceResult = { service: Service | null; error: string | null }

export async function createService(serviceData: Omit<Service, "id" | "created_at" | "updated_at">): Promise<ServiceResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("services").insert(serviceData).select().single()

	if (error) {
		return { service: null, error: error.message }
	}

	return { service: data, error: null }
}

export async function updateService(serviceData: Partial<Service> & { id: string; email: string }): Promise<ServiceResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase
		.from("services")
		.update(serviceData)
		.eq("id", serviceData.id)
		.eq("email", serviceData.email)
		.select()
		.single()

	if (error) {
		return { service: null, error: error.message }
	}

	return { service: data, error: null }
}

export async function deleteService(serviceId: string, userEmail: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("services").delete().eq("id", serviceId).eq("email", userEmail)

	if (error) {
		return { success: false, error: error.message }
	}

	return { success: true, error: null }
}

export async function getServiceById(serviceId: string): Promise<ServiceResult> {
	const { data, error } = await supabaseClient.from("services").select("*").eq("id", serviceId).single()

	if (error) {
		return { service: null, error: error.message }
	}

	return { service: data, error: null }
}

export async function getServicesByCompanyId(companyId: string): Promise<{ services: Service[] | null; error: string | null }> {
	const { data, error } = await supabaseClient.from("services").select("*").eq("company_id", companyId)

	if (error) {
		return { services: null, error: error.message }
	}

	return { services: data, error: null }
}
