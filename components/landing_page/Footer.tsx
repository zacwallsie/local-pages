import React from "react"
import Link from "next/link"
import { Button } from "../ui/button"

const MainFooter = () => {
	return (
		<footer className="bg-aerial-darks text-aerial-offwhite">
			<div className="w-full bg-aerial-darks-dark">
				<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-12">
					<div className="flex flex-col lg:flex-row justify-between items-center">
						<div className="text-center lg:text-left mb-6 lg:mb-0">
							<h3 className="text-2xl lg:text-3xl xl:text-4xl font-light">Ready to take your business to new heights?</h3>
						</div>
						<div className="flex items-center justify-center">
							<Button
								variant="secondary"
								className="bg-aerial-red hover:bg-aerial-red-light text-aerial-offwhite text-lg lg:text-xl xl:text-2xl py-3 px-6 lg:py-4 lg:px-8 xl:py-5 xl:px-10 transform transition-all duration-200"
							>
								<Link href="/signup">Create Your Business Profile</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-12">
				<div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
					<div className="col-span-2 md:col-span-4 lg:col-span-3">
						<h4 className="text-md lg:text-lg font-semibold mb-4 text-aerial-blue-light">Key Links</h4>
						<ul className="space-y-4">
							<li>
								<Link href="/about" className="text-xl lg:text-2xl xl:text-3xl hover:text-aerial-red-light transition-colors">
									Our Company
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-xl lg:text-2xl xl:text-3xl hover:text-aerial-red-light transition-colors">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href="/careers" className="text-xl lg:text-2xl xl:text-3xl hover:text-aerial-red-light transition-colors">
									Careers
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-span-1 md:col-span-4 lg:col-span-3">
						<h4 className="text-md lg:text-lg font-semibold mb-4 text-aerial-blue-light">Resources</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/blog" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/partners" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Partners
								</Link>
							</li>
							<li>
								<Link href="/community" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Community
								</Link>
							</li>
							<li>
								<Link href="/investors" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Investors
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-span-1 md:col-span-4 lg:col-span-3">
						<h4 className="text-md lg:text-lg font-semibold mb-4 text-aerial-blue-light">Support</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/faq" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/documentation" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Documentation
								</Link>
							</li>
							<li>
								<Link href="/training" className="text-lg xl:text-xl hover:text-aerial-red-light transition-colors">
									Training & Tutorials
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-aerial-darks-light pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="text-sm lg:text-base mb-4 md:mb-0">
							<p>© {new Date().getFullYear()} Pelican Pages. All rights reserved.</p>
						</div>
						<ul className="flex flex-wrap justify-center space-x-4">
							<li>
								<Link href="/terms" className="text-sm lg:text-base hover:text-aerial-blue-light transition-colors">
									Terms
								</Link>
							</li>
							<li>
								<Link href="/privacy" className="text-sm lg:text-base hover:text-aerial-blue-light transition-colors">
									Privacy
								</Link>
							</li>
							<li>
								<Link href="/cookies" className="text-sm lg:text-base hover:text-aerial-blue-light transition-colors">
									Cookies
								</Link>
							</li>
							<li>
								<Link href="/accessibility" className="text-sm lg:text-base hover:text-aerial-blue-light transition-colors">
									Accessibility
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default MainFooter
