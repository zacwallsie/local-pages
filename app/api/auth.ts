"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { signUp, signIn, signOut, forgotPassword, resetPassword, AuthResult } from "@/lib/supabase/auth"

export async function signUpAction(formData: FormData): Promise<AuthResult> {
	const email = formData.get("email") as string
	const password = formData.get("password") as string
	const origin = headers().get("origin")
	const redirectTo = `${origin}/auth/callback`

	return await signUp(email, password, redirectTo)
}

export async function signInAction(formData: FormData): Promise<AuthResult> {
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	return await signIn(email, password)
}

export async function signOutAction() {
	await signOut()
	return redirect("/sign-in")
}

export async function forgotPasswordAction(formData: FormData): Promise<AuthResult> {
	const email = formData.get("email") as string
	const origin = headers().get("origin")
	const redirectTo = `${origin}/auth/callback?redirect_to=/company/reset-password`

	return await forgotPassword(email, redirectTo)
}

export async function resetPasswordAction(formData: FormData): Promise<AuthResult> {
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	if (password !== confirmPassword) {
		return { error: "Passwords do not match" }
	}

	return await resetPassword(password)
}
