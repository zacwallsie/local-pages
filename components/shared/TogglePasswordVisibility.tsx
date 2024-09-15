import React from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

interface TogglePasswordVisibilityProps {
	isPasswordVisible: boolean
	handlePasswordVisibility: () => void
}

export const TogglePasswordVisibility: React.FC<TogglePasswordVisibilityProps> = ({ isPasswordVisible, handlePasswordVisibility }) => {
	return (
		<Button onClick={handlePasswordVisibility} className="bg-primary flex pointer items-center text-white" type="button">
			{!isPasswordVisible ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
		</Button>
	)
}
