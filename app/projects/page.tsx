import type { Metadata } from "next"
import { ProjectsGrid } from "@/components/projects-grid"
import { getProjects } from "@/lib/data"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development projects, from SaaS platforms to AI-powered applications.",
}

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects that showcase my skills in full-stack development, from concept to deployment.
          </p>
        </div>
        <ProjectsGrid projects={projects} />
      </div>
    </div>
  )
}
