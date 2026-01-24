"use client";

import { motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[450px] flex-col items-center justify-center overflow-hidden w-full rounded-md z-0",
        className
      )}
    >
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
      
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left conic gradient - uses primary color */}
        <motion.div
          initial={{ opacity: 0.3, width: "15rem" }}
          whileInView={{ opacity: 0.7, width: "25rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, hsl(var(--primary) / 0.4), transparent, transparent)`,
          }}
          className="absolute inset-auto right-1/2 h-48 overflow-visible w-[25rem]"
        >
          <div className="absolute w-[100%] left-0 bg-background h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-32 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        
        {/* Right conic gradient - uses primary color */}
        <motion.div
          initial={{ opacity: 0.3, width: "15rem" }}
          whileInView={{ opacity: 0.7, width: "25rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, hsl(var(--primary) / 0.4))`,
          }}
          className="absolute inset-auto left-1/2 h-48 w-[25rem]"
        >
          <div className="absolute w-32 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-background h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        
        {/* Background blur layer */}
        <div className="absolute top-1/2 h-40 w-full translate-y-12 scale-x-150 bg-background blur-2xl"></div>
        
        {/* Soft glow orb - reduced opacity for subtlety */}
        <div 
          className="absolute inset-auto z-50 h-28 w-[22rem] -translate-y-1/2 rounded-full blur-3xl"
          style={{ 
            background: `radial-gradient(ellipse at center, hsl(var(--primary) / 0.25), transparent 70%)` 
          }}
        />
        
        {/* Animated inner glow */}
        <motion.div
          initial={{ width: "6rem", opacity: 0.3 }}
          whileInView={{ width: "12rem", opacity: 0.5 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-28 -translate-y-[5rem] rounded-full blur-2xl"
          style={{ 
            background: `radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 60%)` 
          }}
        />
        
        {/* Lamp edge line */}
        <motion.div
          initial={{ width: "10rem", opacity: 0.4 }}
          whileInView={{ width: "20rem", opacity: 0.8 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-px -translate-y-[6rem]"
          style={{ 
            background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)` 
          }}
        />

        {/* Top cover */}
        <div className="absolute inset-auto z-40 h-36 w-full -translate-y-[10rem] bg-background"></div>
      </div>

      {/* Content container */}
      <div className="relative z-50 flex -translate-y-48 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
