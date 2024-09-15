"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {
	const router = useRouter()

	const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		router.back()
	}

	return (
		<Link
			href="#"
			onClick={handleBack}
			className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
		>
			<ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1 group-hover:scale-110" size={20} />
			<span className="transition-transform group-hover:-translate-x-1">Back</span>
		</Link>
	)
}
