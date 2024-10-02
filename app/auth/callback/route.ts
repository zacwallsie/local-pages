// app/auth/callback/route.ts

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/serverClient"

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")
	const origin = requestUrl.origin
	const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

	// Initialize the server-side Supabase client
	const supabase = createServerSupabaseClient()

	if (code) {
		// Exchange the auth code for a session
		const { data, error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			console.error("Error exchanging code for session:", error)
			// Redirect to sign-in with an error query parameter
			return NextResponse.redirect(`${origin}/sign-in?error=auth`)
		}

		// Optionally, you can set cookies or perform additional actions here
	}

	if (redirectTo) {
		// Validate the redirect path to prevent open redirect vulnerabilities
		const validPaths = ["/services", "/locations", "/company", "/"] // Add other valid paths as needed
		const isValidRedirect = validPaths.some((path) => redirectTo.startsWith(path))

		if (isValidRedirect) {
			return NextResponse.redirect(`${origin}${redirectTo}`)
		} else {
			console.warn(`Invalid redirect path attempted: ${redirectTo}`)
			// Redirect to a default safe page
			return NextResponse.redirect(`${origin}/company`)
		}
	}

	// URL to redirect to after sign-up process completes
	return NextResponse.redirect(`${origin}/company`)
}
