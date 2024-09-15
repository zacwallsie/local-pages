"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Info, Store, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "../shared/Logo"

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}

		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<header
			className={`z-50 fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out p-1 m-4
        ${isScrolled ? "bg-aerial-blue bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg" : "bg-transparent"}`}
		>
			<div className={`mx-auto px-4 py-2`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<Logo height={35} width={35} />
						</Link>
					</div>

					<nav className="hidden md:flex space-x-10 absolute left-1/2 transform -translate-x-1/2">
						<Link
							href="/about"
							className="text-aerial-white text-md transition-colors border-b-2 border-transparent hover:border-aerial-red"
						>
							About
						</Link>
						<Link
							href="/features"
							className="text-aerial-white text-md transition-colors border-b-2 border-transparent hover:border-aerial-red"
						>
							Features
						</Link>
						<Link
							href="/pricing"
							className="text-aerial-white text-md transition-colors border-b-2 border-transparent hover:border-aerial-red"
						>
							Pricing
						</Link>
					</nav>

					<div className="hidden md:flex items-center space-x-4">
						<Button variant="default" className="rounded-full">
							<Link href="/sign-in">Log In</Link>
						</Button>
						<Button variant="outline" className="rounded-full">
							<Link href="/sign-up">Sign Up</Link>
						</Button>
					</div>

					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden text-aerial-white">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="bg-aerial-darks-dark bg-opacity-50 text-aerial-white flex flex-col w-full">
							<div className="flex-grow">
								<nav className="grid gap-8 text-lg font-light">
									<Link href="/about" className="text-aerial-white hover:text-aerial-red transition-colors flex items-center gap-3">
										<Info size={24} />
										About
									</Link>
									<Link
										href="/features"
										className="text-aerial-white hover:text-aerial-red transition-colors flex items-center gap-3"
									>
										<Store size={24} />
										Features
									</Link>
									<Link
										href="/pricing"
										className="text-aerial-white hover:text-aerial-red transition-colors flex items-center gap-3"
									>
										<BarChart size={24} />
										Pricing
									</Link>
								</nav>
							</div>
							<div className="mt-auto mb-6 space-y-4">
								<Button variant="default" className="w-full text-lg py-6 text-aerial-white hover:text-aerial-red">
									<Link href="/login" className="flex items-center justify-center">
										Log In
									</Link>
								</Button>
								<Button variant="secondary" className="w-full text-lg py-6 bg-aerial-red hover:bg-aerial-red-light text-aerial-white">
									<Link href="/signup" className="flex items-center justify-center">
										Sign Up
									</Link>
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}

export default Navbar
