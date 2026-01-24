import { Hero } from "@/components/hero"
import { FeaturedProjects } from "@/components/featured-projects"
import { SkillsSection } from "@/components/skills-section"
import { ContactCTA } from "@/components/contact-cta"
import { getProfile, getProjects, getSkills } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const skills = await getSkills();

  return (
    <div className="min-h-screen">
      <Hero profile={profile} />
      <FeaturedProjects projects={projects} />
      <SkillsSection skills={skills} />
      <ContactCTA email={profile.email} />
    </div>
  )
}
