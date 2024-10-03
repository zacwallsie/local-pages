"use client"

import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Service, ServiceCategory, ServiceCategoryInternalName } from "@/types/supabase"

type EditServiceDialogProps = {
	service: Service
	onServiceUpdated: (updatedService: Partial<Service>) => Promise<void>
	open: boolean
	onOpenChange: (open: boolean) => void
}

const EditServiceSchema = Yup.object().shape({
	name: Yup.string().required("Service Name is required"),
	description: Yup.string().required("Description is required"),
	category: Yup.string().required("Category is required"),
})

// Group categories by type
const groupedCategories = {
	"Home & Personal": ["HOME_SERVICES", "BEAUTY_AND_PERSONAL_CARE", "CLEANING_SERVICES"],
	"Professional & Business": ["PROFESSIONAL_SERVICES", "TECHNOLOGY_SERVICES"],
	"Health & Wellness": ["HEALTH_AND_WELLNESS", "FITNESS_AND_RECREATION"],
	"Education & Events": ["EDUCATION_AND_TUTORING", "EVENT_SERVICES"],
	"Transportation & Logistics": ["AUTOMOTIVE", "MOVING_AND_STORAGE"],
	"Animal Care": ["PET_SERVICES"],
}

export function EditServiceDialog({ service, onServiceUpdated, open, onOpenChange }: EditServiceDialogProps) {
	const [loading, setLoading] = useState(false)

	const formik = useFormik({
		initialValues: {
			name: service.name,
			description: service.description,
			category: service.category,
		},
		validationSchema: EditServiceSchema,
		onSubmit: async (values) => {
			setLoading(true)
			try {
				const updatedFields: Partial<Service> = {
					id: service.id,
					name: values.name,
					description: values.description,
					category: values.category,
				}
				await onServiceUpdated(updatedFields)
				onOpenChange(false)
			} finally {
				setLoading(false)
			}
		},
	})

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Service</DialogTitle>
					<DialogDescription>Update the details of your service.</DialogDescription>
				</DialogHeader>
				<form onSubmit={formik.handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name" className="text-sm font-medium">
							Service Name
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
							placeholder="Enter service name"
							className="mt-1"
						/>
						{formik.touched.name && formik.errors.name && <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>}
					</div>
					<div>
						<Label htmlFor="description" className="text-sm font-medium">
							Description
						</Label>
						<Textarea
							id="description"
							name="description"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.description}
							placeholder="Enter service description"
							className="mt-1"
						/>
						{formik.touched.description && formik.errors.description && (
							<p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
						)}
					</div>
					<div>
						<Label htmlFor="category" className="text-sm font-medium">
							Category
						</Label>
						<Select name="category" onValueChange={(value) => formik.setFieldValue("category", value)} defaultValue={service.category}>
							<SelectTrigger className="w-full mt-1">
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(groupedCategories).map(([group, categories]) => (
									<SelectGroup key={group}>
										<SelectLabel>{group}</SelectLabel>
										{categories.map((category) => {
											const IconComponent = ServiceCategory[category as ServiceCategoryInternalName].displayIcon
											return (
												<SelectItem key={category} value={category}>
													<span className="flex items-center">
														{IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
														{ServiceCategory[category as ServiceCategoryInternalName].displayName}
													</span>
												</SelectItem>
											)
										})}
									</SelectGroup>
								))}
							</SelectContent>
						</Select>
						{formik.touched.category && formik.errors.category && <p className="mt-1 text-sm text-red-500">{formik.errors.category}</p>}
					</div>
					<DialogFooter>
						<Button type="submit" disabled={!formik.dirty || !formik.isValid || loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								"Update Service"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
