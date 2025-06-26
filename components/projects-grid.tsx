"use client"

import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"

interface Project {
  id: string
  title: string
  year: string
  tech: string[]
  description: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
}

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="bento-grid">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={index % 5 === 0 ? "bento-item-large" : ""}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}
