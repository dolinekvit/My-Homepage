import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Frosted-glass shell shared by all new-tab widgets. */
export function WidgetCard({ className, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("rounded-3xl glass p-5 text-card-foreground", className)} {...props} />
  );
}
