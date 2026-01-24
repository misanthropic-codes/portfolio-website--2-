"use client";

import { motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* Beam line */}
      <div className="absolute left-4 md:left-8 top-3 bottom-0">
        <div className="ml-[5px] h-full w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export const TracingBeamItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn("relative pl-12 md:pl-20 pb-10", className)}
    >
      {/* Dot */}
      <div className="absolute left-4 md:left-8 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-md shadow-primary/50" />
      
      {children}
    </motion.div>
  );
};
