import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputWithErrorProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string
	error?: string
	descriptionText?: string
}

export const InputWithError = (props: InputWithErrorProps) => {
	const { id, error, descriptionText, ...rest } = props

	const classes = ["bg-white"]

	if (error) {
		classes.push("destructive")
	}

	return (
		<div className="form-control w-full">
			<Input id={id} className={classes.join(" ")} {...rest} />
			{(error || descriptionText) && (
				<Label className={`label-text-alt ${error ? "text-red-500 border-red-500" : ""}`}>{error || descriptionText}</Label>
			)}
		</div>
	)
}
