// lib/supabase/service.ts

import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"
import { Service } from "@/types/supabase"

/**
 * Represents the result of a single Service-related operation.
 *
 * @typedef {Object} ServiceResult
 * @property {Service | null} service - The Service data if the operation was successful.
 * @property {string | null} error - The error message if the operation failed.
 */
export type ServiceResult = { service: Service | null; error: string | null }

/**
 * Represents the result of multiple Service-related operations.
 *
 * @typedef {Object} ServicesResult
 * @property {Service[] | null} services - An array of Service data if the operation was successful.
 * @property {string | null} error - The error message if the operation failed.
 */
export type ServicesResult = { services: Service[] | null; error: string | null }

/**
 * Creates a new service record in the database.
 *
 * @async
 * @function createService
 * @param {Omit<Service, "id" | "created_at" | "updated_at">} serviceData - The data for the new service excluding `id`, `created_at`, and `updated_at` fields.
 * @returns {Promise<ServiceResult>} An object containing the created Service or an error message.
 *
 * @example
 * ```typescript
 * const newService = {
 *   company_id: "company-123",
 *   name: "Premium Cleaning",
 *   description: "Top-notch cleaning services for residential and commercial spaces.",
 *   category: "Cleaning",
 *   email: "contact@cleaningservices.com",
 *   // ...other fields
 * };
 * const result = await createService(newService);
 * if (result.service) {
 *   console.log("Service created with ID:", result.service.id);
 * } else {
 *   console.error("Error creating service:", result.error);
 * }
 * ```
 */
export async function createService(serviceData: Omit<Service, "id" | "created_at" | "updated_at">): Promise<ServiceResult> {
	const supabase = createServerSupabaseClient()

	const { data, error } = await supabase.from("services").insert(serviceData).select().single()

	if (error) {
		return { service: null, error: error.message }
	}

	return { service: data, error: null }
}

/**
 * Updates an existing service record in the database.
 *
 * @async
 * @function updateService
 * @param {Partial<Service> & { id: string; email: string }} serviceData - An object containing the fields to update along with the `id` of the service and the `email` of the user performing the update for authorization.
 * @returns {Promise<ServiceResult>} An object containing the updated Service or an error message.
 *
 * @example
 * ```typescript
 * const updatedService = {
 *   id: "service-456",
 *   email: "admin@cleaningservices.com",
 *   is_active: false,
 *   // ...other fields to update
 * };
 * const result = await updateService(updatedService);
 * if (result.service) {
 *   console.log("Service updated:", result.service);
 * } else {
 *   console.error("Error updating service:", result.error);
 * }
 * ```
 */
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

/**
 * Deletes a service record from the database.
 *
 * @async
 * @function deleteService
 * @param {string} serviceId - The ID of the service to delete.
 * @param {string} userEmail - The email of the user performing the deletion for authorization.
 * @returns {Promise<{ success: boolean; error: string | null }>} An object indicating whether the deletion was successful or containing an error message.
 *
 * @example
 * ```typescript
 * const result = await deleteService("service-456", "admin@cleaningservices.com");
 * if (result.success) {
 *   console.log("Service deleted successfully.");
 * } else {
 *   console.error("Error deleting service:", result.error);
 * }
 * ```
 */
export async function deleteService(serviceId: string, userEmail: string): Promise<{ success: boolean; error: string | null }> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.from("services").delete().eq("id", serviceId).eq("email", userEmail)

	if (error) {
		return { success: false, error: error.message }
	}

	return { success: true, error: null }
}

/**
 * Retrieves a service by its ID.
 *
 * @async
 * @function getServiceById
 * @param {string} serviceId - The ID of the service to fetch.
 * @returns {Promise<ServiceResult>} An object containing the Service data if found or an error message.
 *
 * @example
 * ```typescript
 * const result = await getServiceById("service-456");
 * if (result.service) {
 *   console.log("Service Name:", result.service.name);
 * } else {
 *   console.error("Error fetching service:", result.error);
 * }
 * ```
 */
export async function getServiceById(serviceId: string): Promise<ServiceResult> {
	const { data, error } = await supabaseClient.from("services").select("*").eq("id", serviceId).single()

	if (error) {
		return { service: null, error: error.message }
	}

	return { service: data, error: null }
}

/**
 * Retrieves all services associated with a specific company ID.
 *
 * @async
 * @function getServicesByCompanyId
 * @param {string} companyId - The ID of the company to fetch associated services.
 * @returns {Promise<ServicesResult>} An object containing an array of Services or an error message.
 *
 * @example
 * ```typescript
 * const result = await getServicesByCompanyId("company-789");
 * if (result.services) {
 *   console.log("Services:", result.services);
 * } else {
 *   console.error("Error fetching services:", result.error);
 * }
 * ```
 */
export async function getServicesByCompanyId(companyId: string): Promise<ServicesResult> {
	const { data, error } = await supabaseClient.from("services").select("*").eq("company_id", companyId)

	if (error) {
		return { services: null, error: error.message }
	}

	return { services: data, error: null }
}
