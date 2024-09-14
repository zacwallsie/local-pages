import app from "@/lib/app"
import Image from "next/image"

interface LogoProps {
	className?: string
	width?: number
	height?: number
}

const Logo: React.FC<LogoProps> = ({ className = "", width = 100, height = 100 }) => {
	return (
		<div className={className}>
			<Image src="/pelican-pages-logo.svg" alt="Logo" width={width} height={height} />
		</div>
	)
}

export default Logo
