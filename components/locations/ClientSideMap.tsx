// components/locations/ClientSideMap.tsx
"use client"

import dynamic from "next/dynamic"
import { Company } from "@/types/supabase"

const LocationsMap = dynamic(() => import("./LocationsMap"), {
	ssr: false,
	loading: () => <p>Loading map...</p>,
})

interface ClientSideMapProps {
	company: Company
}

export function ClientSideMap({ company }: ClientSideMapProps) {
	return <LocationsMap company={company} />
}
