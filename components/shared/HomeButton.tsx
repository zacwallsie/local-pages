"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomeButton() {
	const router = useRouter()

	return (
		<Button onClick={() => router.push("/")} className="w-full bg-aerial-red hover:bg-aerial-red-dark">
			Return Home
		</Button>
	)
}
