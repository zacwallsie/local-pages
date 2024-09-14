import React from "react"
import { Navbar, Footer } from "@/components/landing_page"
import Image from "next/image"
import { Users, TrendingUp, Megaphone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const BusinessLandingPage = () => {
	return (
		<main className="flex flex-col min-h-screen bg-aerial-offwhite">
			<Navbar />

			{/* Hero Section */}
			<section className="w-full bg-gradient-to-r from-aerial-blue-light to-aerial-blue text-aerial-white py-24">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-light">Streamline Your Business Growth</h1>
							<p className="text-xl text-aerial-nude-light">
								Let us handle client acquisition and marketing, so you can focus on what matters most - your business and community.
							</p>
							<Button size="lg" className="bg-aerial-red hover:bg-aerial-red-light text-aerial-white font-normal transition-colors">
								Start Your Free Trial
							</Button>
						</div>
						<div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
							<Image
								src="/images/pelican-pages-mailbox-white-background.svg"
								alt="Business growth illustration"
								width={600}
								height={600}
								style={{ objectFit: "contain" }}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 w-full bg-aerial-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-light text-aerial-dark_blue mb-12 text-center">Powerful Tools for Business Growth</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{ icon: Users, title: "Client Acquisition", description: "Automate lead generation and client outreach." },
							{ icon: TrendingUp, title: "Increased Visibility", description: "Boost your local search presence and discoverability." },
							{
								icon: Megaphone,
								title: "Marketing Automation",
								description: "Streamline your marketing efforts with intelligent workflows.",
							},
							{
								icon: Clock,
								title: "Time-Saving Solutions",
								description: "Focus on your core business while we handle the busy work.",
							},
						].map((feature, index) => (
							<Card key={index} className="bg-aerial-offwhite border-aerial-blue-light hover:border-aerial-red transition-colors">
								<CardHeader>
									<feature.icon className="h-8 w-8 text-aerial-blue" />
									<CardTitle className="text-lg font-normal text-aerial-dark_blue">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-aerial-slate text-sm">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Testimonial Section */}
			<section className="py-20 w-full bg-aerial-nude-light">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-light mb-12 text-aerial-dark_blue">What Business Owners Say</h2>
					<div className="max-w-2xl mx-auto">
						<blockquote className="text-xl italic text-aerial-slate-dark mb-4">
							"This platform has revolutionized how we connect with clients. Our local visibility has skyrocketed, and the marketing
							automation tools have saved us countless hours."
						</blockquote>
						<p className="font-semibold text-aerial-dark_blue">- Sarah Johnson, Local Cafe Owner</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 w-full bg-aerial-blue-dark text-aerial-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-light mb-6">Ready to Transform Your Business?</h2>
					<p className="text-lg text-aerial-blue-lightest mb-8">Join thousands of businesses already thriving on our platform.</p>
					<Button
						size="lg"
						className="bg-aerial-red hover:bg-aerial-red-light text-aerial-white font-normal text-lg px-8 py-3 transition-colors"
					>
						Get Started Now
					</Button>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default BusinessLandingPage
