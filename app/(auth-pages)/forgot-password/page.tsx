import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export const metadata: Metadata = {
	title: `${app.name} - Forgot Password`,
	description: "Forgot your password? No problem. Reset it here.",
}

export default function SignUpPage() {
	return (
		<>
			<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Forgot Password</h2>
			<p className="text-center text-gray-600 dark:text-white">Forgot Password? No problem. Reset it here.</p>
			<ForgotPasswordForm />
		</>
	)
}
