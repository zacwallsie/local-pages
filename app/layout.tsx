import "@/styles/globals.css"
import "leaflet/dist/leaflet.css"
import { Toaster } from "@/components/ui/toaster"
import app from "@/lib/app"

const defaultUrl = process.env.APP_URL ?? "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: app.name,
	description: app.description,
	icon: "/local-pages-logo.svg",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full">
			<head>
				<title>{app.name}</title>
				<meta name="description" content={app.description} />
				<link rel="icon" href="/local-pages-logo.svg" />
				<link rel="apple-touch-icon" href="/local-pages-logo.png" />
			</head>
			<body>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
