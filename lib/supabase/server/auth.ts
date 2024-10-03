"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { signUp, signIn, signOut, forgotPassword, resetPassword, AuthResult } from "@/lib/supabase/client/auth"

/**
 * Extracts a string value from FormData.
 *
 * @param formData - The FormData object containing form inputs.
 * @param key - The key of the form input to extract.
 * @returns {string} The extracted string value.
 * @throws Will throw an error if the key is not found or the value is not a string.
 */
const getFormDataValue = (formData: FormData, key: string): string => {
	const value = formData.get(key)
	if (typeof value !== "string") {
		throw new Error(`Invalid or missing value for "${key}".`)
	}
	return value
}

/**
 * Generates a redirect URL based on the current origin.
 *
 * @param path - The path to append to the origin for redirection.
 * @returns {string} The complete redirect URL.
 */
const generateRedirectUrl = (path: string = ""): string => {
	const origin = headers().get("origin") || ""
	return `${origin}${path}`
}

/**
 * Handles user sign-up by creating a new account.
 *
 * @param formData - The FormData object containing user inputs.
 * @returns {Promise<AuthResult>} The result of the sign-up operation.
 */
export const signUpAction = async (formData: FormData): Promise<AuthResult> => {
	try {
		const email = getFormDataValue(formData, "email")
		const password = getFormDataValue(formData, "password")
		const redirectTo = generateRedirectUrl("/auth/callback")

		const result = await signUp(email, password, redirectTo)
		return result
	} catch (error) {
		console.error("SignUpAction Error:", error)
		return { error: "Failed to sign up. Please try again later." }
	}
}

/**
 * Handles user sign-in by authenticating the user.
 *
 * @param formData - The FormData object containing user inputs.
 * @returns {Promise<AuthResult>} The result of the sign-in operation.
 */
export const signInAction = async (formData: FormData): Promise<AuthResult> => {
	try {
		const email = getFormDataValue(formData, "email")
		const password = getFormDataValue(formData, "password")

		const result = await signIn(email, password)
		return result
	} catch (error) {
		console.error("SignInAction Error:", error)
		return { error: "Failed to sign in. Please check your credentials." }
	}
}

/**
 * Handles user sign-out by terminating the session.
 *
 * @returns {Promise<void>} Redirects the user to the sign-in page upon successful sign-out.
 */
export const signOutAction = async (): Promise<void> => {
	try {
		await signOut()
		redirect("/sign-in")
	} catch (error) {
		console.error("SignOutAction Error:", error)
		redirect("/error")
	}
}

/**
 * Initiates the password reset process by sending a reset link to the user's email.
 *
 * @param formData - The FormData object containing user inputs.
 * @returns {Promise<AuthResult>} The result of the forgot password operation.
 */
export const forgotPasswordAction = async (formData: FormData): Promise<AuthResult> => {
	try {
		const email = getFormDataValue(formData, "email")
		const redirectTo = generateRedirectUrl("/auth/callback?redirect_to=/company/reset-password")

		const result = await forgotPassword(email, redirectTo)
		return result
	} catch (error) {
		console.error("ForgotPasswordAction Error:", error)
		return {
			error: "Failed to initiate password reset. Please ensure the email is correct.",
		}
	}
}

/**
 * Resets the user's password after validating the input.
 *
 * @param formData - The FormData object containing user inputs.
 * @returns {Promise<AuthResult>} The result of the reset password operation.
 */
export const resetPasswordAction = async (formData: FormData): Promise<AuthResult> => {
	try {
		const password = getFormDataValue(formData, "password")
		const confirmPassword = getFormDataValue(formData, "confirmPassword")

		if (password !== confirmPassword) {
			return { error: "Passwords do not match." }
		}

		const result = await resetPassword(password)
		return result
	} catch (error) {
		console.error("ResetPasswordAction Error:", error)
		return { error: "Failed to reset password. Please try again later." }
	}
}
