/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface GlassCardProps {
  id?: string;
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: "indigo" | "cyan" | "purple" | "none";
  onClick?: () => void;
}

export default function GlassCard({
  id,
  children,
  className = "",
  hoverEffect = true,
  glowColor = "none",
  onClick,
}: GlassCardProps) {
  const glowStyles = {
    indigo:
      "hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    cyan: "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    purple:
      "hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    none: "",
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white/5 
        border border-white/10 
        rounded-3xl 
        backdrop-blur-xl 
        p-8 
        transition-all 
        duration-300 
        shadow-glass 
        ${hoverEffect ? "hover:bg-white/10 hover:-translate-y-1" : ""} 
        ${glowColor !== "none" ? glowStyles[glowColor] : ""} 
        ${onClick ? "cursor-pointer" : ""} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
