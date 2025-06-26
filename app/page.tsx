import { Hero } from "@/components/hero"
import { FeaturedProjects } from "@/components/featured-projects"
import { SkillsSection } from "@/components/skills-section"
import { ContactCTA } from "@/components/contact-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProjects />
      <SkillsSection />
      <ContactCTA />
    </div>
  )
}
