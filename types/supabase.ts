// types/supabase.ts

import { GeoJSON } from "geojson"

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
	id: number
	name: string
}

export interface ServiceArea {
	id: number
	geojson: GeoJSON
	is_active: boolean
	service_id: number
	service_name: string
}

// Define the Database interface representing your entire schema
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
