// components/providers/SessionProvider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabaseClient } from "@/lib/supabase/client/client"
import { User, Subscription } from "@supabase/supabase-js"

interface SessionContextProps {
	user: User | null
	isLoading: boolean
}

const SessionContext = createContext<SessionContextProps>({
	user: null,
	isLoading: true,
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		let subscription: Subscription | undefined

		// Fetch the current user
		supabaseClient.auth.getUser().then(({ data: { user }, error }) => {
			if (error) {
				console.error("Error fetching user:", error)
			}
			setUser(user)
			setIsLoading(false)
		})

		// Listen for auth state changes
		const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
			setIsLoading(false)
		})

		// Assign the subscription
		if (data) {
			subscription = data.subscription
		}

		// Cleanup subscription on unmount
		return () => {
			if (subscription) {
				subscription.unsubscribe()
			}
		}
	}, [])

	return <SessionContext.Provider value={{ user, isLoading }}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
