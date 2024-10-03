"use client"

import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ButtonWithState } from "@/components/shared/ButtonWithState"
import { TogglePasswordVisibility } from "@/components/shared/TogglePasswordVisibility"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUpAction } from "@/lib/supabase/server/auth"

/**
 * Validation schema for the Sign-Up form using Yup.
 * Ensures that the email is valid and required,
 * and the password meets complexity requirements.
 */
const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/[0-9]/, "Password must contain at least one number")
		.matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
		.required("Password is required"),
})

/**
 * Represents the result of the sign-up action.
 * It can either contain an error message or indicate success.
 */
type SignUpActionResult = { error: string } | { success: true } | undefined

/**
 * SignUpForm Component
 *
 * Renders a sign-up form that allows users to create a new company account.
 * Utilizes Formik for form state management and Yup for validation.
 *
 * @returns {JSX.Element} The rendered Sign-Up form.
 */
export function SignUpForm(): JSX.Element {
	const { toast } = useToast() // Hook for displaying toast notifications
	const router = useRouter() // Hook for navigation

	// State to manage the visibility of the password field
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

	/**
	 * Toggles the visibility of the password field.
	 */
	const handlePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev)
	}

	// Initialize Formik with initial values, validation schema, and submit handler
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: SignupSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				// Create a FormData object and append form values
				const formData = new FormData()
				formData.append("email", values.email)
				formData.append("password", values.password)

				// Call the signUpAction with the form data
				const result = (await signUpAction(formData)) as SignUpActionResult

				// Handle errors returned from signUpAction
				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Sign Up Failed",
						description: result.error,
					})
				}
				// Handle successful sign-up
				else if (result && "success" in result) {
					toast({
						title: "Success",
						description: "Account created successfully. Please check your email for verification.",
					})
					router.push("/sign-in") // Redirect to the sign-in page upon success
				}
			} catch (error) {
				// Handle unexpected errors during the sign-up process
				toast({
					variant: "destructive",
					title: "An error occurred",
					description: "Please try again later.",
				})
			} finally {
				// Re-enable the submit button after submission
				setSubmitting(false)
			}
		},
	})

	// Aggregate form errors into a single string (optional usage)
	const formErrors = Object.values(formik.errors).join(", ")

	return (
		<>
			<Card className="mt-10">
				<CardContent className="mt-6">
					<form onSubmit={formik.handleSubmit}>
						<div className="space-y-3">
							{/* Email Input Field */}
							<div className="space-y-1">
								<Label htmlFor="email">Company Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.email}
									placeholder="you@example.com"
								/>
								{/* Display validation error for email */}
								{formik.touched.email && formik.errors.email && <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>}
							</div>

							{/* Password Input Field with Toggle Visibility */}
							<div className="space-y-1">
								<Label htmlFor="password">Password</Label>
								<div className="flex w-full max-w-sm items-center space-x-1">
									<Input
										id="password"
										type={isPasswordVisible ? "text" : "password"}
										name="password"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.password}
										placeholder="Your password"
									/>
									{/* Toggle button to show or hide the password */}
									<TogglePasswordVisibility
										isPasswordVisible={isPasswordVisible}
										handlePasswordVisibility={handlePasswordVisibility}
									/>
								</div>
								{/* Display validation error for password */}
								{formik.touched.password && formik.errors.password && (
									<p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
								)}
							</div>
						</div>
						<div className="mt-6 space-y-3 w-full">
							{/* Informational Text */}
							<p className="text-sm text-gray-800">
								Once you've made an account we'll run you through the steps on how to make your Company page.
							</p>
							{/* Submit Button with loading state */}
							<ButtonWithState
								label="Create Company Account"
								type="submit"
								color="primary"
								loading={formik.isSubmitting}
								disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
								className="w-full"
							/>
						</div>
					</form>
				</CardContent>
			</Card>
			{/* Link to the Sign-In page for users who already have an account */}
			<p className="text-center text-sm text-gray-600 mt-3">
				Already have a company account?{" "}
				<Link href="/sign-in" className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]">
					Sign in
				</Link>
			</p>
		</>
	)
}
