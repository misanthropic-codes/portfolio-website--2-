"use client";

import { motion } from "framer-motion";
import { SkillBadge } from "@/components/skill-badge";
import data from "@/data/data.json";

export function SkillsSection() {
  const allSkills = data.skills.flatMap((category) => category.items);

  return (
    <section className="py-20 px-4 glass-card border-t border-border">
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
          className="flex flex-wrap justify-center gap-3"
        >
          {allSkills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <SkillBadge skill={skill} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
