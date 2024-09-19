import "@/styles/globals.css"
import app from "@/lib/app"
import BackButton from "@/components/shared/BackButton"
import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-gray-50">
			<div className="flex">
				<BackButton />
				<div className="mx-auto w-[400px] gap-6 my-40">
					<div className="gap-2 mb-8">
						<div className="flex items-center justify-center">
							<div className="relative w-[260px] h-[260px]">
								<div className="absolute inset-0 bg-aerial-red rounded-full"></div>
								<Link href="/">
									<div className="absolute inset-0 flex items-center justify-center">
										<Image
											src={app.logoUrl}
											alt={app.name}
											width={200}
											height={200}
											quality={100}
											loading="lazy"
											className="transition-all hover:scale-110"
										/>
									</div>
								</Link>
							</div>
						</div>
						{children}
					</div>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src="/pexel-images/pexels-tomfisk-1131868.jpg"
					alt="auth-background-image"
					quality={100}
					className="h-full w-full object-cover"
					priority
					width={1920}
					height={1080}
				/>
			</div>
		</div>
	)
}
