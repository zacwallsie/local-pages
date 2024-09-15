import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { SignUpForm } from "@/components/auth/SignUpForm"

export const metadata: Metadata = {
	title: `${app.name} - Sign Up`,
	description: "Create a new account",
}

export default function SignUpPage() {
	return (
		<>
			<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>
			<p className="text-center text-gray-600 dark:text-white">Create a new account</p>
			<SignUpForm />
		</>
	)
}
