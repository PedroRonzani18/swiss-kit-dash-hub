import * as React from "react";

import { cn } from "@/lib/utils";

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-none",
} as const;

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof containerSizes;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 md:px-6",
        containerSizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Container.displayName = "Container";
