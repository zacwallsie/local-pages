"use server"

import { createServerSupabaseClient } from "@/lib/supabase/client/serverClient"
import { createServiceArea, updateServiceArea, deleteServiceArea, getServiceAreasByCompanyId } from "@/lib/supabase/client/service_area"
import { ServiceArea } from "@/types/supabase"

type ActionResult<T> = { success: true; message: string; data?: T } | { success: false; error: string }

/**
 * Handles the creation of a new service area.
 *
 * @param {FormData} formData - The FormData object containing user inputs.
 * @returns {Promise<ActionResult<ServiceArea>>} The result of the create service area operation.
 */
export async function createServiceAreaAction(formData: FormData): Promise<ActionResult<ServiceArea>> {
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

	// Extract and sanitize form data
	const serviceId = formData.get("service_id")?.toString()
	const companyId = formData.get("company_id")?.toString()
	const geojsonString = formData.get("geojson")?.toString()
	const isActive = formData.get("is_active") === "true"

	// Validate required fields
	if (!serviceId || !geojsonString || !companyId) {
		return { success: false, error: "Missing required fields" }
	}

	// Parse GeoJSON data
	let geojson: GeoJSON.GeoJSON
	try {
		geojson = JSON.parse(geojsonString)
	} catch (error) {
		return { success: false, error: "Invalid GeoJSON format" }
	}

	// Prepare service area data payload
	const serviceAreaData = {
		service_id: serviceId,
		company_id: companyId,
		geojson,
		is_active: isActive,
		email: user.email!,
	}

	// Create the service area in the database
	const result = await createServiceArea(serviceAreaData)

	// Handle potential errors during service area creation
	if (result.error) {
		return { success: false, error: "Error creating service area: " + result.error }
	}

	// Return success response with created service area data
	return { success: true, message: "Service area created successfully", data: result.serviceArea! }
}

/**
 * Handles updating an existing service area.
 *
 * @param {FormData} formData - The FormData object containing user inputs.
 * @returns {Promise<ActionResult<ServiceArea>>} The result of the update service area operation.
 */
export async function updateServiceAreaAction(formData: FormData): Promise<ActionResult<ServiceArea>> {
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

	// Extract and sanitize form data
	const serviceAreaId = formData.get("id")?.toString()
	const companyId = formData.get("company_id")?.toString()
	const geojsonString = formData.get("geojson")?.toString()
	const isActive = formData.get("is_active") === "true"

	// Validate required fields
	if (!serviceAreaId || !geojsonString) {
		return { success: false, error: "Missing required fields" }
	}

	// Parse GeoJSON data
	let geojson: GeoJSON.GeoJSON
	try {
		geojson = JSON.parse(geojsonString)
	} catch (error) {
		return { success: false, error: "Invalid GeoJSON format" }
	}

	// Prepare update payload with existing service area ID
	const serviceAreaData = {
		id: serviceAreaId,
		geojson,
		is_active: isActive,
		email: user.email!,
	}

	// Update the service area in the database
	const result = await updateServiceArea(serviceAreaData)

	// Handle potential errors during service area update
	if (result.error) {
		return { success: false, error: "Error updating service area: " + result.error }
	}

	// Return success response with updated service area data
	return { success: true, message: "Service area updated successfully", data: result.serviceArea! }
}

/**
 * Handles deleting an existing service area.
 *
 * @param {string} serviceAreaId - The ID of the service area to delete.
 * @returns {Promise<ActionResult<null>>} The result of the delete service area operation.
 */
export async function deleteServiceAreaAction(serviceAreaId: string): Promise<ActionResult<null>> {
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

	// Attempt to delete the service area
	const result = await deleteServiceArea(serviceAreaId, user.email!)

	// Handle potential errors during service area deletion
	if (!result.success) {
		return { success: false, error: "Error deleting service area: " + result.error }
	}

	// Return success response indicating successful deletion
	return { success: true, message: "Service area deleted successfully" }
}

/**
 * Retrieves all service areas associated with a specific company.
 *
 * @param {string} companyId - The ID of the company whose service areas are to be fetched.
 * @returns {Promise<ActionResult<ServiceArea[]>>} The result of the get service areas operation.
 */
export async function getServiceAreasAction(companyId: string) {
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

	// Fetch the service areas associated with the company ID
	const result = await getServiceAreasByCompanyId(companyId)

	// Handle potential errors during service areas retrieval
	if (result.error) {
		return { success: false, error: "Error fetching service areas: " + result.error }
	}

	// Return success response with fetched service areas data
	return { success: true, message: "Service areas fetched successfully", data: result.serviceAreas! }
}
