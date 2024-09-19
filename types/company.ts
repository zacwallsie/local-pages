export interface Company {
	id: number
	user_id: string
	company_name: string
	description: string
	email: string
	website_url?: string | null
	phone_number?: string | null
	logo?: string | null
	// Add any other fields as per your database schema
}
