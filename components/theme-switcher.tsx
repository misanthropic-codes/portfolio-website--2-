"use client"

import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"
import { Code, Zap, User } from "lucide-react"
import React from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "developer" as const, name: "Dev", icon: Code, color: "#b30000" },
    { id: "hacker" as const, name: "Hack", icon: Zap, color: "#00ff41" },
    { id: "noob" as const, name: "Noob", icon: User, color: "#666666" },
  ]

  const currentIndex = themes.findIndex((t) => t.id === theme)

  const nextTheme = () => {
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].id)
  }

  return (
    <motion.button
      onClick={nextTheme}
      className="relative w-16 h-8 glass-card rounded-full p-1 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: themes[currentIndex].color }}
        animate={{ x: currentIndex * 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {React.createElement(themes[currentIndex].icon, { className: "w-3 h-3 text-black" })}
      </motion.div>

      {/* Theme indicator dots */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 flex gap-1">
        {themes.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </motion.button>
  )
}
