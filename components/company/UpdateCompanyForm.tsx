// components/company/UpdateCompanyForm.tsx

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
import { updateCompanyAction, ActionResult } from "@/lib/supabase/actions"
import { Separator } from "@/components/ui/separator"
import { Company } from "@/types/supabase"

interface UpdateCompanyFormProps {
	company: Company
	onCancel?: () => void
	onSuccess?: () => void
}

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

export const UpdateCompanyForm: React.FC<UpdateCompanyFormProps> = ({ company, onCancel, onSuccess }) => {
	const { toast } = useToast()

	const [imagePreview, setImagePreview] = useState<string | null>(company.logo || null)
	const [loading, setLoading] = useState(false)

	const formik = useFormik({
		initialValues: {
			company_name: company.company_name || "",
			description: company.description || "",
			logo: null as File | null,
			website_url: company.website_url || "",
			phone_number: company.phone_number || "",
			address: company.address || "",
		},
		validationSchema: UpdateCompanySchema,
		onSubmit: async (values, { setSubmitting }) => {
			setLoading(true)
			try {
				const formData = new FormData()
				formData.append("company_name", values.company_name)
				formData.append("description", values.description)

				formData.append("website_url", values.website_url || "")
				formData.append("phone_number", values.phone_number || "")
				formData.append("address", values.address || "")

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
					})
					formData.append("logo", logoString)
				} else if (imagePreview !== company.logo) {
					// If the logo was removed
					formData.append("logo", "")
				}

				const result: ActionResult = await updateCompanyAction(formData)

				if ("error" in result) {
					toast({
						variant: "destructive",
						title: "Company Update Failed",
						description: result.error,
					})
				} else if ("success" in result) {
					toast({
						variant: "default",
						title: "Company Updated",
						description: result.message,
					})
					onSuccess?.()
				}
			} catch (error: any) {
				toast({
					variant: "destructive",
					title: "Something Went Wrong",
					description: error.message,
				})
			} finally {
				setLoading(false)
				setSubmitting(false)
			}
		},
	})

	const handleLogoChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]

			if (file) {
				formik.setFieldValue("logo", file)

				const reader = new FileReader()
				reader.onload = (e) => {
					const result = e.target?.result
					if (typeof result === "string") {
						setImagePreview(result)
					}
				}
				reader.readAsDataURL(file)
			} else {
				formik.setFieldValue("logo", null)
				setImagePreview(null)
			}
		},
		[formik]
	)

	return (
		<div className="w-full max-w-4xl mx-auto space-y-8">
			<Card className="bg-aerial-white">
				<CardHeader className="bg-aerial-blue-light">
					<CardTitle className="text-2xl font-bold text-aerial-dark_blue-dark">Update Company</CardTitle>
					<CardDescription className="text-aerial-slate-dark">Update your company profile information.</CardDescription>
				</CardHeader>
				<CardContent className="mt-4">
					<form onSubmit={formik.handleSubmit} className="space-y-8">
						{/* Required Information */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-aerial-blue-dark">Company Information</h3>
							<div className="space-y-4">
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
									{formik.touched.company_name && formik.errors.company_name && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.company_name}</p>
									)}
								</div>

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
									{formik.touched.description && formik.errors.description && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.description}</p>
									)}
								</div>
							</div>
						</div>

						<Separator className="my-8 h-0.5" />

						{/* Optional Information */}
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-aerial-blue-dark">Optional Information</h3>
							<div className="space-y-4">
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
										{formik.touched.logo && formik.errors.logo && <p className="text-sm text-aerial-red">{formik.errors.logo}</p>}
									</div>
								</div>

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
									{formik.touched.website_url && formik.errors.website_url && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.website_url}</p>
									)}
								</div>

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
									{formik.touched.phone_number && formik.errors.phone_number && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.phone_number}</p>
									)}
								</div>

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
									{formik.touched.address && formik.errors.address && (
										<p className="mt-1 text-sm text-aerial-red">{formik.errors.address}</p>
									)}
								</div>
							</div>
						</div>

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
		</div>
	)
}
