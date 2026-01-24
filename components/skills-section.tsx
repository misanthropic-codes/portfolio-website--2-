"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import data from "@/data/data.json";

export function SkillsSection() {
  // Transform skills into format for InfiniteMovingCards
  const skillItems = data.skills.flatMap((category) =>
    category.items.map((skill) => ({
      quote: skill,
      name: category.category,
      title: `${category.items.length} technologies`,
    }))
  );

  // Split into two rows for visual interest
  const firstRow = skillItems.slice(0, Math.ceil(skillItems.length / 2));
  const secondRow = skillItems.slice(Math.ceil(skillItems.length / 2));

  return (
    <section className="py-20 px-4 glass-card border-t border-border overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
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
      </div>
    </section>
  );
}
