// app/components/locations/LocationsMap.tsx

"use client"

import React, { useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Company } from "@/types/company"
import L from "leaflet"
import { GeoJSON } from "geojson"

interface LocationsMapProps {
	company: Company
}

export function LocationsMap({ company }: LocationsMapProps) {
	const [mode, setMode] = useState<"addLocation" | "drawServiceArea" | null>(null)
	const [address, setAddress] = useState("")
	const [locationName, setLocationName] = useState("")
	const [officeLocation, setOfficeLocation] = useState<GeoJSON.Point | null>(null)
	const [serviceArea, setServiceArea] = useState<GeoJSON.Polygon | null>(null)
	const [position, setPosition] = useState<[number, number] | null>(null)
	const [loading, setLoading] = useState(false)
	const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "noResults" | "found">("idle")
	const mapRef = useRef<L.Map>(null)
	const featureGroupRef = useRef<L.FeatureGroup>(null)
	const supabase = createClient()

	const handleModeChange = (newMode: "addLocation" | "drawServiceArea") => {
		setMode(newMode)
		// Clear existing data when changing modes
		if (newMode === "addLocation") {
			// Clear any drawn layers
			if (featureGroupRef.current) {
				const layers = featureGroupRef.current.getLayers()
				layers.forEach((layer) => {
					featureGroupRef.current.removeLayer(layer)
				})
			}
			setServiceArea(null)
		} else if (newMode === "drawServiceArea") {
			// Clear marker and position
			setOfficeLocation(null)
			setPosition(null)
			setAddress("")
			setLocationName("")
		}
	}

	const handleSearch = async () => {
		if (!address) {
			alert("Please enter an address.")
			return
		}
		setSearchStatus("loading")
		// Use Nominatim API to search for the address
		try {
			const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
			const results = await response.json()

			if (results && results.length > 0) {
				const lat = parseFloat(results[0].lat)
				const lon = parseFloat(results[0].lon)
				setPosition([lat, lon])
				const geojsonPoint: GeoJSON.Point = {
					type: "Point",
					coordinates: [lon, lat], // GeoJSON uses [lon, lat]
				}
				setOfficeLocation(geojsonPoint)
				setSearchStatus("found")
				// Zoom to location
				if (mapRef.current) {
					mapRef.current.setView([lat, lon], 15)
				}
			} else {
				setSearchStatus("noResults")
			}
		} catch (error) {
			console.error(error)
			setSearchStatus("noResults")
		}
	}

	const handleSaveLocation = async () => {
		if (!officeLocation || !locationName) {
			alert("Please search for an address and enter a location name.")
			return
		}
		setLoading(true)
		const { error } = await supabase.from("locations").insert({
			company_id: company.id,
			name: locationName,
			geojson: officeLocation, // GeoJSON Point
		})
		setLoading(false)

		if (error) {
			console.error(error)
			alert("Error saving office location.")
		} else {
			alert("Office location saved successfully!")
			setAddress("")
			setLocationName("")
			setOfficeLocation(null)
			setPosition(null)
			setMode(null)
			setSearchStatus("idle")
		}
	}

	const handleDiscardLocation = () => {
		setOfficeLocation(null)
		setPosition(null)
		setAddress("")
		setLocationName("")
		setMode(null)
		setSearchStatus("idle")
	}

	const handleSaveServiceArea = async () => {
		if (!serviceArea) {
			alert("Please draw a service area.")
			return
		}
		setLoading(true)
		const { error } = await supabase.from("locations").insert({
			company_id: company.id,
			type: "service_area",
			service_area: serviceArea, // GeoJSON Polygon
		})
		setLoading(false)

		if (error) {
			console.error(error)
			alert("Error saving service area.")
		} else {
			alert("Service area saved successfully!")
			// Clear drawn layers
			if (featureGroupRef.current) {
				const layers = featureGroupRef.current.getLayers()
				layers.forEach((layer) => {
					featureGroupRef.current.removeLayer(layer)
				})
			}
			setServiceArea(null)
			setMode(null)
		}
	}

	const handleDiscardServiceArea = () => {
		// Clear drawn layers
		if (featureGroupRef.current) {
			const layers = featureGroupRef.current.getLayers()
			layers.forEach((layer) => {
				featureGroupRef.current.removeLayer(layer)
			})
		}
		setServiceArea(null)
		setMode(null)
	}

	const onCreated = (e) => {
		const layer = e.layer
		const geojson = layer.toGeoJSON()
		setServiceArea(geojson.geometry as GeoJSON.Polygon)
	}

	const onDeleted = () => {
		setServiceArea(null)
	}

	return (
		<div className="w-full h-screen flex flex-col">
			{/* Top bar with controls */}
			<div className="bg-white p-4 shadow-md flex items-center">
				<div className="flex space-x-2">
					<Button onClick={() => handleModeChange("addLocation")}>Add Office Location</Button>
					<Button onClick={() => handleModeChange("drawServiceArea")}>Draw Service Area</Button>
				</div>
			</div>

			{/* Main content area */}
			<div className="flex flex-grow w-full z-0">
				{/* Map container */}
				<div className={`relative h-full transition-all duration-300 ${mode ? "w-2/3" : "w-full"}`}>
					<MapContainer
						center={position || [51.505, -0.09]}
						zoom={13}
						style={{ height: "100%", width: "100%" }}
						whenCreated={(mapInstance) => {
							mapRef.current = mapInstance
						}}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						/>
						{officeLocation && <Marker position={[officeLocation.coordinates[1], officeLocation.coordinates[0]]}></Marker>}
						<FeatureGroup ref={featureGroupRef}>
							{mode === "drawServiceArea" && (
								<EditControl
									position="topright"
									onCreated={onCreated}
									onDeleted={onDeleted}
									draw={{
										rectangle: false,
										circle: false,
										circlemarker: false,
										marker: false,
										polyline: false,
										polygon: true,
									}}
									edit={{
										remove: true,
									}}
								/>
							)}
						</FeatureGroup>
					</MapContainer>
				</div>

				{/* Side panel for additional inputs */}
				<div className={`h-full bg-white p-4 shadow-md transition-all duration-300 ${mode ? "w-1/3" : "w-0 overflow-hidden hidden"}`}>
					{mode === "addLocation" && (
						<div>
							<h2 className="text-xl font-semibold mb-4">Add Office Location</h2>
							<Input
								type="text"
								placeholder="Location name"
								value={locationName}
								onChange={(e) => setLocationName(e.target.value)}
								className="mb-4"
							/>
							<Input
								type="text"
								placeholder="Search address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								className="mb-4"
							/>
							<Button onClick={handleSearch} className="mb-4 w-full">
								Search
							</Button>
							{searchStatus === "loading" && <p className="mb-2">Loading...</p>}
							{searchStatus === "noResults" && <p className="mb-2 text-red-500">No results found</p>}
							{searchStatus === "found" && <p className="mb-2 text-green-500">Location found</p>}
							<Button onClick={handleSaveLocation} disabled={loading} className="w-full mb-2">
								{loading ? "Saving..." : "Save Location"}
							</Button>
							<Button variant="secondary" onClick={handleDiscardLocation} className="w-full">
								Discard
							</Button>
						</div>
					)}
					{mode === "drawServiceArea" && (
						<div>
							<h2 className="text-xl font-semibold mb-4">Draw Service Area</h2>
							<p className="mb-4">Use the drawing tools on the map to define your service area.</p>
							<Button onClick={handleSaveServiceArea} disabled={loading} className="w-full mb-2">
								{loading ? "Saving..." : "Save Service Area"}
							</Button>
							<Button variant="secondary" onClick={handleDiscardServiceArea} className="w-full">
								Discard
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
