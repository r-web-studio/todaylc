"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/lib/use-intersection";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix, className, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
      const startTime = performance.now();

      function frame(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * value));

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setCount(value);
        }
      }

      requestAnimationFrame(frame);
    }
  }, [isVisible, value, duration, hasAnimated]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {count.toLocaleString()}
      {suffix && <span className="font-normal opacity-80">{suffix}</span>}
    </span>
  );
}
