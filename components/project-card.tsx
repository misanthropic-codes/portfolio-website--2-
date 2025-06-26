"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowRight, Calendar } from "lucide-react"

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

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div whileHover={{ y: -10, scale: 1.02 }} transition={{ duration: 0.3 }} className="group">
      <Card className="h-full glass-card hover:glass-strong transition-all duration-300 overflow-hidden glow-on-hover interactive-element">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={project.images[0] || "/placeholder.svg?height=200&width=400"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="glass font-mono text-foreground bg-card">
                <Calendar className="w-3 h-3 mr-1" />
                {project.year}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs glass-card font-mono border-border text-foreground"
              >
                {tech}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="outline" className="text-xs glass-card font-mono border-border text-foreground">
                +{project.tech.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button asChild size="sm" className="flex-1 glow interactive-element">
            <Link href={`/projects/${project.id}`}>
              Details
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
          {project.liveUrl && (
            <Button asChild size="sm" variant="outline" className="glass-card interactive-element">
              <Link href={project.liveUrl} target="_blank">
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild size="sm" variant="outline" className="glass-card interactive-element">
              <Link href={project.githubUrl} target="_blank">
                <Github className="w-3 h-3" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
