"use client";

import { forwardRef, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-gold to-gold-light text-navy shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30",
        outline:
          "border-2 border-white/30 text-white hover:bg-white hover:text-navy hover:border-white",
        ghost:
          "text-white/70 hover:text-white hover:bg-white/10",
        gold: "bg-navy text-gold hover:bg-navy-light shadow-lg shadow-navy/20",
      },
      size: {
        default: "h-12 px-7 text-sm",
        lg: "h-14 px-10 text-base",
        sm: "h-10 px-5 text-xs",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  magnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, magnetic = true, children, disabled, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 });
      setIsHovered(false);
    };

    return (
      <motion.button
        ref={(node) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        animate={magnetic && isHovered ? { x: mousePos.x, y: mousePos.y } : { x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        )}

        <motion.span
          className="absolute inset-0 rounded-full bg-white/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ pointerEvents: "none" }}
        />

        <span className={cn("relative inline-flex items-center gap-2.5", loading && "invisible")}>
          {children}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
