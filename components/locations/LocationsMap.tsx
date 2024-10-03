"use client"

import React, { useState, useRef, useEffect } from "react"
import { MapContainer, TileLayer, FeatureGroup, ZoomControl, GeoJSON, useMapEvents } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Company, ServiceArea, Service, ServiceCategory, ServiceCategoryInternalName } from "@/types/supabase"
import * as L from "leaflet"
import { GeoJSON as GeoJSONType } from "geojson"
import Link from "next/link"
import { getServicesAction } from "@/app/api/service"
import { createServiceAreaAction, updateServiceAreaAction, deleteServiceAreaAction, getServiceAreasAction } from "@/app/api/service_area"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash } from "lucide-react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface LocationsMapProps {
	company: Company
}

const BRISBANE_CENTER: [number, number] = [-27.4698, 153.0251]

const AddServiceAreaControl = ({ onClick, isVisible }: { onClick: () => void; isVisible: boolean }) => {
	useEffect(() => {
		if (!isVisible) return

		const controlContainer = L.DomUtil.create("div", "leaflet-bar leaflet-control")
		const button = L.DomUtil.create("a", "leaflet-control-button", controlContainer)
		button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    `
		button.title = "Add Service Area"
		button.href = "#"
		button.style.display = "flex"
		button.style.alignItems = "center"
		button.style.justifyContent = "center"

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

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
	useMapEvents({
		click: (e) => {
			// Check if the click occurred directly on the map, not on a polygon
			if ((e.originalEvent.target as HTMLElement).classList.contains("leaflet-container")) {
				onMapClick()
			}
		},
	})
	return null
}

function LocationsMap({ company }: LocationsMapProps) {
	const [mode, setMode] = useState<"drawServiceArea" | "editServiceArea" | null>(null)
	const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
	const [services, setServices] = useState<Service[]>([])
	const [selectedServiceArea, setSelectedServiceArea] = useState<ServiceArea | null>(null)
	const [newServiceArea, setNewServiceArea] = useState<GeoJSONType | null>(null)
	const [selectedService, setSelectedService] = useState<string | null>(null)
	const [isActive, setIsActive] = useState(true)
	const [loading, setLoading] = useState(false)
	const mapRef = useRef<L.Map>(null)
	const featureGroupRef = useRef<L.FeatureGroup>(null)
	const { toast } = useToast()

	useEffect(() => {
		loadServiceAreas()
		loadServices()
	}, [serviceAreas.length])

	const loadServiceAreas = async () => {
		const result = await getServiceAreasAction(company.id)
		if (result.success && result.data) {
			setServiceAreas(result.data)
		} else if (!result.success) {
			toast({
				title: "Error",
				description: "Failed to load service areas: " + (result.error || "Unknown error"),
				variant: "destructive",
			})
		}
	}

	const loadServices = async () => {
		const result = await getServicesAction(company.id)
		if (result.success && result.data) {
			setServices(result.data)
		} else if (!result.success) {
			toast({
				title: "Error",
				description: "Failed to load services: " + (result.error || "Unknown error"),
				variant: "destructive",
			})
		}
	}

	const handleModeChange = (newMode: "drawServiceArea" | "editServiceArea") => {
		setMode(newMode)
		setSelectedServiceArea(null)
		setNewServiceArea(null)
		setSelectedService(null)
		setIsActive(true)
		if (featureGroupRef.current) {
			featureGroupRef.current.clearLayers()
		}
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
		loadServiceAreas() // Reload service areas after canceling edit
	}

	const handleSaveServiceArea = async () => {
		if (!newServiceArea || !selectedService) {
			toast({
				title: "Error",
				description: "Please draw a service area and select a service.",
				variant: "destructive",
			})
			return
		}
		// Ensure that newServiceArea is a Polygon
		if (newServiceArea.type !== "Polygon") {
			toast({
				title: "Error",
				description: "Service area must be a single polygon.",
				variant: "destructive",
			})
			return
		}

		const formData = new FormData()
		formData.append("service_id", selectedService)
		formData.append("company_id", company.id)
		formData.append("geojson", JSON.stringify(newServiceArea))
		formData.append("is_active", isActive.toString())

		const result = await createServiceAreaAction(formData)
		setLoading(false)

		if (result.success) {
			toast({
				title: "Success",
				description: "Service area saved successfully!",
			})
			loadServiceAreas() // Reload service areas after saving
			handleCancelEdit()
		} else {
			toast({
				title: "Error",
				description: "Failed to save service area: " + result.error,
				variant: "destructive",
			})
		}
	}

	const handleUpdateServiceArea = async () => {
		if (!selectedServiceArea) return

		setLoading(true)

		const formData = new FormData()
		formData.append("id", selectedServiceArea.id)
		formData.append("geojson", JSON.stringify(selectedServiceArea.geojson))
		formData.append("is_active", isActive.toString())
		formData.append("service_id", selectedService || selectedServiceArea.service_id.toString())
		formData.append("company_id", company.id)

		const result = await updateServiceAreaAction(formData)
		setLoading(false)

		if (result.success) {
			toast({
				title: "Success",
				description: "Service area updated successfully!",
			})
			loadServiceAreas() // Reload service areas after updating
			handleCancelEdit()
		} else {
			toast({
				title: "Error",
				description: "Failed to update service area: " + result.error,
				variant: "destructive",
			})
		}
	}

	const handleDeleteServiceArea = async () => {
		if (!selectedServiceArea) return

		setLoading(true)

		const result = await deleteServiceAreaAction(selectedServiceArea.id)
		setLoading(false)

		if (result.success) {
			toast({
				title: "Success",
				description: "Service area deleted successfully!",
			})
			loadServiceAreas() // Reload service areas after deletion
			handleCancelEdit()
		} else {
			toast({
				title: "Error",
				description: "Failed to delete service area: " + result.error,
				variant: "destructive",
			})
		}
	}

	const updateSelectedServiceAreaGeometries = () => {
		const layers = featureGroupRef.current?.getLayers()
		if (layers && layers.length === 1) {
			const layer = layers[0] as L.Polygon // Cast to L.Polygon

			const geojson = layer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Geometry>
			const geometry = geojson.geometry

			setSelectedServiceArea((prevArea) =>
				prevArea
					? {
							...prevArea,
							geojson: geometry,
						}
					: null
			)
		} else {
			// Display an error if more than one polygon exists
			toast({
				title: "Error",
				description: "Please ensure there is exactly one polygon in the service area.",
				variant: "destructive",
			})
		}
	}

	const onEdited = (e: L.DrawEvents.Edited) => {
		if (mode === "editServiceArea" && selectedServiceArea) {
			updateSelectedServiceAreaGeometries()
		}
	}

	const onCreated = (e: L.DrawEvents.Created) => {
		const layer = e.layer

		// Clear existing layers before adding the new one
		featureGroupRef.current?.clearLayers()

		if (mode === "drawServiceArea") {
			const geojson = layer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Geometry>
			setNewServiceArea(geojson.geometry)
			featureGroupRef.current?.addLayer(layer)
		} else if (mode === "editServiceArea" && selectedServiceArea) {
			featureGroupRef.current?.addLayer(layer)
			updateSelectedServiceAreaGeometries()
		}
	}

	const onDeleted = (e: L.DrawEvents.Deleted) => {
		if (mode === "editServiceArea" && selectedServiceArea) {
			updateSelectedServiceAreaGeometries()
		}
	}

	const handleServiceAreaClick = (area: ServiceArea) => {
		setSelectedServiceArea(area)
		setSelectedService(area.service_id.toString())
		setIsActive(area.is_active)
	}

	const handleEditServiceArea = () => {
		setMode("editServiceArea")
		if (mapRef.current && selectedServiceArea) {
			const bounds = L.geoJSON(selectedServiceArea.geojson).getBounds()
			mapRef.current.fitBounds(bounds)
		}
	}

	// useEffect to manage GeoJSON layers
	useEffect(() => {
		if (!featureGroupRef.current) return

		// Clear existing layers
		featureGroupRef.current.clearLayers()

		// Add service area layers
		if (mode !== "editServiceArea" && mode !== "drawServiceArea") {
			serviceAreas.forEach((area) => {
				const geojsonLayer = L.geoJSON(area.geojson as GeoJSONType, {
					style: {
						color: area.is_active ? "green" : "red",
						weight: 2,
						opacity: 0.8,
						fillColor: area.is_active ? "green" : "red",
						fillOpacity: 0.3,
					},
					onEachFeature: (feature, layer) => {
						layer.on("click", () => {
							handleServiceAreaClick(area)
						})
					},
				})
				geojsonLayer.addTo(featureGroupRef.current!)
			})
		}
	}, [serviceAreas, mode])

	useEffect(() => {
		if (mode === "editServiceArea" && selectedServiceArea && featureGroupRef.current) {
			featureGroupRef.current.clearLayers()
			L.geoJSON(selectedServiceArea.geojson).eachLayer((layer) => {
				featureGroupRef.current?.addLayer(layer)
			})
		}
	}, [mode, selectedServiceArea])

	return (
		<div className="w-full h-screen flex flex-col">
			<div className="flex flex-grow w-full z-0">
				<div className={`relative h-full transition-all duration-300 ${mode ? "w-full" : "w-full"}`}>
					<MapContainer center={BRISBANE_CENTER} zoom={11} style={{ height: "100%", width: "100%" }} zoomControl={false}>
						<TileLayer
							url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
										circle: false,
										circlemarker: false,
										marker: false,
										polyline: false,
										polygon: true,
									}}
								/>
							)}
							{mode === "editServiceArea" && selectedServiceArea && (
								<>
									<EditControl
										position="topright"
										onEdited={onEdited}
										onCreated={onCreated}
										onDeleted={onDeleted}
										edit={{
											featureGroup: featureGroupRef.current!,
											remove: true,
											edit: true,
										}}
										draw={{
											rectangle: false,
											circle: false,
											circlemarker: false,
											marker: false,
											polyline: false,
											polygon: true,
										}}
									/>
								</>
							)}
							{mode !== "editServiceArea" &&
								mode !== "drawServiceArea" &&
								serviceAreas.map((area) => (
									<GeoJSON
										key={area.id}
										data={area.geojson as GeoJSONType}
										style={() => ({
											color: area.is_active ? "green" : "red",
											weight: 2,
											opacity: 0.8,
											fillColor: area.is_active ? "green" : "red",
											fillOpacity: 0.3,
										})}
										eventHandlers={{
											click: () => handleServiceAreaClick(area),
										}}
									/>
								))}
						</FeatureGroup>

						{/* Map click handler to deselect polygon */}
						<MapClickHandler onMapClick={() => setSelectedServiceArea(null)} />
					</MapContainer>

					{selectedServiceArea && mode !== "editServiceArea" && (
						<Card className="absolute top-4 left-4 w-96 z-[1000]">
							<CardHeader>
								<CardTitle>Service Area Details</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center mb-4">
									{/* Display Service Category Icon */}
									{(() => {
										const service = services.find((s) => s.id === selectedServiceArea.service_id)
										if (service) {
											const category = service.category as ServiceCategoryInternalName
											const IconComponent = ServiceCategory[category]?.displayIcon
											if (IconComponent) {
												return <IconComponent className="h-6 w-6 mr-2" />
											}
										}
										return null
									})()}
									<div>
										<p className="text-lg font-semibold">{services.find((s) => s.id === selectedServiceArea.service_id)?.name}</p>
										<p className="text-sm text-muted-foreground">
											{(() => {
												const service = services.find((s) => s.id === selectedServiceArea.service_id)
												if (service) {
													const category = service.category as ServiceCategoryInternalName
													return ServiceCategory[category]?.displayName || category
												}
												return null
											})()}
										</p>
									</div>
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium">Description:</p>
									<p className="text-sm text-muted-foreground">
										{services.find((s) => s.id === selectedServiceArea.service_id)?.description}
									</p>
								</div>
								<div className="space-y-2 mt-2">
									<p className="text-sm font-medium">Status:</p>
									{/* Use Badge component to display status */}
									<Badge variant={selectedServiceArea.is_active ? "default" : "destructive"}>
										{selectedServiceArea.is_active ? "Active" : "Inactive"}
									</Badge>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end space-x-2">
								<Button variant="outline" onClick={handleEditServiceArea}>
									<Edit className="w-4 h-4 mr-2" />
									Edit
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">
											<Trash className="w-4 h-4 mr-2" />
											Delete
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Service Area</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this service area? This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={handleDeleteServiceArea} className="bg-red-600 hover:bg-red-700">
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</CardFooter>
						</Card>
					)}
				</div>

				{/* Side panel for editing */}
				{mode && (
					<div
						className={`h-full bg-white p-6 shadow-lg rounded-lg transition-all duration-300 ${
							mode ? "w-1/3" : "w-0 overflow-hidden hidden"
						}`}
					>
						{mode === "drawServiceArea" && (
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold mb-6">Add New Service Area</h2>
								<div>
									<Label htmlFor="service" className="mb-2">
										Select a Service
									</Label>
									<Select onValueChange={setSelectedService}>
										<SelectTrigger>
											<SelectValue placeholder="Select a service" />
										</SelectTrigger>
										<SelectContent>
											{services.length === 0 ? (
												<div className="p-4 text-center text-sm text-gray-600">
													<p>You don't have any services yet.</p>
													<p>
														Please{" "}
														<Link href="/company/services" className="text-blue-600 underline">
															add services to your account
														</Link>
														.
													</p>
												</div>
											) : (
												services.map((service) => (
													<SelectItem key={service.id} value={service.id.toString()}>
														{service.name}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center space-x-2">
									<Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
									<Label htmlFor="active">Active</Label>
								</div>
								<Button onClick={handleSaveServiceArea} disabled={loading || !newServiceArea || !selectedService} className="w-full">
									{loading ? "Saving..." : "Save Service Area"}
								</Button>
								<Button variant="secondary" onClick={handleCancelEdit} className="w-full">
									Cancel
								</Button>
							</div>
						)}
						{mode === "editServiceArea" && selectedServiceArea && (
							<div className="space-y-6">
								<h2 className="text-2xl font-semibold mb-6">Edit Service Area</h2>
								<div>
									<Label htmlFor="service" className="mb-2">
										Select a Service
									</Label>
									<Select value={selectedService || ""} onValueChange={setSelectedService}>
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
								</div>
								<div className="flex items-center space-x-2">
									<Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
									<Label htmlFor="active">Active</Label>
								</div>
								<Button onClick={handleUpdateServiceArea} disabled={loading} className="w-full">
									{loading ? "Updating..." : "Update Service Area"}
								</Button>
								<Button variant="secondary" onClick={handleCancelEdit} className="w-full">
									Cancel
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default LocationsMap
