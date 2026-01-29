"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong";
  glow?: boolean;
  animate?: boolean;
  withGloss?: boolean;
  children: React.ReactNode;
}

export function GlassContainer({
  variant = "default",
  glow = false,
  animate = true,
  withGloss = true,
  className,
  children,
  ...props
}: GlassContainerProps) {
  const variantClasses = {
    default: "liquid-glass",
    subtle: "liquid-glass-subtle",
    strong: "liquid-glass-strong",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        glow && "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
        !animate && "hover:transform-none",
        !withGloss && "before:hidden",
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}

// Background with animated orbs
export function GlassBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-orb bg-orb-4" />
      </div>
      {/* Content */}
      {children}
    </div>
  );
}

// Glass Panel for editor/display sections
export function GlassPanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "liquid-glass-subtle p-4 h-full overflow-hidden",
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}

// Glass Header
export function GlassHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "liquid-glass border-b-0 rounded-none rounded-b-2xl",
        "px-4 py-3 shadow-lg",
        className,
      )}
      {...props}>
      {children}
    </header>
  );
}
