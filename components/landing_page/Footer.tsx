import React from "react"
import Link from "next/link"
import { Button } from "../ui/button"

const MainFooter = () => {
	return (
		<footer className="bg-aerial-darks-dark border-t border-aerial-darks-light pt-20 pb-10">
			<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-10">
					<div className="col-span-1 md:col-span-2">
						<h2 className="text-2xl md:text-3xl text-aerial-offwhite mb-6">Starting with Local Pages is simple, fast, and free.</h2>
						<div className="flex flex-col sm:flex-row gap-4">
							<Button variant="default" size="lg" className="rounded-full bg-aerial-blue hover:bg-aerial-blue-dark text-aerial-white">
								<Link href="/sign-up">Start for free</Link>
							</Button>
							<Button
								variant="secondary"
								size="lg"
								className="rounded-full bg-aerial-darks-light hover:bg-aerial-darks text-aerial-offwhite"
							>
								<Link href="/demo">Book a demo</Link>
							</Button>
						</div>
					</div>

					<div className="col-span-1">
						<h3 className="text-aerial-slate-light uppercase mb-4">Products</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/features" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Features
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Pricing
								</Link>
							</li>
							<li>
								<Link href="/integrations" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Integrations
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-1">
						<h3 className="text-aerial-slate-light uppercase mb-4">Resources</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/blog" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/documentation" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Documentation
								</Link>
							</li>
							<li>
								<Link href="/community" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Community
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-1">
						<h3 className="text-aerial-slate-light uppercase mb-4">Company</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/about" className="text-aerial-offwhite hover:text-aerial-blue-light">
									About
								</Link>
							</li>
							<li>
								<Link href="/careers" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Careers
								</Link>
							</li>
							<li>
								<Link href="/partners" className="text-aerial-offwhite hover:text-aerial-blue-light">
									Partners
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-16 pt-8 border-t border-aerial-darks flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<img src="/local-pages-logo.svg" alt="Local Pages Logo" className="h-8" />
					</div>
					<div className="flex flex-wrap justify-center gap-6">
						<Link href="/terms" className="text-aerial-slate hover:text-aerial-offwhite text-sm">
							Terms of use
						</Link>
						<Link href="/privacy" className="text-aerial-slate hover:text-aerial-offwhite text-sm">
							Privacy policy
						</Link>
						<Link href="/security" className="text-aerial-slate hover:text-aerial-offwhite text-sm">
							Security
						</Link>
					</div>
					<div className="text-aerial-slate text-sm mt-4 md:mt-0">© {new Date().getFullYear()} Local Pages</div>
				</div>
			</div>
		</footer>
	)
}

export default MainFooter
