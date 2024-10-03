// types/supabase.ts

import { GeoJSON } from "geojson"
import { Home, Briefcase, Heart, Car, Scissors, PawPrint, GraduationCap, Laptop, PartyPopper, SprayCan, Truck, Dumbbell } from "lucide-react"

export interface Company {
	id: string
	user_id: string
	company_name: string
	description?: string
	email: string
	website_url?: string | null
	phone_number?: string | null
	logo?: string | null
	address?: string | null
}

export interface User {
	id: string
	email: string
}

export interface Service {
	id: string
	company_id: string
	name: string
	description: string
	category: string
	email: string
}

export interface ServiceArea {
	id: string
	geojson: GeoJSON
	is_active: boolean
	service_id: string
	company_id: string
	email: string
}

export interface Database {
	public: {
		Tables: {
			companies: {
				Row: Company
				Insert: Partial<Company>
				Update: Partial<Company>
			}
			services: {
				Row: Service
				Insert: Partial<Service>
				Update: Partial<Service>
			}
			service_areas: {
				Row: ServiceArea
				Insert: Partial<ServiceArea>
				Update: Partial<ServiceArea>
			}
			users: {
				Row: User
				Insert: Partial<User>
				Update: Partial<User>
			}
		}
	}
}

/**
 * ServiceCategory: An object that defines all available service categories.
 * Each category has a displayName (for UI), an internalName (for database and validation), and a displayIcon (Lucide icon component).
 */
export const ServiceCategory = {
	HOME_SERVICES: { displayName: "Home Services", internalName: "HOME_SERVICES", displayIcon: Home },
	PROFESSIONAL_SERVICES: { displayName: "Professional Services", internalName: "PROFESSIONAL_SERVICES", displayIcon: Briefcase },
	HEALTH_AND_WELLNESS: { displayName: "Health and Wellness", internalName: "HEALTH_AND_WELLNESS", displayIcon: Heart },
	AUTOMOTIVE: { displayName: "Automotive", internalName: "AUTOMOTIVE", displayIcon: Car },
	BEAUTY_AND_PERSONAL_CARE: { displayName: "Beauty and Personal Care", internalName: "BEAUTY_AND_PERSONAL_CARE", displayIcon: Scissors },
	PET_SERVICES: { displayName: "Pet Services", internalName: "PET_SERVICES", displayIcon: PawPrint },
	EDUCATION_AND_TUTORING: { displayName: "Education and Tutoring", internalName: "EDUCATION_AND_TUTORING", displayIcon: GraduationCap },
	TECHNOLOGY_SERVICES: { displayName: "Technology Services", internalName: "TECHNOLOGY_SERVICES", displayIcon: Laptop },
	EVENT_SERVICES: { displayName: "Event Services", internalName: "EVENT_SERVICES", displayIcon: PartyPopper },
	CLEANING_SERVICES: { displayName: "Cleaning Services", internalName: "CLEANING_SERVICES", displayIcon: SprayCan },
	MOVING_AND_STORAGE: { displayName: "Moving and Storage", internalName: "MOVING_AND_STORAGE", displayIcon: Truck },
	FITNESS_AND_RECREATION: { displayName: "Fitness and Recreation", internalName: "FITNESS_AND_RECREATION", displayIcon: Dumbbell },
} as const

// Type for the keys of ServiceCategory
type ServiceCategoryKey = keyof typeof ServiceCategory

// Type for the internal names of ServiceCategory
export type ServiceCategoryInternalName = (typeof ServiceCategory)[ServiceCategoryKey]["internalName"]
