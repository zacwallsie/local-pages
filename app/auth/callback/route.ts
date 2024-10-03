"use server"

import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/client/serverClient"

/**
 * Handles the authentication callback by exchanging the authorization code for a session
 * and redirecting the user to the appropriate page based on query parameters.
 *
 * @param {Request} request - The incoming GET request from the authentication callback.
 * @returns {Promise<Response>} A NextResponse object redirecting the user.
 */
export async function GET(request: Request): Promise<Response> {
	// Parse the incoming request URL
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")
	const origin = requestUrl.origin
	const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString()

	// Initialize the server-side Supabase client
	const supabase = createServerSupabaseClient()

	// If an authorization code is present, attempt to exchange it for a session
	if (code) {
		try {
			// Exchange the auth code for a session
			const { data, error } = await supabase.auth.exchangeCodeForSession(code)

			if (error) {
				console.error("Error exchanging code for session:", error)
				// Redirect to sign-in with an error query parameter
				return NextResponse.redirect(`${origin}/sign-in?error=auth`)
			}

			// Optionally, you can set cookies or perform additional actions here
			// Example: Set a session cookie or update user state
		} catch (error) {
			console.error("Unexpected error during code exchange:", error)
			// Redirect to sign-in with a generic error query parameter
			return NextResponse.redirect(`${origin}/sign-in?error=unexpected`)
		}
	}

	// If a redirect path is provided, validate and perform the redirect
	if (redirectTo) {
		// Define valid redirect paths to prevent open redirect vulnerabilities
		const validPaths = ["/services", "/locations", "/company", "/"] // Add other valid paths as needed
		const isValidRedirect = validPaths.some((path) => redirectTo.startsWith(path))

		if (isValidRedirect) {
			// Perform the redirect to the specified valid path
			return NextResponse.redirect(`${origin}${redirectTo}`)
		} else {
			console.warn(`Invalid redirect path attempted: ${redirectTo}`)
			// Redirect to a default safe page to mitigate potential security risks
			return NextResponse.redirect(`${origin}/company`)
		}
	}

	// Default redirect URL after the sign-up process completes
	return NextResponse.redirect(`${origin}/company`)
}
