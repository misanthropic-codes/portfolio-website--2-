import { Hero } from "@/components/hero"
import { FeaturedProjects } from "@/components/featured-projects"
import { SkillsSection } from "@/components/skills-section"
import { ContactCTA } from "@/components/contact-cta"
import { ServicesGrid } from "@/components/services-grid"
import { getProfile, getProjects, getSkills, getServices } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const skills = await getSkills();
  const services = await getServices();

  return (
    <div className="min-h-screen">
      <Hero profile={profile} />
      <FeaturedProjects projects={projects} />
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold mb-6">
             <span className="gradient-text">Services</span>
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
              I offer a range of professional services to help you achieve your goals.
           </p>
         </div>
         <ServicesGrid services={services.slice(0, 3)} />
      </section>
      <SkillsSection skills={skills} />
      <ContactCTA email={profile.email} />
    </div>
  )
}
