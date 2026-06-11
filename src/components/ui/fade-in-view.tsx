"use client";

import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/lib/use-intersection";
import { cn } from "@/lib/utils";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function FadeInView({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.6,
  distance = 40,
  once = true,
}: FadeInViewProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: once,
  });

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 0, ...directionMap[direction] }}
        animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionMap[direction] }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
