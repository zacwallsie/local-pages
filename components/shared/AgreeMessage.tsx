import React from "react"
import Link from "next/link"

interface AgreeMessageProps {
	text: string
	termsUrl?: string
	privacyUrl?: string
}

export const AgreeMessage: React.FC<AgreeMessageProps> = ({
	text,
	termsUrl = process.env.NEXT_PUBLIC_TERMS_URL || "/terms",
	privacyUrl = process.env.NEXT_PUBLIC_PRIVACY_URL || "/privacy",
}) => {
	return (
		<p className="text-sm text-center">
			By clicking {text}, you agree to our{" "}
			<Link
				rel="noopener noreferrer"
				target="_blank"
				href={termsUrl}
				className="underline font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]"
			>
				Terms
			</Link>{" "}
			and{" "}
			<Link
				rel="noopener noreferrer"
				target="_blank"
				href={privacyUrl}
				className="underline font-medium text-primary hover:text-[color-mix(in_oklab,oklch(var(--p)),black_7%)]"
			>
				Privacy Policy
			</Link>
		</p>
	)
}
