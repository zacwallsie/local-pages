import React from "react"
import { cn } from "@/lib/utils"

interface StepProps {
	icon: React.ElementType
	title: string
	description: string
}

export const Step: React.FC<StepProps> = ({ icon: Icon, title, description }) => {
	return (
		<div className="flex flex-col">
			<div className="flex items-center space-x-3">
				<div className="flex-shrink-0">
					<Icon className="h-6 w-6 text-blue-500" />
				</div>
				<h3 className="text-sm font-medium">{title}</h3>
			</div>
			<p className="text-sm text-gray-500 pl-9">{description}</p>
		</div>
	)
}

interface StepsProps {
	children: React.ReactNode
	className?: string
}

export const Steps: React.FC<StepsProps> = ({ children, className }) => {
	const steps = React.Children.toArray(children)

	return (
		<div className={cn("space-y-6", className)}>
			{steps.map((step, index) => (
				<div key={index} className="relative flex items-start">
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mr-4 flex-shrink-0">
						{index + 1}
					</div>
					<div className="flex-grow pt-1">{step}</div>
					{index < steps.length - 1 && (
						<div
							className="absolute left-4 top-8 h-10 bottom-0 w-0.5 bg-blue-200 sm:flex hidden"
							style={{ transform: "translateX(-50%)" }}
						/>
					)}
				</div>
			))}
		</div>
	)
}
