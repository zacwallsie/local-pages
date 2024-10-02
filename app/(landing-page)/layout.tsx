import "@/styles/globals.css"
import { Footer, Navbar } from "@/components/landing_page"

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex flex-col min-h-screen bg-aerial-offwhite">
			<Navbar />
			{children}
			<Footer />
		</main>
	)
}
