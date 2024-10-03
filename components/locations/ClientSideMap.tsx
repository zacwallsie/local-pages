// components/locations/ClientSideMap.tsx
"use client"

import dynamic from "next/dynamic"
import { Company } from "@/types/supabase"
import { Loading } from "@/components/shared/Loading"

const LocationsMap = dynamic(() => import("./LocationsMap"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-screen bg-aerial-white">
			<Loading />
		</div>
	),
})

interface ClientSideMapProps {
	company: Company
}

export function ClientSideMap({ company }: ClientSideMapProps) {
	return <LocationsMap company={company} />
}
