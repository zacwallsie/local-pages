// lib/supabase/service_area.ts

import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"
import { ServiceArea } from "@/types/supabase"

/**
 * Represents the result of a single ServiceArea-related operation.
 *
 * @typedef {Object} ServiceAreaResult
 * @property {ServiceArea | null} serviceArea - The ServiceArea data if the operation was successful.
 * @property {string | null} error - The error message if the operation failed.
 */
export type ServiceAreaResult = { serviceArea: ServiceArea | null; error: string | null }

/**
 * Represents the result of multiple ServiceArea-related operations.
 *
 * @typedef {Object} ServiceAreasResult
 * @property {ServiceArea[] | null} serviceAreas - An array of ServiceArea data if the operation was successful.
 * @property {string | null} error - The error message if the operation failed.
 */
export type ServiceAreasResult = { serviceAreas: ServiceArea[] | null; error: string | null }

/**
 * Retrieves all service areas associated with a specific service ID.
 *
 * @async
 * @function getServiceAreasByServiceId
 * @param {string} serviceId - The ID of the service to fetch associated service areas.
 * @returns {Promise<ServiceAreasResult>} An object containing an array of ServiceAreas or an error message.
 *
 * @example
 * ```typescript
 * const result = await getServiceAreasByServiceId("service-123");
 * if (result.serviceAreas) {
 *   console.log("Service Areas:", result.serviceAreas);
 * } else {
 *   console.error("Error fetching service areas:", result.error);
 * }
 * ```
 */
export async function getServiceAreasByServiceId(serviceId: string): Promise<ServiceAreasResult> {
	const { data, error } = await supabaseClient.from("service_areas").select("*").eq("service_id", serviceId)

	if (error) {
		return { serviceAreas: null, error: error.message }
	}
	return { serviceAreas: data, error: null }
}

/**
 * Creates a new service area in the database.
 *
 * @async
 * @function createServiceArea
 * @param {Omit<ServiceArea, "id" | "created_at" | "updated_at">} serviceAreaData - The data for the new service area excluding auto-generated fields.
 * @returns {Promise<ServiceAreaResult>} An object containing the created ServiceArea or an error message.
 *
 * @example
 * ```typescript
 * const newServiceArea = {
 *   service_id: "service-123",
 *   geojson: { /* GeoJSON data *\/ },
 *   is_active: true,
 *   email: "user@example.com",
 *   ...other fields
 * };
 * const result = await createServiceArea(newServiceArea);
 * if (result.serviceArea) {
 *   console.log("Service Area created with ID:", result.serviceArea.id);
 * } else {
 *   console.error("Error creating service area:", result.error);
 * }
 * ```
 */
export async function createServiceArea(serviceAreaData: Omit<ServiceArea, "id" | "created_at" | "updated_at">): Promise<ServiceAreaResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("service_areas").insert(serviceAreaData).select().single()

	if (error) {
		return { serviceArea: null, error: error.message }
	}
	return { serviceArea: data, error: null }
}

/**
 * Updates an existing service area in the database.
 *
 * @async
 * @function updateServiceArea
 * @param {Partial<ServiceArea> & { id: string; email: string }} serviceAreaData - The data to update, including the `id` of the service area and the `email` of the user performing the update for authorization.
 * @returns {Promise<ServiceAreaResult>} An object containing the updated ServiceArea or an error message.
 *
 * @example
 * ```typescript
 * const updatedServiceArea = {
 *   id: "service-area-456",
 *   email: "user@example.com",
 *   is_active: false,
 *   ...other fields to update
 * };
 * const result = await updateServiceArea(updatedServiceArea);
 * if (result.serviceArea) {
 *   console.log("Service Area updated:", result.serviceArea);
 * } else {
 *   console.error("Error updating service area:", result.error);
 * }
 * ```
 */
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

/**
 * Deletes a service area from the database.
 *
 * @async
 * @function deleteServiceArea
 * @param {string} serviceAreaId - The ID of the service area to delete.
 * @param {string} userEmail - The email of the user performing the deletion for authorization.
 * @returns {Promise<{ success: boolean; error: string | null }>} An object indicating whether the deletion was successful or containing an error message.
 *
 * @example
 * ```typescript
 * const result = await deleteServiceArea("service-area-456", "user@example.com");
 * if (result.success) {
 *   console.log("Service Area deleted successfully.");
 * } else {
 *   console.error("Error deleting service area:", result.error);
 * }
 * ```
 */
export async function deleteServiceArea(serviceAreaId: string, userEmail: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("service_areas").delete().eq("id", serviceAreaId).eq("email", userEmail)

	if (error) {
		return { success: false, error: error.message }
	}
	return { success: true, error: null }
}

/**
 * Retrieves all service areas associated with a specific company ID.
 *
 * @async
 * @function getServiceAreasByCompanyId
 * @param {string} companyId - The ID of the company to fetch associated service areas.
 * @returns {Promise<ServiceAreasResult>} An object containing an array of ServiceAreas or an error message.
 *
 * @example
 * ```typescript
 * const result = await getServiceAreasByCompanyId("company-789");
 * if (result.serviceAreas) {
 *   console.log("Service Areas:", result.serviceAreas);
 * } else {
 *   console.error("Error fetching service areas:", result.error);
 * }
 * ```
 */
export async function getServiceAreasByCompanyId(companyId: string): Promise<ServiceAreasResult> {
	const { data, error } = await supabaseClient.from("service_areas").select("*").eq("company_id", companyId)

	if (error) {
		return { serviceAreas: null, error: error.message }
	}
	return { serviceAreas: data, error: null }
}
