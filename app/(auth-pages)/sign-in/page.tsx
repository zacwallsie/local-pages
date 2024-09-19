import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { SignInForm } from "@/components/auth/SignInForm"

export const metadata: Metadata = {
	title: `${app.name} - Sign In`,
	description: "Sign into your company account",
}

export default function SignInPage() {
	return (
		<>
			<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in</h2>
			<p className="text-center text-gray-600 dark:text-white">Sign into your company account</p>
			<SignInForm />
		</>
	)
}
