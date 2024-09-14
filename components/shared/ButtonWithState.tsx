import { Button } from "@/components/ui/button"

import { ReloadIcon } from "@radix-ui/react-icons"

interface ButtonWithStateProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string | React.ReactNode
	loading?: boolean
	loadingText?: string
}

const ButtonWithState = (props: ButtonWithStateProps) => {
	const { label, loading, loadingText, ...rest } = props

	let CurrentButton: React.ReactNode
	if (loading) {
		CurrentButton = (
			<Button disabled {...rest}>
				<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				{loadingText ? loadingText : label}
			</Button>
		)
	} else {
		CurrentButton = <Button {...rest}>{label}</Button>
	}
	return CurrentButton
}

export default ButtonWithState
