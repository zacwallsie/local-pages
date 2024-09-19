"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { Company } from "@/types/company"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function ClientDashboard() {
	const [companies, setCompanies] = useState<Company[]>([])
	const { toast } = useToast()
	const router = useRouter()
	const supabase = createClient()

	useEffect(() => {
		async function fetchCompanies() {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser()

			if (userError) {
				toast({
					variant: "destructive",
					title: "Authentication Error",
					description: userError.message,
				})
				router.push("/sign-in")
				return
			}

			if (!user) {
				router.push("/sign-in")
				return
			}

			const { data: companiesData, error: companiesError } = await supabase.from("companies").select("*").eq("users", user.id)

			if (companiesError) {
				toast({
					variant: "destructive",
					title: "Data Fetch Error",
					description: companiesError.message,
				})
				return
			}

			setCompanies((companiesData as Company[]) || [])
		}

		fetchCompanies()
	}, [supabase, toast, router])

	return <Dashboard companies={companies} />
}
