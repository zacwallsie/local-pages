"use client"

import React, { useState, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ArrowUpCircle, Loader2, CheckCircle2, MapPin, Package } from "lucide-react"
import { createCompanyAction } from "@/lib/supabase/server/company"
import { Steps, Step } from "./Steps"
import { Separator } from "@/components/ui/separator"

/**
 * Validation schema for the Create Company form using Yup.
 * Ensures that required fields are filled and that the logo meets size and format requirements.
 */
const CreateCompanySchema = Yup.object().shape({
	company_name: Yup.string().required("Company Name is required"),
	description: Yup.string().required("Description is required"),
	logo: Yup.mixed()
		.test("fileSize", "File too large (max 2MB)", (value) => {
			if (!value) return true // It's optional
			return value instanceof File ? value.size <= 2 * 1024 * 1024 : true
		})
		.test("fileFormat", "Unsupported file format (PNG or JPEG only)", (value) => {
			if (!value) return true
			return value instanceof File ? ["image/jpeg", "image/png"].includes(value.type) : true
		})
		.nullable(),
	website_url: Yup.string().url("Invalid URL").nullable(),
	phone_number: Yup.string().nullable(),
})

/**
 * Represents the result of the createCompanyAction.
 * It can either contain an error message or indicate success.
 */
type CreateCompanyActionResult = { error: string } | { success: true } | undefined

/**
 * CreateCompanyForm Component
 *
 * Renders a form that allows users to create a new company profile.
 * Utilizes Formik for form state management and Yup for validation.
 *
 * @returns {JSX.Element} The rendered Create Company form.
 */
export function CreateCompanyForm(): JSX.Element {
	const { toast } = useToast() // Hook for displaying toast notifications
	const router = useRouter() // Hook for navigation

	// State to manage the image preview of the uploaded logo
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [loading, setLoading] = useState(false) // State to manage the loading indicator

	/**
	 * Initialize Formik with initial values, validation schema, and submit handler.
	 */
	const formik = useFormik({
		initialValues: {
			company_name: "",
			description: "",
			logo: null as File | null as File,
			website_url: "",
			phone_number: "",
			address: "",
		},
		validationSchema: CreateCompanySchema,
		onSubmit: async (values, { setSubmitting }) => {
			setLoading(true) // Show loading indicator
			try {
				// Create a FormData object and append form values
				const formData = new FormData()
				formData.append("company_name", values.company_name)
				formData.append("description", values.description)

				if (values.website_url) {
					formData.append("website_url", values.website_url)
				}
				if (values.phone_number) {
					formData.append("phone_number", values.phone_number)
				}
				if (values.address) {
					formData.append("address", values.address)
				}

				// Handle logo upload if a file is provided
				if (values.logo instanceof File) {
					const logoString = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader()
						reader.onload = (e) => {
							const result = e.target?.result
							if (typeof result === "string") {
								resolve(JSON.stringify(result))
							} else {
								reject(new Error("Failed to read file"))
							}
						}
						reader.onerror = () => reject(new Error("Failed to read file"))
						reader.readAsDataURL(values.logo)
					})
					formData.append("logo", logoString)
				}

				// Call the createCompanyAction with the form data
				const result = (await createCompanyAction(formData)) as CreateCompanyActionResult

				// Handle errors returned from createCompanyAction
				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Company Creation Failed",
						description: result.error,
					})
				}
				// Handle successful company creation
				else if (result && "success" in result) {
					toast({
						variant: "default",
						title: "Company Created",
						description: "Your company has been created successfully",
					})
					router.push("/company") // Redirect to the company page upon success
				}
			} catch (error: any) {
				// Handle unexpected errors during the company creation process
				toast({
					variant: "destructive",
					title: "Something Went Wrong",
					description: error.message,
				})
			} finally {
				setLoading(false) // Hide loading indicator
				setSubmitting(false) // Re-enable the submit button
			}
		},
	})

	/**
	 * Handle changes to the logo input field.
	 * Updates the form state and sets the image preview.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the logo input field.
	 */
	const handleLogoChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]

			if (file) {
				formik.setFieldValue("logo", file) // Update Formik's state with the selected file

				const reader = new FileReader()
				reader.onload = (e) => {
					const result = e.target?.result
					if (typeof result === "string") {
						setImagePreview(result) // Set the image preview
					}
				}
				reader.readAsDataURL(file) // Read the file as a data URL for preview
			} else {
				formik.setFieldValue("logo", null) // Reset the logo field if no file is selected
				setImagePreview(null) // Remove the image preview
			}
		},
		[formik]
	)

	return (
		<div className="w-full mt-10 space-y-6">
			{/* Step Indicator Card */}
			<Card className="p-6">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-aerial-dark_blue-dark">Getting Started</CardTitle>
				</CardHeader>
				<CardContent>
					<Steps>
						<Step icon={CheckCircle2} title="Create Your Company" description="Fill out the form below to set up your company profile." />
						<Step icon={MapPin} title="Add Service Areas" description="Next, you'll define the areas your company serves." />
						<Step icon={Package} title="List Your Products" description="Finally, add the products or services your company offers." />
					</Steps>
				</CardContent>
			</Card>

			{/* Create Company Form Card */}
			<Card className="bg-aerial-white">
				<CardHeader className="bg-aerial-blue-light">
					<CardTitle className="text-2xl font-bold text-aerial-dark_blue-dark">Create Company</CardTitle>
					<CardDescription className="text-aerial-slate-dark">
						Fill in the required information to set up your company profile.
					</CardDescription>
				</CardHeader>
				<CardContent className="mt-4">
					<form onSubmit={formik.handleSubmit} className="space-y-8">
						{/* Required Information Section */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-aerial-blue-dark">Required Information</h3>
							<div className="space-y-4">
								{/* Company Name Field */}
								<div>
									<Label htmlFor="company_name" className="text-sm font-medium text-aerial-slate-dark">
										Company Name
									</Label>
									<Input
										id="company_name"
										name="company_name"
										type="text"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.company_name}
										placeholder="Your Company Name"
										className="mt-1 bg-aerial-white border-aerial-blue"
									/>
									{/* Display validation error for company_name */}
									{formik.touched.company_name && formik.errors.company_name && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.company_name}</p>
									)}
								</div>

								{/* Description Field */}
								<div>
									<Label htmlFor="description" className="text-sm font-medium text-aerial-slate-dark">
										Description
									</Label>
									<Textarea
										id="description"
										name="description"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.description}
										placeholder="Company Description"
										className="mt-1 h-24 bg-aerial-white border-aerial-blue"
									/>
									{/* Display validation error for description */}
									{formik.touched.description && formik.errors.description && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.description}</p>
									)}
								</div>
							</div>
						</div>

						<Separator className="my-8 h-0.5" />

						{/* Optional Information Section */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-aerial-blue-dark">Optional Information</h3>
							<div className="space-y-4">
								{/* Logo Upload Field */}
								<div>
									<Label htmlFor="logo" className="text-sm font-medium text-aerial-slate-dark">
										Logo
									</Label>
									<p className="mt-1 text-sm text-aerial-slate">This will be the picture visible to potential Customers.</p>
									<div className="mt-1 flex items-center space-x-4">
										<label
											htmlFor="logo"
											className="group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-aerial-blue bg-aerial-white transition-all hover:bg-aerial-blue-lightest"
										>
											{imagePreview ? (
												<img src={imagePreview} alt="Logo Preview" className="h-full w-full rounded-full object-cover" />
											) : (
												<ArrowUpCircle className="h-8 w-8 text-aerial-blue group-hover:scale-110" />
											)}
											<input
												id="logo"
												name="logo"
												type="file"
												accept="image/png, image/jpeg"
												className="sr-only"
												onChange={handleLogoChange}
												onBlur={formik.handleBlur}
											/>
										</label>
										<span className="text-sm text-aerial-slate">Upload a PNG or JPEG (max 2MB)</span>
									</div>
								</div>

								{/* Website URL Field */}
								<div>
									<Label htmlFor="website_url" className="text-sm font-medium text-aerial-slate-dark">
										Website URL
									</Label>
									<Input
										id="website_url"
										name="website_url"
										type="url"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.website_url}
										placeholder="https://yourcompany.com"
										className="mt-1 bg-aerial-white border-aerial-blue"
									/>
									<p className="mt-1 text-sm text-aerial-slate">Enter your company's website address if available.</p>
									{/* Display validation error for website_url */}
									{formik.touched.website_url && formik.errors.website_url && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.website_url}</p>
									)}
								</div>

								{/* Phone Number Field */}
								<div>
									<Label htmlFor="phone_number" className="text-sm font-medium text-aerial-slate-dark">
										Phone Number
									</Label>
									<Input
										id="phone_number"
										name="phone_number"
										type="tel"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.phone_number}
										placeholder="+1234567890"
										className="mt-1 bg-aerial-white border-aerial-blue"
									/>
									<p className="mt-1 text-sm text-aerial-slate">Provide a contact number for your company (if applicable).</p>
									{/* Display validation error for phone_number */}
									{formik.touched.phone_number && formik.errors.phone_number && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.phone_number}</p>
									)}
								</div>

								{/* Address Field */}
								<div>
									<Label htmlFor="address" className="text-sm font-medium text-aerial-slate-dark">
										Address
									</Label>
									<Textarea
										id="address"
										name="address"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.address}
										placeholder="Company Address"
										className="mt-1 h-24 bg-aerial-white border-aerial-blue"
									/>
									<p className="mt-1 text-sm text-aerial-slate">Enter your company's physical address (if applicable).</p>
									{/* Display validation error for address */}
									{formik.touched.address && formik.errors.address && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.address}</p>
									)}
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<Button type="submit" className="w-full" disabled={!formik.dirty || !formik.isValid || loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Company"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
