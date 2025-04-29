"use client";

import { cn } from "@/lib/utils";

export function ChartContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("h-[300px] w-full", className)}>
      {children}
    </div>
  );
}

export function ChartTooltip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}