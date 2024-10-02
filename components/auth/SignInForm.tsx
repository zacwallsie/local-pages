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
import { signInAction } from "@/lib/supabase/actions"

type SignInActionResult = { error: string } | { success: true } | undefined

const SignInSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string().required("Password is required"),
})

export function SignInForm() {
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
		validationSchema: SignInSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const formData = new FormData()
				formData.append("email", values.email)
				formData.append("password", values.password)

				const result = (await signInAction(formData)) as SignInActionResult

				if (result && "error" in result) {
					toast({
						variant: "destructive",
						title: "Sign In Failed",
						description: result.error,
					})
				} else if (result && "success" in result) {
					router.push("/company")
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
			<p className="text-center text-sm text-gray-600 mt-3">
				Don't have an account?{" "}
				<Link className="font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]e" href="/sign-up">
					Sign up
				</Link>
			</p>
		</>
	)
}
