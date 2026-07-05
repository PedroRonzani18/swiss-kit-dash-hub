import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border/60 bg-card px-5 py-6 shadow-business-sm md:flex-row md:items-start md:justify-between md:px-7 md:py-7",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/80"
      />
      <div className="min-w-0 space-y-4">
        {eyebrow ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-surface-subtle/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            <span>{eyebrow}</span>
          </div>
        ) : null}
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2 self-start">{actions}</div>
      ) : null}
    </header>
  );
}
