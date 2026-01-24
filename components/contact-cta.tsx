"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MovingBorderButton } from "@/components/ui/moving-border"
import { ArrowRight, Mail } from "lucide-react"

export function ContactCTA() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">Collaborate?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about
            technology and development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Moving Border CTA Button */}
            <MovingBorderButton
              as={Link}
              href="/contact"
              containerClassName="h-12"
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </MovingBorderButton>
            
            <Button asChild size="lg" variant="outline" className="glass-card">
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
