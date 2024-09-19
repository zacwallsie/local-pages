import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export const updateSession = async (request: NextRequest) => {
	// This `try/catch` block is only here for the interactive tutorial.
	// Feel free to remove once you have Supabase connected.
	try {
		// Create an unmodified response
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		})

		const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					response = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
				},
			},
		})

		// This will refresh session if expired - required for Server Components
		const {
			data: { user: userData },
			error: userError,
		} = await supabase.auth.getUser()

		// Only protect routes that start with /dashboard
		if (request.nextUrl.pathname.startsWith("/dashboard")) {
			if (!userData || userError) {
				return NextResponse.redirect(new URL("/sign-in", request.url))
			}

			// Check if the user already has a company
			const { data: companyData } = await supabase.from("companies").select("id").eq("user_id", userData.id).single()

			// Redirect to dashboard if user tries to access create-company page when they already have a company
			if (companyData && request.nextUrl.pathname === "/dashboard/create-company") {
				return NextResponse.redirect(new URL("/dashboard", request.url))
			}

			// Redirect to create company page if no company exists and not already on create company page
			if (!companyData && !request.nextUrl.pathname.startsWith("/dashboard/create-company")) {
				return NextResponse.redirect(new URL("/dashboard/create-company", request.url))
			}
		}

		// Redirect authenticated users to dashboard if accessing the root
		if (request.nextUrl.pathname === "/" && userData && !userError) {
			return NextResponse.redirect(new URL("/dashboard", request.url))
		}

		return response
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		})
	}
}
