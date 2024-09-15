import Image from "next/image"
import BackButton from "@/components/shared/BackButton"
import HomeButton from "@/components/shared/HomeButton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
			<BackButton />
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="mb-8">
						<Image src="/404-illustration.svg" alt="404 Illustration" width={300} height={300} className="mx-auto" />
					</div>
					<CardTitle className="text-4xl font-extrabold text-center">Oops! Page Not Found</CardTitle>
					<CardDescription className="text-lg text-center">
						We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<HomeButton />
				</CardContent>
			</Card>
		</div>
	)
}
