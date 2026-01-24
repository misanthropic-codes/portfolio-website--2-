"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import data from "@/data/data.json";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TracingBeam, TracingBeamItem } from "@/components/ui/tracing-beam";

export function AboutHero() {
  return (
    <section className="mb-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <TextGenerateEffect 
            words={data.bio.summary}
            className="text-lg text-muted-foreground mb-6"
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-4 rounded-lg border-border">
              <h3 className="font-semibold text-primary mb-2">Location</h3>
              <p className="text-muted-foreground">{data.bio.location}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border-border">
              <h3 className="font-semibold text-primary mb-2">Email</h3>
              <p className="text-muted-foreground break-all text-sm md:text-base">
                {data.bio.email}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Journey with Tracing Beam */}
      <TracingBeam className="mt-16">
        <h2 className="text-2xl font-bold mb-8 pl-12 md:pl-20">
          My <span className="gradient-text">Journey</span>
        </h2>
        
        <TracingBeamItem>
          <h3 className="text-xl font-semibold mb-2">Tech Enthusiast</h3>
          <p className="text-muted-foreground">
            Currently pursuing B.Tech in Electrical Engineering at Haldia
            Institute of Technology, actively involved in various tech communities and projects.
          </p>
        </TracingBeamItem>
        
        <TracingBeamItem>
          <h3 className="text-xl font-semibold mb-2">Entrepreneur</h3>
          <p className="text-muted-foreground">
            Co-founded BullBear.Ai, a fintech startup focused on AI-driven trading insights and market analysis.
          </p>
        </TracingBeamItem>
        
        <TracingBeamItem>
          <h3 className="text-xl font-semibold mb-2">Problem Solver</h3>
          <p className="text-muted-foreground">
            I believe in the power of technology to solve real-world problems and create meaningful impact through well-crafted software solutions.
          </p>
        </TracingBeamItem>
      </TracingBeam>
    </section>
  );
}
