import React from "react"
import Image from "next/image"
import { Users, TrendingUp, Megaphone, Clock, UserPlus, Briefcase, Smartphone, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const BusinessLandingPage = () => {
	return (
		<>
			{/* Hero Section */}
			<section className="w-full bg-gradient-to-r from-aerial-blue-light to-aerial-blue text-aerial-white py-24">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-light">Connect Your Business with Local Customers Effortlessly</h1>
							<p className="text-xl text-aerial-nude-light">
								Create your business profile, showcase your services, and expand your reach with Local Pages.
							</p>
							<Button size="lg" className="bg-aerial-red hover:bg-aerial-red-light text-aerial-white font-normal transition-colors">
								Get Started Free
							</Button>
						</div>
						<div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
							<Image
								src="/images/local-pages-mailbox.svg"
								alt="Local Pages app illustration"
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
					<h2 className="text-3xl font-light text-aerial-dark_blue mb-12 text-center">Why Choose Local Pages</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: UserPlus,
								title: "Easy Profile Setup",
								description: "Create your business profile in minutes.",
							},
							{
								icon: Briefcase,
								title: "Showcase Services",
								description: "Display your services and service areas effectively.",
							},
							{
								icon: Smartphone,
								title: "Mobile App for Consumers",
								description: "Let customers find you easily on our mobile app.",
							},
							{
								icon: BarChart,
								title: "Analytics & Insights",
								description: "Track your performance and customer interactions.",
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

			{/* How It Works Section */}
			<section className="py-20 w-full bg-aerial-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-light text-aerial-dark_blue mb-12 text-center">How Local Pages Works</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								step: 1,
								title: "Create Your Profile",
								description: "Sign up and set up your business profile with your services and service areas.",
							},
							{
								step: 2,
								title: "Engage with Customers",
								description: "Be discovered by customers in your area looking for your services.",
							},
							{
								step: 3,
								title: "Grow Your Business",
								description: "Use analytics to understand your customers and expand your reach.",
							},
						].map((item, index) => (
							<div key={index} className="text-center">
								<div className="text-6xl font-bold text-aerial-blue mb-4">{item.step}</div>
								<h3 className="text-xl font-normal text-aerial-dark_blue mb-2">{item.title}</h3>
								<p className="text-aerial-slate">{item.description}</p>
							</div>
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
							"This app has made it so easy for local customers to find us. Our business profile looks professional, and we've seen a
							significant increase in foot traffic."
						</blockquote>
						<p className="font-semibold text-aerial-dark_blue">- John Smith, Local Retailer</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 w-full bg-aerial-blue-dark text-aerial-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-light mb-6">Get Started with Local Pages Today</h2>
					<p className="text-lg text-aerial-blue-lightest mb-8">Join thousands of businesses connecting with local customers.</p>
					<Button
						size="lg"
						className="bg-aerial-red hover:bg-aerial-red-light text-aerial-white font-normal text-lg px-8 py-3 transition-colors"
					>
						Create Your Free Account
					</Button>
				</div>
			</section>
		</>
	)
}

export default BusinessLandingPage
