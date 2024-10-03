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
import { ArrowUpCircle, Loader2 } from "lucide-react"
import { updateCompanyAction, deleteCompanyAction } from "@/lib/supabase/server/company"
import { Separator } from "@/components/ui/separator"
import { Company } from "@/types/supabase"
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

/**
 * Props for the UpdateCompanyForm component.
 *
 * @interface UpdateCompanyFormProps
 * @property {Company} company - The company data to be updated.
 * @property {() => void} [onCancel] - Optional callback to handle form cancellation.
 * @property {() => void} [onSuccess] - Optional callback to handle successful form submission.
 */
interface UpdateCompanyFormProps {
	company: Company
	onCancel?: () => void
	onSuccess?: () => void
}

/**
 * Validation schema for the Update Company form using Yup.
 * Ensures that required fields are filled and that the logo meets size and format requirements.
 */
const UpdateCompanySchema = Yup.object().shape({
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
	address: Yup.string().nullable(),
})

/**
 * Represents the result of the createCompanyAction.
 * It can either contain an error message or indicate success.
 *
 * @type {CreateCompanyActionResult}
 */
type CreateCompanyActionResult = { error: string } | { success: true } | undefined

/**
 * UpdateCompanyForm Component
 *
 * Renders a form that allows users to update their company profile.
 * Utilizes Formik for form state management and Yup for validation.
 *
 * @param {UpdateCompanyFormProps} props - The properties passed to the component.
 * @param {Company} props.company - The company data to be updated.
 * @param {() => void} [props.onCancel] - Optional callback to handle form cancellation.
 * @param {() => void} [props.onSuccess] - Optional callback to handle successful form submission.
 * @returns {JSX.Element} The rendered Update Company form.
 */
export const UpdateCompanyForm: React.FC<UpdateCompanyFormProps> = ({ company, onCancel, onSuccess }) => {
	const { toast } = useToast() // Hook for displaying toast notifications

	// State to manage the image preview of the uploaded logo
	const [imagePreview, setImagePreview] = useState<string | null>(company.logo || null)
	const [loading, setLoading] = useState(false) // State to manage the loading indicator
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false) // State to manage the delete confirmation dialog

	/**
	 * Initialize Formik with initial values, validation schema, and submit handler.
	 */
	const formik = useFormik({
		initialValues: {
			company_name: company.company_name || "",
			description: company.description || "",
			logo: null as File | null as File,
			website_url: company.website_url || "",
			phone_number: company.phone_number || "",
			address: company.address || "",
		},
		validationSchema: UpdateCompanySchema,
		onSubmit: async (values, { setSubmitting }) => {
			setLoading(true) // Show loading indicator
			try {
				// Create a FormData object and append form values
				const formData = new FormData()
				formData.append("company_name", values.company_name)
				formData.append("description", values.description)

				formData.append("website_url", values.website_url || "")
				formData.append("phone_number", values.phone_number || "")
				formData.append("address", values.address || "")

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

				// Call the updateCompanyAction with the form data
				const result = (await updateCompanyAction(formData)) as CreateCompanyActionResult

				// Handle errors returned from updateCompanyAction
				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Company Update Failed",
						description: result.error,
					})
				}
				// Handle successful company update
				else if (result && "success" in result) {
					toast({
						variant: "default",
						title: "Company Updated",
						description: "Your company has been updated successfully",
					})
					onSuccess?.() // Invoke the onSuccess callback if provided
				}
			} catch (error: any) {
				// Handle unexpected errors during the company update process
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

	/**
	 * Handle the deletion of the company account.
	 * Shows a confirmation dialog before proceeding.
	 */
	const handleDeleteAccount = async () => {
		setLoading(true) // Show loading indicator
		try {
			// Call the deleteCompanyAction to delete the company
			const result = await deleteCompanyAction()

			// Handle errors returned from deleteCompanyAction
			if ("error" in result) {
				toast({
					variant: "destructive",
					title: "Company Deletion Failed",
					description: result.error,
				})
			} else {
				// Handle successful company deletion
				toast({
					variant: "default",
					title: "Company Deleted",
					description: "Your account has been successfully deleted.",
				})
				// Redirect to home page or sign-in page after successful deletion
				window.location.href = "/"
			}
		} catch (error: any) {
			// Handle unexpected errors during the company deletion process
			toast({
				variant: "destructive",
				title: "Something Went Wrong",
				description: error.message,
			})
		} finally {
			setLoading(false) // Hide loading indicator
			setIsDeleteDialogOpen(false) // Close the delete confirmation dialog
		}
	}

	return (
		<div className="w-full space-y-16">
			{/* Update Company Form Card */}
			<Card className="bg-aerial-white">
				<CardHeader className="bg-aerial-blue-light">
					<CardTitle className="text-2xl font-bold text-aerial-dark_blue-dark">Update Company</CardTitle>
					<CardDescription className="text-aerial-slate-dark">Update your company profile information.</CardDescription>
				</CardHeader>
				<CardContent className="mt-4">
					<form onSubmit={formik.handleSubmit} className="space-y-8">
						{/* Company Information Section */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-aerial-blue-dark">Company Information</h3>
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

						{/* Action Buttons */}
						<div className="flex gap-2 justify-end">
							{onCancel && (
								<Button type="button" variant="destructive" onClick={onCancel}>
									Cancel
								</Button>
							)}
							<Button type="submit" variant="default" disabled={!formik.dirty || !formik.isValid || loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									"Update Company"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Danger Zone: Delete Company */}
			<Card className="bg-aerial-red-lightest border-aerial-red">
				<CardContent className="mt-4">
					<div className="flex justify-between items-center">
						<div>
							<h4 className="text-lg font-semibold text-aerial-red-dark">Delete Company</h4>
							<p className="text-sm text-aerial-red">Permanently remove your company and all associated data.</p>
						</div>
						<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">Delete Company</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete your company and remove all data associated with
										your company and any services stored.
										<br />
										<br />
										<b>This will not delete your user account, please contact support to delete your individual user account.</b>
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDeleteAccount} disabled={loading} className="bg-red-600 hover:bg-red-700">
										{loading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Deleting...
											</>
										) : (
											"Yes, delete my company"
										)}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
