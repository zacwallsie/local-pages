"use server"

import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { createService, updateService, deleteService, getServicesByCompanyId, Service } from "@/lib/supabase/service"
import { ServiceCategory, ServiceCategoryInternalName } from "@/types/supabase"

/**
 * ActionResult: A type representing the result of an action.
 * It can either be a success (with an optional data payload) or a failure (with an error message).
 */
type ActionResult<T> = { success: true; message: string; data?: T } | { success: false; error: string }

/**
 * createServiceAction: Creates a new service based on form data.
 *
 * @param formData - The form data containing service details
 * @returns A promise that resolves to an ActionResult
 */
export async function createServiceAction(formData: FormData): Promise<ActionResult<Service>> {
	const supabase = createServerSupabaseClient()

	// Authenticate the user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Extract form data
	const companyId = formData.get("company_id")?.toString()
	const name = formData.get("name")?.toString()
	const description = formData.get("description")?.toString()
	const categoryRaw = formData.get("category")?.toString()

	// Validate required fields
	if (!companyId || !name || !description || !categoryRaw) {
		return { success: false, error: "Missing required fields" }
	}

	// Validate that the category is a valid ServiceCategory internal name
	if (!Object.values(ServiceCategory).some((cat) => cat.internalName === categoryRaw)) {
		return { success: false, error: "Invalid service category" }
	}

	const category = categoryRaw as ServiceCategoryInternalName

	// Prepare service data
	const serviceData = {
		company_id: companyId,
		name,
		description,
		category,
		email: user.email!,
	}

	// Create the service
	const result = await createService(serviceData)

	if (result.error || !result.service) {
		return { success: false, error: result.error || "Failed to create service" }
	}

	return { success: true, message: "Service created successfully", data: result.service }
}

/**
 * updateServiceAction: Updates an existing service based on form data.
 *
 * @param formData - The form data containing updated service details
 * @returns A promise that resolves to an ActionResult
 */
export async function updateServiceAction(formData: FormData): Promise<ActionResult<Service>> {
	const supabase = createServerSupabaseClient()

	// Authenticate the user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Extract form data
	const serviceId = formData.get("id")?.toString()
	const name = formData.get("name")?.toString()
	const description = formData.get("description")?.toString()
	const categoryRaw = formData.get("category")?.toString()

	// Validate required fields
	if (!serviceId || !name || !description || !categoryRaw) {
		return { success: false, error: "Missing required fields" }
	}

	// Validate that the category is a valid ServiceCategory internal name
	if (!Object.values(ServiceCategory).some((cat) => cat.internalName === categoryRaw)) {
		return { success: false, error: "Invalid service category" }
	}

	const category = categoryRaw as ServiceCategoryInternalName

	// Prepare service data
	const serviceData = {
		id: serviceId,
		name,
		description,
		category,
		email: user.email!,
	}

	// Update the service
	const result = await updateService(serviceData)

	if (result.error || !result.service) {
		return { success: false, error: result.error || "Failed to update service" }
	}

	return { success: true, message: "Service updated successfully", data: result.service }
}

/**
 * deleteServiceAction: Deletes a service by its ID.
 *
 * @param serviceId - The ID of the service to delete
 * @returns A promise that resolves to an ActionResult
 */
export async function deleteServiceAction(serviceId: string): Promise<ActionResult<null>> {
	const supabase = createServerSupabaseClient()

	// Authenticate the user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Delete the service
	const result = await deleteService(serviceId, user.email!)

	if (!result.success) {
		return { success: false, error: result.error || "Failed to delete service" }
	}

	return { success: true, message: "Service deleted successfully" }
}

/**
 * getServicesAction: Retrieves all services for a given company ID.
 *
 * @param companyId - The ID of the company to fetch services for
 * @returns A promise that resolves to an ActionResult containing an array of Services
 */
export async function getServicesAction(companyId: string): Promise<ActionResult<Service[]>> {
	const supabase = createServerSupabaseClient()

	// Authenticate the user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (authError || !user) {
		return { success: false, error: "User not authenticated" }
	}

	// Fetch services for the company
	const result = await getServicesByCompanyId(companyId)

	if (result.error || !result.services) {
		return { success: false, error: result.error || "Failed to fetch services" }
	}

	return { success: true, message: "Services fetched successfully", data: result.services }
}
