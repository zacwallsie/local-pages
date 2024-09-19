"use client"

import React, { useState } from "react"
import { Company } from "@/types/company"
import { UpdateCompanyForm } from "./UpdateCompanyForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Phone, Globe, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CompanyDetailsProps {
	company: Company
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company }) => {
	const [isEditing, setIsEditing] = useState(false)

	if (isEditing) {
		return <UpdateCompanyForm company={company} onCancel={() => setIsEditing(false)} onSuccess={() => setIsEditing(false)} />
	}

	const contactDetails = [
		{ icon: <Globe size={24} />, value: company.website_url, label: "Website", link: true },
		{ icon: <Phone size={24} />, value: company.phone_number, label: "Phone" },
		{ icon: <Mail size={24} />, value: company.email, label: "Email" },
	].filter(
		(detail): detail is { icon: JSX.Element; value: string; label: string; link?: boolean } => detail.value !== null && detail.value !== undefined
	)

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6">
			<Card className="bg-aerial-white">
				<CardHeader className="space-y-4 bg-aerial-blue-lightest rounded-t-lg p-6">
					<div className="flex items-center space-x-4">
						<Avatar className="w-24 h-24 border-2 border-aerial-blue">
							{company.logo ? (
								<AvatarImage src={company.logo} alt={`${company.company_name} logo`} />
							) : (
								<AvatarFallback className="bg-aerial-blue text-aerial-white text-2xl">
									{company.company_name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
						<div>
							<CardTitle className="text-3xl font-bold text-aerial-dark_blue">{company.company_name}</CardTitle>
							<CardDescription className="text-xl text-aerial-slate">Company Profile</CardDescription>
						</div>
					</div>
					<Badge variant="default" className="text-md px-3 py-1">
						Verified Company
					</Badge>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					<div className="p-4">
						<h3 className="text-2xl font-semibold text-aerial-dark_blue mb-3">About Us</h3>
						<p className="text-aerial-slate-dark">{company.description || "No description available. Add your company's story here!"}</p>
					</div>
				</CardContent>
			</Card>

			{contactDetails.length > 0 && (
				<Card className="bg-aerial-white">
					<CardContent className="p-6">
						<h3 className="text-2xl font-semibold text-aerial-dark_blue mb-4">Contact Information</h3>
						<div className="space-y-4">
							{contactDetails.map((detail, index) => (
								<div key={index} className="flex items-center space-x-3 text-lg">
									<div className="text-aerial-blue">{detail.icon}</div>
									{detail.link ? (
										<a
											href={detail.value}
											target="_blank"
											rel="noopener noreferrer"
											className="text-aerial-blue hover:text-aerial-blue-dark flex items-center"
										>
											{detail.value} <ExternalLink className="ml-1" size={16} />
										</a>
									) : (
										<span className="text-aerial-slate-dark">{detail.value}</span>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			<Alert>
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Mobile App Display</AlertTitle>
				<AlertDescription className="text-gray-400">
					This is what customers will see on their mobile application. Only filled contact details are displayed.
				</AlertDescription>
			</Alert>

			<div className="flex justify-end">
				<Button onClick={() => setIsEditing(true)} className="text-lg px-6 py-3">
					Edit Company Profile
				</Button>
			</div>
		</div>
	)
}
