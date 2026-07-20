/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface InteractiveButtonProps {
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "glass";
  showArrow?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function InteractiveButton({
  id,
  children,
  onClick,
  type = "button",
  variant = "primary",
  showArrow = false,
  className = "",
  disabled = false,
}: InteractiveButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden cursor-pointer tracking-wide text-sm select-none";

  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id: Date.now() + Math.random(), x, y }]);
  };

  const handleRippleEnd = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  const variants = {
    primary:
      "bg-white text-slate-950 hover:bg-slate-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] shadow-glow",
    secondary:
      "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:opacity-95 shadow-glow",
    outline:
      "border border-white/20 text-white hover:bg-white/10 hover:border-white/40",
    glass:
      "bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-indigo-500/30 backdrop-blur-md",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#030712]`}
    >
      <span className="relative z-10 flex items-center gap-1.5 pointer-events-none">
        {children}
        {showArrow && (
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </span>
      {/* Glossy background pulse effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      {/* Ripple elements */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          onAnimationEnd={() => handleRippleEnd(ripple.id)}
          className="absolute bg-white/20 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 40,
            height: 40,
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />
      ))}
    </button>
  );
}
