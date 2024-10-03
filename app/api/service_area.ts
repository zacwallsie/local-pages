"use server"

import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { createServiceArea, updateServiceArea, deleteServiceArea, getServiceAreasByCompanyId, ServiceArea } from "@/lib/supabase/service_area"

type ActionResult<T> = { success: true; message: string; data?: T } | { success: false; error: string }

export async function createServiceAreaAction(formData: FormData): Promise<ActionResult<ServiceArea>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const serviceId = formData.get("service_id")?.toString()
	const companyId = formData.get("company_id")?.toString()
	const geojsonString = formData.get("geojson")?.toString()
	const isActive = formData.get("is_active") === "true"

	if (!serviceId || !geojsonString) {
		return { success: false, error: "Missing required fields" }
	}

	let geojson: GeoJSON.GeoJSON
	try {
		geojson = JSON.parse(geojsonString)
	} catch (error) {
		return { success: false, error: "Invalid GeoJSON format" }
	}

	const serviceAreaData = {
		service_id: serviceId,
		company_id: companyId,
		geojson,
		is_active: isActive,
		email: user.email!,
	}

	const result = await createServiceArea(serviceAreaData)

	if (result.error) {
		return { success: false, error: "Error creating service area: " + result.error }
	}

	return { success: true, message: "Service area created successfully", data: result.serviceArea! }
}

export async function updateServiceAreaAction(formData: FormData): Promise<ActionResult<ServiceArea>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const serviceAreaId = formData.get("id")?.toString()
	const companyId = formData.get("company_id")?.toString()
	const geojsonString = formData.get("geojson")?.toString()
	const isActive = formData.get("is_active") === "true"

	if (!serviceAreaId || !geojsonString) {
		return { success: false, error: "Missing required fields" }
	}

	let geojson: GeoJSON.GeoJSON
	try {
		geojson = JSON.parse(geojsonString)
	} catch (error) {
		return { success: false, error: "Invalid GeoJSON format" }
	}

	const serviceAreaData = {
		id: serviceAreaId,
		geojson,
		is_active: isActive,
		email: user.email!,
	}

	const result = await updateServiceArea(serviceAreaData)

	if (result.error) {
		return { success: false, error: "Error updating service area: " + result.error }
	}

	return { success: true, message: "Service area updated successfully", data: result.serviceArea! }
}

export async function deleteServiceAreaAction(serviceAreaId: string): Promise<ActionResult<null>> {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const result = await deleteServiceArea(serviceAreaId, user.email!)

	if (!result.success) {
		return { success: false, error: "Error deleting service area: " + result.error }
	}

	return { success: true, message: "Service area deleted successfully" }
}

export async function getServiceAreasAction(companyId: string) {
	const supabase = createServerSupabaseClient()

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	const result = await getServiceAreasByCompanyId(companyId)

	if (result.error) {
		return { success: false, error: "Error fetching service areas: " + result.error }
	}

	return { success: true, message: "Service areas fetched successfully", data: result.serviceAreas! }
}
