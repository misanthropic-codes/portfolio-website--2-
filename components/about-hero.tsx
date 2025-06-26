"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import data from "@/data/data.json"

export function AboutHero() {
  return (
    <section className="mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>{data.bio.summary}</p>
            <p>
              Currently pursuing B.Tech in Electrical Engineering at Haldia Institute of Technology, I've been actively
              involved in various tech communities and projects that have shaped my understanding of modern web
              development.
            </p>
            <p>
              From co-founding BullBear.Ai to contributing to campus tech initiatives, I believe in the power of
              technology to solve real-world problems and create meaningful impact.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-4 rounded-lg border-border">
              <h3 className="font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">{data.bio.location}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border-border">
              <h3 className="font-semibold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground break-all text-sm md:text-base">{data.bio.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-2xl blur-3xl opacity-20 glow"></div>
            <Image
              src="/profile.jpg"
              alt={data.bio.name}
              width={400}
              height={400}
              className="relative z-10 rounded-2xl border-4 border-primary/20 glass-card"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
