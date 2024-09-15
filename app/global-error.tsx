"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html>
			<body className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<div className="mb-8">
							<Image src="/500-illustration.svg" alt="500 Error Illustration" width={300} height={300} className="mx-auto" />
						</div>
						<CardTitle className="text-4xl font-extrabold text-center">Oops! Something went wrong</CardTitle>
						<CardDescription className="text-lg text-center mt-2">
							We're sorry, but we've encountered an unexpected error. Our team has been notified and is working on a solution.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center">
						<Button onClick={() => reset()} className="w-full max-w-xs bg-aerial-red hover:bg-aerial-red-dark">
							Try Again
						</Button>
						{error.digest && <p className="text-sm text-gray-500 mt-4">Error ID: {error.digest}</p>}
					</CardContent>
				</Card>
			</body>
		</html>
	)
}
