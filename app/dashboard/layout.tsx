import React from "react"
import AppLayout from "@/components/dashboard/AppLayout"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-gray-100">
			<AppLayout>{children}</AppLayout>
		</div>
	)
}
