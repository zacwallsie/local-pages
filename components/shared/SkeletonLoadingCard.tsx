import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLoadingCard() {
	return (
		<Card className="w-full bg-aerial-white">
			<CardContent className="p-6">
				<div className="space-y-4">
					<Skeleton className="h-16 w-full" /> {/* Larger skeleton for title */}
					<Skeleton className="h-8 w-full" /> {/* Longer, thin skeleton for description */}
					<Skeleton className="h-8 w-3/4" /> {/* Shorter, thin skeleton for additional info */}
				</div>
			</CardContent>
		</Card>
	)
}
