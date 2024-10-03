// components/locations/ClientSideMap.tsx

"use client"

import dynamic from "next/dynamic"
import { Company } from "@/types/supabase"
import { Loading } from "@/components/shared/Loading"

/**
 * Dynamically imports the LocationsMap component with server-side rendering disabled.
 * Displays a loading spinner while the LocationsMap component is being loaded.
 */
const LocationsMap = dynamic(() => import("./LocationsMap"), {
	ssr: false, // Disable server-side rendering for this component
	loading: () => (
		<div className="w-full h-screen bg-aerial-white flex items-center justify-center">
			<Loading />
		</div>
	),
})

/**
 * Props for the ClientSideMap component.
 *
 * @interface ClientSideMapProps
 * @property {Company} company - The company data to be displayed on the map.
 */
interface ClientSideMapProps {
	company: Company
}

/**
 * ClientSideMap Component
 *
 * Renders a client-side map displaying the company's locations.
 * Utilizes dynamic import to load the LocationsMap component without SSR.
 *
 * @param {ClientSideMapProps} props - The properties passed to the component.
 * @param {Company} props.company - The company data to be displayed on the map.
 * @returns {JSX.Element} The rendered LocationsMap component.
 */
export function ClientSideMap({ company }: ClientSideMapProps): JSX.Element {
	return <LocationsMap company={company} />
}
