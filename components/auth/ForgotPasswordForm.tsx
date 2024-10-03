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
import { forgotPasswordAction } from "@/app/api/auth"

// Define the type for the forgotPasswordAction return value
type ForgotPasswordActionResult = { error: string } | { success: true } | undefined

const ForgotPasswordSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
})

export function ForgotPasswordForm() {
	const { toast } = useToast()

	const formik = useFormik({
		initialValues: {
			email: "",
		},
		validationSchema: ForgotPasswordSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const formData = new FormData()
				formData.append("email", values.email)

				const result = (await forgotPasswordAction(formData)) as ForgotPasswordActionResult

				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Password Reset Failed",
						description: result.error,
					})
				} else if (result && "success" in result) {
					toast({
						title: "Success",
						description: "Password reset email sent. Please check your inbox.",
					})
				}
			} catch (error) {
				toast({
					variant: "destructive",
					title: "An error occurred",
					description: "Please try again later",
				})
			} finally {
				setSubmitting(false)
			}
		},
	})

	const formErrors = Object.values(formik.errors).join(", ")

	return (
		<>
			<Card className="mt-10">
				<CardContent className="mt-6">
					<form onSubmit={formik.handleSubmit}>
						<div className="space-y-4">
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
								{formik.touched.email && formik.errors.email && <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>}
							</div>
						</div>
						<div className="mt-6 space-y-3 w-full">
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
			<p className="text-center text-sm text-gray-600 mt-3">
				Don't have an account?{" "}
				<Link className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]e" href="/sign-up">
					Sign up
				</Link>
			</p>
		</>
	)
}
