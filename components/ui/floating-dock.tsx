"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      {/* Desktop - with hover scaling */}
      <FloatingDockDesktop items={items} className={cn("hidden md:flex", desktopClassName)} />
      {/* Mobile - compact version without scaling */}
      <FloatingDockMobile items={items} className={cn("flex md:hidden", mobileClassName)} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "flex h-12 gap-2 items-center rounded-2xl bg-card/90 backdrop-blur-md border border-border px-3",
        className
      )}
    >
      {items.map((item) => (
        <MobileIconContainer key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function MobileIconContainer({
  title,
  icon,
  href,
  onClick,
}: DockItem) {
  const content = (
    <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center active:scale-95 transition-transform">
      <div className="w-4 h-4">
        {icon}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} aria-label={title}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={title}>
      {content}
    </Link>
  );
}

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto h-14 gap-4 items-end rounded-2xl bg-card/80 backdrop-blur-md border border-border px-4 pb-2",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: DockItem & { mouseX: any }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 70, 40]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="aspect-square rounded-full bg-secondary/50 flex items-center justify-center relative"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="px-2 py-0.5 whitespace-pre rounded-md bg-card border border-border text-foreground absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex items-center justify-center text-foreground"
        style={{ width: "50%", height: "50%" }}
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick}>
        {content}
      </button>
    );
  }

  return <Link href={href}>{content}</Link>;
}
