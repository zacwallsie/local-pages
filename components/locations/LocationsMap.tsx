// components/locations/LocationMap.tsx

"use client"

import React, { useState, useRef, useEffect } from "react"
import { MapContainer, TileLayer, FeatureGroup, ZoomControl, GeoJSON } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabaseClient } from "@/lib/supabase/client" // Updated import path
import { Company, ServiceArea, Service } from "@/types/supabase" // Centralized types
import L from "leaflet"
import { GeoJSON as GeoJSONType } from "geojson"
import { useSession } from "@/components/providers/SessionProvider" // Optional: if using session data

interface LocationsMapProps {
	company: Company
}

const BRISBANE_CENTER: [number, number] = [-27.4698, 153.0251]

const AddServiceAreaControl = ({ onClick, isVisible }: { onClick: () => void; isVisible: boolean }) => {
	useEffect(() => {
		if (!isVisible) return

		const controlContainer = L.DomUtil.create("div", "leaflet-bar leaflet-control")
		const button = L.DomUtil.create("a", "leaflet-control-button", controlContainer)
		button.innerHTML =
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
		button.title = "Add Service Area"
		button.href = "#"
		L.DomEvent.addListener(button, "click", (e) => {
			L.DomEvent.stopPropagation(e)
			onClick()
		})

		const leafletContainer = document.querySelector(".leaflet-control-container")
		if (leafletContainer) {
			const topRightControls = leafletContainer.querySelector(".leaflet-top.leaflet-right")
			if (topRightControls) {
				topRightControls.appendChild(controlContainer)
			}
		}

		return () => {
			controlContainer.remove()
		}
	}, [onClick, isVisible])

	return null
}

function LocationsMap({ company }: LocationsMapProps) {
	// Optional: Use session data if needed
	// const { user, isLoading: sessionLoading } = useSession();

	const [mode, setMode] = useState<"drawServiceArea" | "editServiceArea" | null>(null)
	const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
	const [services, setServices] = useState<Service[]>([])
	const [selectedServiceArea, setSelectedServiceArea] = useState<ServiceArea | null>(null)
	const [newServiceArea, setNewServiceArea] = useState<GeoJSONType | null>(null)
	const [selectedService, setSelectedService] = useState<number | null>(null)
	const [isActive, setIsActive] = useState(true)
	const [loading, setLoading] = useState(false)
	const mapRef = useRef<L.Map>(null)
	const featureGroupRef = useRef<L.FeatureGroup>(null)

	useEffect(() => {
		loadServiceAreas()
		loadServices()
	}, [])

	const loadServiceAreas = async () => {
		const { data, error } = await supabaseClient
			.from("service_areas")
			.select("id, geojson, is_active, service_id, services(name)")
			.eq("company_id", company.id)

		if (error) {
			console.error("Error loading service areas:", error)
		} else {
			setServiceAreas(
				data.map((area) => ({
					...area,
					service_name: area.services.name,
				}))
			)
		}
	}

	const loadServices = async () => {
		const { data, error } = await supabaseClient.from("services").select("id, name").eq("company_id", company.id)

		if (error) {
			console.error("Error loading services:", error)
		} else {
			setServices(data)
		}
	}

	const handleModeChange = (newMode: "drawServiceArea" | "editServiceArea") => {
		setMode(newMode)
		setSelectedServiceArea(null)
		setNewServiceArea(null)
		setSelectedService(null)
		setIsActive(true)
	}

	const handleCancelEdit = () => {
		setMode(null)
		setSelectedServiceArea(null)
		setNewServiceArea(null)
		setSelectedService(null)
		setIsActive(true)
		if (featureGroupRef.current) {
			featureGroupRef.current.clearLayers()
		}
	}

	const handleSaveServiceArea = async () => {
		if (!newServiceArea || !selectedService) {
			alert("Please draw a service area and select a service.")
			return
		}
		setLoading(true)
		const { error } = await supabaseClient.from("service_areas").insert({
			company_id: company.id,
			geojson: newServiceArea,
			service_id: selectedService,
			is_active: isActive,
		})
		setLoading(false)

		if (error) {
			console.error(error)
			alert("Error saving service area.")
		} else {
			alert("Service area saved successfully!")
			loadServiceAreas()
			setMode(null)
			setNewServiceArea(null)
			setSelectedService(null)
		}
	}

	const handleUpdateServiceArea = async () => {
		if (!selectedServiceArea) return

		setLoading(true)
		const { error } = await supabaseClient
			.from("service_areas")
			.update({
				geojson: selectedServiceArea.geojson,
				service_id: selectedService || selectedServiceArea.service_id,
				is_active: isActive,
			})
			.eq("id", selectedServiceArea.id)
		setLoading(false)

		if (error) {
			console.error(error)
			alert("Error updating service area.")
		} else {
			alert("Service area updated successfully!")
			loadServiceAreas()
			setMode(null)
			setSelectedServiceArea(null)
		}
	}

	const handleDeleteServiceArea = async () => {
		if (!selectedServiceArea) return

		if (confirm("Are you sure you want to delete this service area?")) {
			const { error } = await supabaseClient.from("service_areas").delete().eq("id", selectedServiceArea.id)

			if (error) {
				console.error(error)
				alert("Error deleting service area.")
			} else {
				alert("Service area deleted successfully!")
				loadServiceAreas()
				setMode(null)
				setSelectedServiceArea(null)
			}
		}
	}

	const onCreated = (e: L.LeafletEvent) => {
		const layer = (e as any).layer as L.Layer
		const geojson = layer.toGeoJSON()
		setNewServiceArea(geojson.geometry)
	}

	const onEdited = (e: L.LeafletEvent) => {
		const layers = (e as any).layers as L.LayerGroup
		layers.eachLayer((layer: L.Layer) => {
			if (layer instanceof L.Polygon) {
				const geojson = layer.toGeoJSON()
				if (selectedServiceArea) {
					setSelectedServiceArea({
						...selectedServiceArea,
						geojson: geojson.geometry,
					})
				}
			}
		})
	}

	return (
		<div className="w-full h-screen flex flex-col">
			<div className="flex flex-grow w-full z-0">
				<div className={`relative h-full transition-all duration-300 ${mode ? "w-2/3" : "w-full"}`}>
					<MapContainer
						center={BRISBANE_CENTER}
						zoom={11}
						style={{ height: "100%", width: "100%" }}
						whenCreated={(mapInstance) => {
							mapRef.current = mapInstance
						}}
						zoomControl={false}
					>
						<TileLayer
							url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
						/>
						<ZoomControl position="topright" />
						<AddServiceAreaControl onClick={() => handleModeChange("drawServiceArea")} isVisible={!mode} />
						<FeatureGroup ref={featureGroupRef}>
							{mode === "drawServiceArea" && (
								<EditControl
									position="topright"
									onCreated={onCreated}
									draw={{
										rectangle: false,
										circle: true,
										circlemarker: false,
										marker: false,
										polyline: false,
										polygon: true,
									}}
								/>
							)}
							{mode === "editServiceArea" && (
								<EditControl
									position="topright"
									onEdited={onEdited}
									edit={{
										remove: false,
									}}
								/>
							)}
							{serviceAreas.map((area) => (
								<GeoJSON
									key={area.id}
									data={area.geojson}
									style={() => ({
										color: area.is_active ? "#00ff00" : "#ff0000",
										weight: 2,
										opacity: 0.65,
									})}
									eventHandlers={{
										click: () => {
											setSelectedServiceArea(area)
											setSelectedService(area.service_id)
											setIsActive(area.is_active)
											setMode("editServiceArea")
										},
									}}
								/>
							))}
						</FeatureGroup>
					</MapContainer>
				</div>

				{/* Side sheet */}
				<div className={`h-full bg-white p-4 shadow-md transition-all duration-300 ${mode ? "w-1/3" : "w-0 overflow-hidden hidden"}`}>
					{mode === "drawServiceArea" && (
						<div className="space-y-4">
							<h2 className="text-xl font-semibold mb-4">Add New Service Area</h2>
							<Select onValueChange={(value) => setSelectedService(Number(value))}>
								<SelectTrigger>
									<SelectValue placeholder="Select a service" />
								</SelectTrigger>
								<SelectContent>
									{services.map((service) => (
										<SelectItem key={service.id} value={service.id.toString()}>
											{service.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex items-center space-x-2">
								<Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
								<Label htmlFor="active">Active</Label>
							</div>
							<Button onClick={handleSaveServiceArea} disabled={loading || !newServiceArea || !selectedService}>
								{loading ? "Saving..." : "Save Service Area"}
							</Button>
							<Button variant="secondary" onClick={handleCancelEdit}>
								Cancel
							</Button>
						</div>
					)}
					{mode === "editServiceArea" && selectedServiceArea && (
						<div className="space-y-4">
							<h2 className="text-xl font-semibold mb-4">Edit Service Area</h2>
							<Select value={selectedService?.toString() || ""} onValueChange={(value) => setSelectedService(Number(value))}>
								<SelectTrigger>
									<SelectValue placeholder="Select a service" />
								</SelectTrigger>
								<SelectContent>
									{services.map((service) => (
										<SelectItem key={service.id} value={service.id.toString()}>
											{service.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex items-center space-x-2">
								<Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
								<Label htmlFor="active">Active</Label>
							</div>
							<Button onClick={handleUpdateServiceArea} disabled={loading}>
								{loading ? "Updating..." : "Update Service Area"}
							</Button>
							<Button variant="destructive" onClick={handleDeleteServiceArea} disabled={loading}>
								Delete Service Area
							</Button>
							<Button variant="secondary" onClick={handleCancelEdit}>
								Cancel
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default LocationsMap
