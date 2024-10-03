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
import { signUpAction } from "@/app/api/auth"

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

export function SignUpForm() {
	const { toast } = useToast()
	const router = useRouter()

	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

	const handlePasswordVisibility = () => {
		setIsPasswordVisible((prev) => !prev)
	}

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: SignupSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const formData = new FormData()
				formData.append("email", values.email)
				formData.append("password", values.password)

				const result = await signUpAction(formData)

				if ("error" in result) {
					toast({
						variant: "destructive",
						title: "Sign Up Failed",
						description: result.error,
					})
				} else {
					toast({
						title: "Success",
						description: "Account created successfully. Please check your email for verification.",
					})
					router.push("/sign-in")
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
						<div className="space-y-3">
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
								{formik.touched.email && formik.errors.email && <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>}
							</div>

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
									<TogglePasswordVisibility
										isPasswordVisible={isPasswordVisible}
										handlePasswordVisibility={handlePasswordVisibility}
									/>
								</div>
								{formik.touched.password && formik.errors.password && (
									<p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
								)}
							</div>
						</div>
						<div className="mt-6 space-y-3 w-full">
							<p className="text-sm text-gray-800">
								Once you've made an account we'll run you through the steps on how to make your Company page.
							</p>
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
			<p className="text-center text-sm text-gray-600 mt-3">
				Already have a company account?&nbsp;
				<Link href={`/sign-in`} className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]">
					Sign in
				</Link>
			</p>
		</>
	)
}
