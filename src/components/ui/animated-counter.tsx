"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
  decimal?: number;
}

export function AnimatedCounter({ value, suffix, className, duration = 2000, decimal = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const target = Math.round(value * Math.pow(10, decimal));
    const startTime = performance.now();

    function frame(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(frame);
  }, [hasAnimated, value, duration, decimal]);

  const displayValue = decimal > 0 ? (count / Math.pow(10, decimal)).toFixed(decimal) : count.toLocaleString();

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {displayValue}
      {suffix && <span className="font-normal opacity-80">{suffix}</span>}
    </span>
  );
}
