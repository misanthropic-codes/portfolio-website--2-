import type { Metadata } from "next"
import { ServicesGrid } from "@/components/services-grid"
import { getServices } from "@/lib/data"

export const metadata: Metadata = {
  title: "Services",
  description: "Professional web development and software engineering services.",
}

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            High-quality software solutions tailored to your specific needs, from web applications to system architecture.
          </p>
        </div>
        <ServicesGrid services={services} />
      </div>
    </div>
  )
}
