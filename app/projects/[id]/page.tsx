import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectDetail } from "@/components/project-detail"
import { getProject, getProjects } from "@/lib/data"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.id)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: project.title,
    description: project.description,
  }
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project: any) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
