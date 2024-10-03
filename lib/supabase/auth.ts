import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"
import { createClient } from "@supabase/supabase-js"

export type AuthResult = { success: true; message: string } | { error: string }

export async function getUser() {
	const {
		data: { user },
		error,
	} = await supabaseClient.auth.getUser()

	return { user, error }
}

export async function getServerUser() {
	const supabase = createServerSupabaseClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	return { user, error }
}

export async function signUp(email: string, password: string, redirectTo: string): Promise<AuthResult> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: redirectTo,
		},
	})

	if (error) {
		console.error(`${error.code} ${error.message}`)
		return { error: error.message }
	} else {
		return { success: true, message: "Thanks for signing up! Please check your email for a verification link." }
	}
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return { error: error.message }
	}

	return { success: true, message: "Signed in successfully" }
}

export async function signOut() {
	const supabase = createServerSupabaseClient()
	return await supabase.auth.signOut()
}

export async function forgotPassword(email: string, redirectTo: string): Promise<AuthResult> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: redirectTo,
	})

	if (error) {
		return { error: "Could not reset password: " + error.message }
	}

	return { success: true, message: "Check your email for a link to reset your password." }
}

export async function resetPassword(password: string): Promise<AuthResult> {
	const supabase = createServerSupabaseClient()

	const { error } = await supabase.auth.updateUser({
		password: password,
	})

	if (error) {
		return { error: "Password update failed: " + error.message }
	}

	return { success: true, message: "Password updated successfully" }
}
