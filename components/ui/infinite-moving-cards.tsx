"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    category: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Frontend": "from-blue-500 to-cyan-400",
      "Backend": "from-green-500 to-emerald-400",
      "Database": "from-purple-500 to-violet-400",
      "Tools & Others": "from-orange-500 to-amber-400",
      "DevOps": "from-red-500 to-rose-400",
    };
    return colors[category] || "from-primary to-primary/60";
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            key={item.name + idx}
            className="group relative shrink-0"
          >
            {/* Gradient border wrapper */}
            <div className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-r opacity-75 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-md",
              getCategoryColor(item.category)
            )} />
            
            {/* Card content */}
            <div className="relative flex items-center gap-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 px-5 py-3 transition-all duration-300 group-hover:scale-105 group-hover:bg-card">
              {/* Icon dot with gradient */}
              <div className={cn(
                "w-2.5 h-2.5 rounded-full bg-gradient-to-r",
                getCategoryColor(item.category)
              )} />
              
              {/* Skill name */}
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {item.name}
              </span>
              
              {/* Category tag */}
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.category.split(" ")[0]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
