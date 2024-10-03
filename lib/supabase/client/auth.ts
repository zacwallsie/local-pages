// lib/supabase/auth.ts

import { createServerSupabaseClient } from "./serverClient"
import { supabaseClient } from "./client"

/**
 * Represents the result of an authentication operation.
 * It can either indicate success with a message or contain an error message.
 *
 * @type {AuthResult}
 */
export type AuthResult = { success: true; message: string } | { error: string }

/**
 * Retrieves the currently authenticated user from the client-side Supabase instance.
 *
 * @async
 * @function getUser
 * @returns {Promise<{ user: import("@supabase/supabase-js").User | null; error: import("@supabase/supabase-js").AuthError | null }>}
 * An object containing the user data and any potential error.
 */
export async function getUser() {
	const {
		data: { user },
		error,
	} = await supabaseClient.auth.getUser()

	return { user, error }
}

/**
 * Retrieves the currently authenticated user from the server-side Supabase instance.
 *
 * @async
 * @function getServerUser
 * @returns {Promise<{ user: import("@supabase/supabase-js").User | null; error: import("@supabase/supabase-js").AuthError | null }>}
 * An object containing the user data and any potential error.
 */
export async function getServerUser() {
	const supabase = createServerSupabaseClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	return { user, error }
}

/**
 * Registers a new user with the provided email and password.
 * Sends a verification email to the user with a redirect URL upon successful registration.
 *
 * @async
 * @function signUp
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} redirectTo - The URL to redirect the user after email verification.
 * @returns {Promise<AuthResult>}
 * An object indicating success with a message or containing an error message.
 */
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
		console.error(`Sign Up Error [${error.code}]: ${error.message}`)
		return { error: error.message }
	} else {
		return { success: true, message: "Thanks for signing up! Please check your email for a verification link." }
	}
}

/**
 * Authenticates a user with the provided email and password.
 *
 * @async
 * @function signIn
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<AuthResult>}
 * An object indicating success with a message or containing an error message.
 */
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

/**
 * Signs out the currently authenticated user.
 *
 * @async
 * @function signOut
 * @returns {Promise<{ error: import("@supabase/supabase-js").AuthError | null }>}
 * An object containing any potential error during the sign-out process.
 */
export async function signOut() {
	const supabase = createServerSupabaseClient()
	return await supabase.auth.signOut()
}

/**
 * Initiates a password reset process for the user with the provided email.
 * Sends a password reset email with a redirect URL.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - The user's email address.
 * @param {string} redirectTo - The URL to redirect the user after password reset.
 * @returns {Promise<AuthResult>}
 * An object indicating success with a message or containing an error message.
 */
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

/**
 * Resets the authenticated user's password to the provided new password.
 *
 * @async
 * @function resetPassword
 * @param {string} password - The new password to set for the user.
 * @returns {Promise<AuthResult>}
 * An object indicating success with a message or containing an error message.
 */
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
