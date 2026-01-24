"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Calendar } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

interface Project {
  id: string;
  title: string;
  year: string;
  tech: string[];
  description: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <CardContainer className="inter-var w-full" containerClassName="py-0 h-full">
      <CardBody className="bg-card relative group/card border-border dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] w-full h-auto rounded-xl p-6 border glass-card">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-foreground"
        >
          {project.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-muted-foreground text-sm max-w-sm mt-2 line-clamp-2"
        >
          {project.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative h-40 w-full overflow-hidden rounded-xl">
            <Image
              src={project.images[0] || "/placeholder.svg?height=200&width=400"}
              alt={project.title}
              fill
              className="object-cover group-hover/card:shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 glass font-mono text-foreground bg-card/80"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {project.year}
            </Badge>
          </div>
        </CardItem>
        <CardItem translateZ="40" className="w-full mt-4">
          <div className="flex flex-wrap gap-2">
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
              <Badge
                variant="outline"
                className="text-xs glass-card font-mono border-border text-foreground"
              >
                +{project.tech.length - 4}
              </Badge>
            )}
          </div>
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as={Link}
            href={`/projects/${project.id}`}
            className="px-4 py-2 rounded-xl text-xs font-normal text-foreground hover:text-primary transition-colors"
          >
            View Details →
          </CardItem>
          <CardItem
            translateZ={20}
            className="flex gap-2"
          >
            {project.liveUrl && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="glass-card px-3"
              >
                <Link href={project.liveUrl} target="_blank">
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            )}
            {project.githubUrl && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="glass-card px-3"
              >
                <Link href={project.githubUrl} target="_blank">
                  <Github className="w-3 h-3" />
                </Link>
              </Button>
            )}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
