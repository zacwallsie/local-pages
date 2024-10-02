// lib/supabase/auth.ts
import { supabaseClient } from "./client"
import { createServerSupabaseClient } from "./serverClient"

export const getUser = async () => {
	const {
		data: { user },
		error,
	} = await supabaseClient.auth.getUser()

	return { user, error }
}

export const signIn = async (email: string, password: string) => {
	const { data, error } = await supabaseClient.auth.signInWithPassword({
		email,
		password,
	})

	return { data, error }
}

export const signOut = async () => {
	const { error } = await supabaseClient.auth.signOut()
	return { error }
}

// Server-side user retrieval
export const getServerUser = async () => {
	const supabase = createServerSupabaseClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	return { user, error }
}
