import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/lib/actions"
import { InfoIcon } from "lucide-react"

export default async function ProtectedPage() {
	const supabase = createClient()

	// Get the authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/sign-in")
	}

	// Check if the user has a company attached
	const { data: companyData, error } = await supabase.from("companies").select("*").eq("user_id", user.id).single()

	if (error || !companyData) {
		// Redirect to company creation page if no company is found
		return redirect("/dashboard/create-company")
	}

	// Render the protected content
	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<div className="flex flex-col gap-2 items-start">
				<h2 className="font-bold text-2xl mb-4">Your user details</h2>
				<pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">{JSON.stringify(user, null, 2)}</pre>
			</div>
			<form action={signOutAction}>
				<Button>
					<InfoIcon size={16} />
					Logout
				</Button>
			</form>
		</div>
	)
}
