"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react"
import data from "@/data/data.json"

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Get In Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <Link
              href={`mailto:${data.bio.email}`}
              className="text-muted-foreground hover:text-primary transition-colors interactive-element break-all text-sm md:text-base"
            >
              {data.bio.email}
            </Link>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-sm md:text-base">{data.bio.phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-sm md:text-base">{data.bio.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Follow Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link
              href={data.contact.github}
              target="_blank"
              className="p-2 rounded-lg glass hover:glass-strong transition-colors interactive-element"
            >
              <Github className="w-5 h-5 text-foreground" />
            </Link>
            <Link
              href={data.contact.linkedin}
              target="_blank"
              className="p-2 rounded-lg glass hover:glass-strong transition-colors interactive-element"
            >
              <Linkedin className="w-5 h-5 text-foreground" />
            </Link>
            <Link
              href={data.contact.twitter}
              target="_blank"
              className="p-2 rounded-lg glass hover:glass-strong transition-colors interactive-element"
            >
              <Twitter className="w-5 h-5 text-foreground" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Let's Collaborate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            I'm always interested in hearing about new projects and opportunities. Whether you're a company looking to
            hire, or you're a fellow developer looking to collaborate, I'd love to hear from you.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
