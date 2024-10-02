import React from "react"
import { Metadata } from "next"
import app from "@/lib/app"
import { CreateCompanyForm } from "@/components/company/CreateCompanyForm"

export const metadata: Metadata = {
	title: `${app.name} - Create Company`,
	description: "Create your company profile",
}

export default function CreateCompanyPage() {
	return (
		<div className="mb-14 mx-6">
			<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create Company</h2>
			<p className="text-center text-gray-600 dark:text-white">Create your company profile</p>
			<CreateCompanyForm />
		</div>
	)
}
