"use client"

import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createServiceAction } from "@/lib/supabase/server/service"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Service, ServiceCategory, ServiceCategoryInternalName } from "@/types/supabase"

type CreateServiceDialogProps = {
	companyId: string
	userEmail: string
	onServiceCreated: Function
}

const CreateServiceSchema = Yup.object().shape({
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

export function CreateServiceDialog({ companyId, userEmail, onServiceCreated }: CreateServiceDialogProps) {
	const { toast } = useToast()
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const formik = useFormik({
		initialValues: {
			name: "",
			description: "",
			category: "",
		},
		validationSchema: CreateServiceSchema,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true)
			try {
				const formData = new FormData()
				formData.append("company_id", companyId)
				formData.append("name", values.name)
				formData.append("description", values.description)
				formData.append("category", values.category)

				const result = await createServiceAction(formData)

				if (result.success && result.data) {
					toast({
						title: "Success",
						description: result.message,
					})
					const newService: Service = {
						...result.data,
						company_id: companyId,
						email: userEmail,
					}
					onServiceCreated(newService)
					resetForm()
					setIsOpen(false)
				} else {
					toast({
						title: "Error",
						description: result.success ? "Service created but data is missing" : result.error,
						variant: "destructive",
					})
				}
			} catch (error: any) {
				toast({
					variant: "destructive",
					title: "Something Went Wrong",
					description: error.message,
				})
			} finally {
				setLoading(false)
			}
		},
	})

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Create New Service</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Service</DialogTitle>
					<DialogDescription>Add a new service to your company. Fill out the details below.</DialogDescription>
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
						<Select name="category" onValueChange={(value) => formik.setFieldValue("category", value)}>
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
									Creating...
								</>
							) : (
								"Create Service"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
