import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorProps {
	message?: string
}

const Error = (props: ErrorProps) => {
	const { message } = props

	return (
		<Alert variant="destructive">
			<ExclamationTriangleIcon className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	)
}

export default Error
