import { createServerSupabaseClient } from "./lib/supabase/client/serverClient"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	const supabase = createServerSupabaseClient()

	// Get the user from Supabase
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { pathname } = req.nextUrl

	// Protect routes starting with /company
	if (pathname.startsWith("/company")) {
		if (!user) {
			return NextResponse.redirect(new URL("/sign-in", req.url))
		}

		// If user has a company and tries to access create-company, redirect to company
		if (user) {
			const { data: companyData, error } = await supabase.from("companies").select("id").eq("user_id", user.id).single()

			if (companyData && pathname === "/company/create") {
				return NextResponse.redirect(new URL("/company", req.url))
			}

			if (!companyData && pathname !== "/company/create") {
				return NextResponse.redirect(new URL("/company/create", req.url))
			}
		}
	}

	// Redirect authenticated users from root to company
	if (pathname === "/" && user) {
		return NextResponse.redirect(new URL("/company", req.url))
	}

	return res
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
}
