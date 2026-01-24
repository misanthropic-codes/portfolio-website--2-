"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MovingBorderButton } from "@/components/ui/moving-border"
import { LampContainer } from "@/components/ui/lamp"
import { ArrowRight, Mail } from "lucide-react"

//...
export function ContactCTA({ email }: { email?: string }) {
  return (
    <LampContainer className="py-0 min-h-[500px]">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="text-center max-w-3xl mx-auto mt-8"
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
          
          <Link 
            href="/projects"
            className="px-6 py-3 rounded-xl border border-border bg-card/50 backdrop-blur-md text-foreground hover:bg-card transition-colors"
          >
            View My Work
          </Link>
        </div>
      </motion.div>
    </LampContainer>
  )
}
