"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Code, Database, Globe, Server, Cloud, Cpu, Zap, Layers, Box, Terminal, Palette } from "lucide-react"

const technologies = [
  { name: "React", icon: Code, color: "#61DAFB" },
  { name: "Next.js", icon: Globe, color: "#000000" },
  { name: "TypeScript", icon: Code, color: "#3178C6" },
  { name: "Node.js", icon: Server, color: "#339933" },
  { name: "MongoDB", icon: Database, color: "#47A248" },
  { name: "PostgreSQL", icon: Database, color: "#336791" },
  { name: "Firebase", icon: Cloud, color: "#FFCA28" },
  { name: "Docker", icon: Box, color: "#2496ED" },
  { name: "AWS", icon: Cloud, color: "#FF9900" },
  { name: "GraphQL", icon: Layers, color: "#E10098" },
  { name: "Redux", icon: Cpu, color: "#764ABC" },
  { name: "Tailwind", icon: Palette, color: "#06B6D4" },
  { name: "Express", icon: Server, color: "#000000" },
  { name: "Python", icon: Terminal, color: "#3776AB" },
  { name: "JavaScript", icon: Zap, color: "#F7DF1E" },
  { name: "Vue.js", icon: Code, color: "#4FC08D" },
]

export function TechGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updatePositions = () => {
      const techs = container.querySelectorAll(".tech-item")
      const time = Date.now() * 0.001

      techs.forEach((tech, index) => {
        const phi = Math.acos(-1 + (2 * index) / techs.length)
        const theta = Math.sqrt(techs.length * Math.PI) * phi

        const radius = 120
        let x = radius * Math.cos(theta) * Math.sin(phi)
        let y = radius * Math.sin(theta) * Math.sin(phi)
        let z = radius * Math.cos(phi)

        // Apply rotation
        const rotX = rotation.x + (autoRotate ? time * 0.2 : 0)
        const rotY = rotation.y + (autoRotate ? time * 0.1 : 0)

        // Rotate around Y axis
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const tempX = x * cosY - z * sinY
        z = x * sinY + z * cosY
        x = tempX

        // Rotate around X axis
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const tempY = y * cosX - z * sinX
        z = y * sinX + z * cosX
        y = tempY

        const element = tech as HTMLElement
        const scale = (z + radius) / (radius * 2)
        const opacity = Math.max(0.3, scale)

        element.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`
        element.style.opacity = opacity.toString()
        element.style.zIndex = Math.floor(z + radius).toString()
      })
    }

    const animate = () => {
      updatePositions()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [rotation, autoRotate])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.movementX * 0.01
    const deltaY = e.movementY * 0.01

    setRotation((prev) => ({
      x: prev.x + deltaY,
      y: prev.y + deltaX,
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setAutoRotate(true), 2000) // Resume auto-rotation after 2 seconds
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    const touch = e.touches[0]
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (touch.clientX - centerX) * 0.001
    const deltaY = (touch.clientY - centerY) * 0.001

    setRotation({ x: deltaY, y: deltaX })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTimeout(() => setAutoRotate(true), 2000)
  }

  return (
    <div className="relative w-80 h-80 mx-auto cursor-grab active:cursor-grabbing select-none">
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: "1000px" }}
      >
        {technologies.map((tech, index) => {
          const Icon = tech.icon
          return (
            <motion.div
              key={tech.name}
              className="tech-item absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="glass-card p-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-xs font-mono border border-primary/20">
                <Icon className="w-4 h-4" style={{ color: tech.color }} />
                <span>{tech.name}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-xs text-muted-foreground font-mono">
        {isDragging ? "Drag to rotate" : "Interactive Tech Stack"}
      </div>
    </div>
  )
}
