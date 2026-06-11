"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  delta?: number;
  icon: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "destructive";
  className?: string;
}

export function StatsCard({ title, value, delta, icon, variant = "default", className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            variant === "accent" ? "bg-accent/10 text-accent" :
            variant === "success" ? "bg-green-100 text-green-600" :
            variant === "warning" ? "bg-yellow-100 text-yellow-600" :
            variant === "destructive" ? "bg-red-100 text-red-600" :
            "bg-primary/10 text-primary"
          )}
        >
          {icon}
        </div>
        {delta !== undefined && (
          <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", delta >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            {delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
}
