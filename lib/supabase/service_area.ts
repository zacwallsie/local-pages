import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"

export type ServiceArea = {
	id: string
	service_id: string
	geojson: GeoJSON.GeoJSON
	is_active: boolean
	email: string
	created_at: string
	updated_at: string
}

export type ServiceAreaResult = { serviceArea: ServiceArea | null; error: string | null }
export type ServiceAreasResult = { serviceAreas: ServiceArea[] | null; error: string | null }

export async function getServiceAreasByServiceId(serviceId: string): Promise<ServiceAreasResult> {
	const { data, error } = await supabaseClient.from("service_areas").select("*").eq("service_id", serviceId)

	if (error) {
		return { serviceAreas: null, error: error.message }
	}
	return { serviceAreas: data, error: null }
}

export async function createServiceArea(serviceAreaData: Omit<ServiceArea, "id" | "created_at" | "updated_at">): Promise<ServiceAreaResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("service_areas").insert(serviceAreaData).select().single()

	if (error) {
		return { serviceArea: null, error: error.message }
	}
	return { serviceArea: data, error: null }
}

export async function updateServiceArea(serviceAreaData: Partial<ServiceArea> & { id: string; email: string }): Promise<ServiceAreaResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase
		.from("service_areas")
		.update(serviceAreaData)
		.eq("id", serviceAreaData.id)
		.eq("email", serviceAreaData.email)
		.select()
		.single()

	if (error) {
		return { serviceArea: null, error: error.message }
	}
	return { serviceArea: data, error: null }
}

export async function deleteServiceArea(serviceAreaId: string, userEmail: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("service_areas").delete().eq("id", serviceAreaId).eq("email", userEmail)

	if (error) {
		return { success: false, error: error.message }
	}
	return { success: true, error: null }
}

export async function getServiceAreasByCompanyId(company_id: string) {
	const { data, error } = await supabaseClient.from("service_areas").select("*").eq("company_id", company_id)

	if (error) {
		return { serviceAreas: null, error: error.message }
	}
	return { serviceAreas: data, error: null }
}
