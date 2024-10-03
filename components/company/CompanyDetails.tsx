// components/company/CompanyDetails.tsx

"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Company, User } from "@/types/supabase"
import { UpdateCompanyForm } from "./UpdateCompanyForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Phone, Globe, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabaseClient } from "@/lib/supabase/client/client"
import { useToast } from "@/hooks/use-toast"
import { SkeletonLoadingCard } from "@/components/shared/SkeletonLoadingCard"

interface CompanyDetailsProps {
	company: Company
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company }) => {
	const { toast } = useToast()

	const [isEditing, setIsEditing] = useState(false)
	const [companyData, setCompanyData] = useState<Company>(company)
	const [loading, setLoading] = useState(false)

	// Function to fetch the latest company data from Supabase
	const fetchCompany = useCallback(async () => {
		setLoading(true)
		try {
			const { data, error } = await supabaseClient.from("companies").select("*").eq("id", company.id).single()

			if (error) {
				console.error("Error fetching company:", error.message)
				toast({
					variant: "destructive",
					title: "Error",
					description: "Failed to fetch updated company data.",
				})
			} else {
				setCompanyData(data)
			}
		} catch (err) {
			console.error("Unexpected error fetching company:", err)
			toast({
				variant: "destructive",
				title: "Error",
				description: "An unexpected error occurred while fetching company data.",
			})
		} finally {
			setLoading(false)
		}
	}, [company.id, supabaseClient, toast])

	// Handler called upon successful update
	function onSuccess() {
		setIsEditing(false)
		fetchCompany() // Refresh the company data
	}

	// Refetch company data when the component mounts or when the company prop changes
	useEffect(() => {
		if (company.id !== companyData.id) {
			fetchCompany()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company.id])

	if (isEditing) {
		return <UpdateCompanyForm company={companyData} onCancel={() => setIsEditing(false)} onSuccess={onSuccess} />
	}

	const contactDetails = [
		{ icon: <Globe size={24} />, value: companyData.website_url, label: "Website", link: true },
		{ icon: <Phone size={24} />, value: companyData.phone_number, label: "Phone" },
		{ icon: <Mail size={24} />, value: companyData.email, label: "Email" },
	].filter(
		(detail): detail is { icon: JSX.Element; value: string; label: string; link?: boolean } =>
			detail.value !== null && detail.value !== undefined && detail.value !== ""
	)

	if (loading) {
		return (
			<div className="w-full space-y-6">
				<SkeletonLoadingCard />
				<SkeletonLoadingCard />
			</div>
		)
	}

	return (
		<div className="w-full space-y-6">
			<Card className="bg-aerial-white">
				<CardHeader className="space-y-4 bg-aerial-blue-lightest rounded-t-lg p-6">
					<div className="flex items-center space-x-4">
						<Avatar className="w-24 h-24 border-2 border-aerial-blue">
							{companyData.logo ? (
								<AvatarImage src={companyData.logo} alt={`${companyData.company_name} logo`} />
							) : (
								<AvatarFallback className="bg-aerial-blue text-aerial-white text-2xl">
									{companyData.company_name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
						<div>
							<CardTitle className="text-3xl font-bold text-aerial-dark_blue">{companyData.company_name}</CardTitle>
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
						<p className="text-aerial-slate-dark">
							{companyData.description || "No description available. Add your company's story here!"}
						</p>
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
											href={detail.value.startsWith("http") ? detail.value : `https://${detail.value}`}
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
