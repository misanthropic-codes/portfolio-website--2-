"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import data from "@/data/data.json";

export function SkillsSection() {
  // Transform skills into compact format
  const skillItems = data.skills.flatMap((category) =>
    category.items.map((skill) => ({
      name: skill,
      category: category.category,
    }))
  );

  // Split into two rows for visual interest
  const firstRow = skillItems.slice(0, Math.ceil(skillItems.length / 2));
  const secondRow = skillItems.slice(Math.ceil(skillItems.length / 2));

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-6"
        >
          {/* First row - scrolls left */}
          <InfiniteMovingCards
            items={firstRow}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
          
          {/* Second row - scrolls right */}
          <InfiniteMovingCards
            items={secondRow}
            direction="right"
            speed="slow"
            pauseOnHover={true}
          />
        </motion.div>
        
        {/* Category legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          {data.skills.map((category) => (
            <div key={category.category} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${
                category.category === "Frontend" ? "bg-gradient-to-r from-blue-500 to-cyan-400" :
                category.category === "Backend" ? "bg-gradient-to-r from-green-500 to-emerald-400" :
                category.category === "Database" ? "bg-gradient-to-r from-purple-500 to-violet-400" :
                "bg-gradient-to-r from-orange-500 to-amber-400"
              }`} />
              <span className="font-mono text-xs">{category.category}</span>
              <span className="text-muted-foreground/50">({category.items.length})</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
