import "@/styles/globals.css"
import app from "@/lib/app"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"

const defaultUrl = process.env.APP_URL ?? "http://localhost:3000"

interface AuthLayoutProps {
	children: React.ReactNode
	heading?: string
	description?: string
}

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: app.name,
	description: app.description,
	icon: "/pelican-pages-logo.svg",
}

export default function AuthLayout({ children, heading, description }: AuthLayoutProps) {
	return (
		<html lang="en" className="h-full">
			<head>
				<title>{app.name}</title>
				<meta name="description" content={app.description} />
				<link rel="icon" href="/pelican-pages-logo.svg" />
				<link rel="apple-touch-icon" href="/pelican-pages-logo.png" />
			</head>
			<body>
				<div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-gray-50">
					<div className="flex">
						<Link href="/" className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
							<ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1 group-hover:scale-110" size={20} />
							<span className="transition-transform group-hover:-translate-x-1">Back</span>
						</Link>
						<div className="mx-auto w-[400px] gap-6 my-40">
							<div className="gap-2 mb-8">
								<Image src={app.logoUrl} className="mx-auto" alt={app.name} width={200} height={200} quality={100} loading="lazy" />
								{heading && <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{heading}</h2>}
								{description && <p className="text-center text-gray-600 dark:text-white">{description}</p>}
							</div>
							<div className="gap-4">{children}</div>
						</div>
					</div>
					<div className="hidden bg-muted lg:block">
						<Image
							src="/pexel-images/pexels-tomfisk-1131868.jpg"
							alt="auth-background-image"
							quality={100}
							className="min-h-screen w-full object-cover"
							loading="lazy"
							width={10000}
							height={10000}
						/>
					</div>
				</div>
			</body>
		</html>
	)
}
