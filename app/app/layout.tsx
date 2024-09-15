import React from "react"
import Link from "next/link"
import { Home, Settings, Mail, User } from "lucide-react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-gray-100">
			{/* Left Navbar */}
			<nav className="w-16 bg-white shadow-md">
				<div className="flex flex-col items-center py-4 space-y-4">
					<Link href="/" className="p-2 rounded-lg hover:bg-gray-200">
						<Home className="w-6 h-6" />
					</Link>
					<Link href="/settings" className="p-2 rounded-lg hover:bg-gray-200">
						<Settings className="w-6 h-6" />
					</Link>
					<Link href="/messages" className="p-2 rounded-lg hover:bg-gray-200">
						<Mail className="w-6 h-6" />
					</Link>
					<Link href="/profile" className="p-2 rounded-lg hover:bg-gray-200">
						<User className="w-6 h-6" />
					</Link>
				</div>
			</nav>

			{/* Main Content Area */}
			<div className="flex flex-col flex-1">
				{/* Top Bar */}
				<header className="flex items-center justify-end h-16 px-4 bg-white shadow-sm">
					<Link href="/profile" className="p-2 rounded-lg hover:bg-gray-200">
						<User className="w-6 h-6" />
					</Link>
				</header>

				{/* Page Content */}
				<main className="flex-1 p-6 overflow-auto">{children}</main>
			</div>
		</div>
	)
}
