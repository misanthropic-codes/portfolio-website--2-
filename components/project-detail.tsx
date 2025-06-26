"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Github, Calendar, Clock, Users, Target, Lightbulb, Rocket, Code2 } from "lucide-react"

interface Project {
  id: string
  title: string
  year: string
  tech: string[]
  description: string
  problem: string
  solution: string
  learnings: string
  future: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="outline" className="mb-6 glass-card">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="outline" className="glass border-primary/30 text-primary bg-primary/10">
                  <Calendar className="w-3 h-3 mr-1" />
                  {project.year}
                </Badge>
                <Badge variant="outline" className="glass border-border text-foreground">
                  <Code2 className="w-3 h-3 mr-1" />
                  {project.tech.length} Technologies
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">{project.title}</h1>

              <p className="text-xl text-muted-foreground leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="outline" className="glass border-border text-foreground">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                {project.liveUrl && (
                  <Button asChild size="lg" className="glow">
                    <Link href={project.liveUrl} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" size="lg" className="glass-card">
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-64 lg:h-96 rounded-xl overflow-hidden glass-card">
                <Image
                  src={project.images[0] || "/placeholder.svg?height=400&width=600"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        <Separator className="my-12 bg-border" />

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Project <span className="gradient-text">Overview</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card border-border text-center">
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Challenge</h3>
                <p className="text-sm text-muted-foreground">Complex problem solving</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border text-center">
              <CardContent className="p-6">
                <Lightbulb className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">Creative solutions</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border text-center">
              <CardContent className="p-6">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Timeline</h3>
                <p className="text-sm text-muted-foreground">Efficient delivery</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Impact</h3>
                <p className="text-sm text-muted-foreground">User-focused results</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Separator className="my-12 bg-border" />

        {/* Detailed Sections */}
        <div className="space-y-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    The Problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    The Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    What I Learned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.learnings}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Future Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.future}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Project Gallery */}
        {project.images.length > 1 && (
          <>
            <Separator className="my-12 bg-border" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Project <span className="gradient-text">Gallery</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {project.images.slice(1).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative h-64 rounded-xl overflow-hidden glass-card group cursor-pointer"
                  >
                    <Image
                      src={image || "/placeholder.svg?height=300&width=500"}
                      alt={`${project.title} screenshot ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Call to Action */}
        <Separator className="my-12 bg-border" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Interested in <span className="gradient-text">Collaborating?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects and opportunities. Let's build something amazing together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="glow">
              <Link href="/contact">
                Get In Touch
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass-card">
              <Link href="/projects">View More Projects</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
