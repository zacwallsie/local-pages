"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, MapPinned, User, LucideIcon, UserCircle, Building2, LogOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from "../shared/Logo"
import { signOutAction } from "@/lib/actions"

interface NavIconProps {
	href: string
	icon: LucideIcon
	label: string
	isActive: boolean
}

const NavIcon: React.FC<NavIconProps> = ({ href, icon: Icon, label, isActive }) => (
	<TooltipProvider delayDuration={100}>
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={href}
					className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-aerial-blue-light" : "hover:bg-aerial-blue-lightest"}`}
				>
					<Icon className={`w-6 h-6 ${isActive ? "text-aerial-blue-darkest" : "text-aerial-slate-dark"}`} />
				</Link>
			</TooltipTrigger>
			<TooltipContent
				side="right"
				className="z-50 bg-aerial-dark_blue-dark text-aerial-white border-aerial-dark_blue-dark py-1 px-2 ml-3 mb-6 text-xs"
				sideOffset={0}
			>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
)

interface AppLayoutProps {
	children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const pathname = usePathname()

	const isActiveRoute = (route: string) => {
		return pathname.startsWith(route)
	}

	const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		const form = event.currentTarget.closest("form")
		if (form) {
			form.requestSubmit()
		}
	}

	return (
		<>
			{/* Left Navbar */}
			<nav className="w-14 bg-aerial-white shadow-sm border-r border-gray-200 relative">
				<div className="flex flex-col items-center py-3 space-y-3">
					<Link href="/dashboard">
						<Logo height={30} width={30} className="bg-aerial-red rounded-full p-1.5" />
					</Link>
					<NavIcon href="/dashboard/company" icon={Building2} label="Company" isActive={isActiveRoute("/dashboard/company")} />
					<NavIcon href="/dashboard/locations" icon={MapPinned} label="Locations" isActive={isActiveRoute("/dashboard/locations")} />
				</div>
			</nav>

			{/* Main Content Area */}
			<div className="flex flex-col flex-1 relative bg-aerial-offwhite">
				{/* Profile Dropdown */}
				<div className="absolute top-4 right-4 z-50">
					<DropdownMenu>
						<DropdownMenuTrigger className="w-8 h-8 bg-aerial-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-aerial-blue-lightest transition-colors">
							<User className="w-5 h-5 text-aerial-blue-dark" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-aerial-white" align="end" alignOffset={-8} forceMount>
							<Link href="/dashboard/company">
								<DropdownMenuItem className="hover:bg-aerial-blue-lightest">
									<Building2 className="mr-2 h-4 w-4 text-aerial-blue-dark" />
									<span className="text-aerial-darks-light">Your Company</span>
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/locations">
								<DropdownMenuItem className="hover:bg-aerial-blue-lightest">
									<MapPinned className="mr-2 h-4 w-4 text-aerial-blue-dark" />
									<span className="text-aerial-darks-light">Locations</span>
								</DropdownMenuItem>
							</Link>
							<DropdownMenuSeparator className="bg-aerial-blue-lightest" />
							<form action={signOutAction}>
								<DropdownMenuItem className="hover:bg-aerial-red-lightest" asChild>
									<button onClick={handleLogout} className="w-full text-left">
										<LogOut className="mr-2 h-4 w-4 text-aerial-red-dark" />
										<span className="text-aerial-red-dark">Log out</span>
									</button>
								</DropdownMenuItem>
							</form>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Page Content */}
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</>
	)
}

export default AppLayout
