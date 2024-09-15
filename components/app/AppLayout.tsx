// AppLayout.tsx
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Mail, User, LucideIcon, UserCircle, Bell, LogOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from "../shared/Logo"

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
					<Icon className={`w-5 h-5 ${isActive ? "text-aerial-blue-darkest" : "text-aerial-slate-dark"}`} />
				</Link>
			</TooltipTrigger>
			<TooltipContent
				side="right"
				className="bg-aerial-dark_blue-dark text-aerial-white border-aerial-dark_blue-dark py-1 px-2 ml-3 mb-6 text-xs"
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

	return (
		<>
			{/* Left Navbar */}
			<nav className="w-12 bg-aerial-white shadow-sm border-r border-gray-200 relative">
				<div className="flex flex-col items-center py-3 space-y-3">
					<Link href="/app">
						<Logo height={25} width={25} className="bg-aerial-red rounded-full p-1.5" />
					</Link>
					<NavIcon href="/app" icon={Home} label="Home" isActive={pathname === "/app"} />
					<NavIcon href="/settings" icon={Settings} label="Settings" isActive={pathname === "/settings"} />
					<NavIcon href="/messages" icon={Mail} label="Messages" isActive={pathname === "/messages"} />
				</div>
			</nav>

			{/* Main Content Area */}
			<div className="flex flex-col flex-1 relative bg-aerial-offwhite">
				{/* Profile Dropdown */}
				<div className="absolute top-4 right-4 z-10">
					<DropdownMenu>
						<DropdownMenuTrigger className="w-8 h-8 bg-aerial-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-aerial-blue-lightest transition-colors">
							<User className="w-5 h-5 text-aerial-blue-dark" />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-aerial-white" align="end" alignOffset={-8} forceMount>
							<DropdownMenuItem className="hover:bg-aerial-blue-lightest">
								<UserCircle className="mr-2 h-4 w-4 text-aerial-blue-dark" />
								<span className="text-aerial-darks-light">Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-aerial-blue-lightest">
								<Settings className="mr-2 h-4 w-4 text-aerial-blue-dark" />
								<span className="text-aerial-darks-light">Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-aerial-blue-lightest">
								<Bell className="mr-2 h-4 w-4 text-aerial-blue-dark" />
								<span className="text-aerial-darks-light">Notifications</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-aerial-blue-lightest" />
							<DropdownMenuItem className="hover:bg-aerial-red-lightest">
								<LogOut className="mr-2 h-4 w-4 text-aerial-red-dark" />
								<span className="text-aerial-red-dark">Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Page Content */}
				<main className="flex-1 p-6 overflow-auto mt-16">{children}</main>
			</div>
		</>
	)
}

export default AppLayout
