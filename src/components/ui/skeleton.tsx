import { cn } from "@/lib/utils";
import * as React from "react"; // Added explicit React import for safety

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
