import type { Metadata } from "next"
import { AboutHero } from "@/components/about-hero"
import { Timeline } from "@/components/timeline"
import { SkillsDetailed } from "@/components/skills-detailed"
import { GitHubActivity } from "@/components/github-activity"
import { getProfile, getSkills, getExperience, getEducation } from "@/lib/data"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Abhishek Kumar - Full Stack Developer, his journey, skills, and experience.",
}

export const revalidate = 60;

export default async function AboutPage() {
  const profile = await getProfile();
  const skills = await getSkills();
  const experience = await getExperience();
  const education = await getEducation();

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <AboutHero profile={profile} />
        <SkillsDetailed skills={skills} />

        {/* GitHub Activity Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              GitHub <span className="gradient-text">Activity</span>
            </h2>
            <p className="text-muted-foreground">My recent contributions and coding activity</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <GitHubActivity />
          </div>
        </section>

        <Timeline
          title="Experience"
          items={experience.map((exp: any) => ({
            title: exp.role,
            subtitle: exp.company,
            date: `${exp.start} - ${exp.end}`,
            location: exp.location,
            description: exp.description,
            achievements: exp.achievements,
          }))}
        />
        <Timeline
          title="Education"
          items={education.map((edu: any) => ({
            title: edu.degree,
            subtitle: edu.institution,
            date: `${edu.start} - ${edu.end}`,
            location: edu.location,
            description: edu.description,
            achievements: edu.activities || [],
          }))}
        />
      </div>
    </div>
  )
}
