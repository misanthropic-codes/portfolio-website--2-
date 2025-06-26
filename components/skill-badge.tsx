"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface SkillBadgeProps {
  skill: string
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge
        variant="outline"
        className="px-4 py-2 text-sm glass border-border text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-default interactive-element"
      >
        {skill}
      </Badge>
    </motion.div>
  )
}
