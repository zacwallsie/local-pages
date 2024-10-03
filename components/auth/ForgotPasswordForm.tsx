"use client"

import React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ButtonWithState } from "@/components/shared/ButtonWithState"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { forgotPasswordAction } from "@/lib/supabase/server/auth"

// Define the type for the forgotPasswordAction return value
type ForgotPasswordActionResult = { error: string } | { success: true } | undefined

/**
 * Validation schema for the Forgot Password form using Yup.
 * Ensures that the email field is a valid email and is required.
 */
const ForgotPasswordSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
})

/**
 * ForgotPasswordForm Component
 *
 * Renders a form that allows users to request a password reset.
 * Utilizes Formik for form state management and Yup for validation.
 *
 * @returns {JSX.Element} The rendered Forgot Password form.
 */
export function ForgotPasswordForm(): JSX.Element {
	const { toast } = useToast()

	// Initialize Formik with initial values, validation schema, and submit handler
	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: ForgotPasswordSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				// Create a FormData object and append the email value
				const formData = new FormData()
				formData.append("email", values.email)

				// Call the forgotPasswordAction with the form data
				const result = (await forgotPasswordAction(formData)) as ForgotPasswordActionResult

				// Handle errors returned from forgotPasswordAction
				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Password Reset Failed",
						description: result.error,
					})
				}
				// Handle successful password reset request
				else if (result && "success" in result) {
					toast({
						title: "Success",
						description: "Password reset email sent. Please check your inbox.",
					})
				}
			} catch (error) {
				// Handle unexpected errors during the password reset process
				toast({
					variant: "destructive",
					title: "An error occurred",
					description: "Please try again later.",
				})
			} finally {
				// Re-enable the submit button
				setSubmitting(false)
			}
		},
	})

	// Aggregate form errors for potential use (e.g., displaying a summary)
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
						</div>
						<div className="mt-6 space-y-3 w-full">
							{/* Submit Button with loading state */}
							<ButtonWithState
								label="Reset Password"
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
