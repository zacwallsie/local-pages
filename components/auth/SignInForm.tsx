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
import { signInAction } from "@/lib/supabase/server/auth"

/**
 * Represents the result of the sign-in action.
 * It can either contain an error message or indicate success.
 */
type SignInActionResult = { error: string } | { success: true } | undefined

/**
 * Validation schema for the Sign-In form using Yup.
 * Ensures that both email and password fields are filled out correctly.
 */
const SignInSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string().required("Password is required"),
})

/**
 * SignInForm Component
 *
 * Renders a sign-in form that allows users to authenticate.
 * Utilizes Formik for form state management and Yup for validation.
 *
 * @returns {JSX.Element} The rendered Sign-In form.
 */
export function SignInForm(): JSX.Element {
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
		validationSchema: SignInSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				// Create a FormData object and append form values
				const formData = new FormData()
				formData.append("email", values.email)
				formData.append("password", values.password)

				// Call the signInAction with the form data
				const result = (await signInAction(formData)) as SignInActionResult

				// Handle errors returned from signInAction
				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Sign In Failed",
						description: result.error,
					})
				}
				// Handle successful sign-in
				else if (result && "success" in result) {
					router.push("/company") // Redirect to the company page upon success
				}
			} catch (error) {
				// Handle unexpected errors during the sign-in process
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
						<div className="space-y-4">
							{/* Email Input Field */}
							<div className="space-y-1">
								<Label htmlFor="email">Email</Label>
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
								<div className="flex justify-between items-center">
									<Label htmlFor="password">Password</Label>
									<Link className="text-xs text-foreground underline" href="/forgot-password">
										Forgot Password?
									</Link>
								</div>
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
							{/* Submit Button with loading state */}
							<ButtonWithState
								label="Sign In"
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
			{/* Link to the Sign-Up page for users who don't have an account */}
			<p className="text-center text-sm text-gray-600 mt-3">
				Don't have an account?{" "}
				<Link className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]" href="/sign-up">
					Sign up
				</Link>
			</p>
		</>
	)
}
