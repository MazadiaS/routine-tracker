import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-edge bg-panel/80 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 pt-5 pb-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "outline",
  size = "md",
  ...props
}: ButtonProps) {
  const sizeCls = size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";
  const variantCls = {
    primary:
      "bg-accent text-black hover:bg-accent/90 border border-accent shadow-[0_0_24px_-8px_rgba(34,197,94,0.7)]",
    ghost: "text-ink hover:bg-edge",
    outline: "border border-edge text-ink hover:border-accent/40 hover:bg-edge",
    danger: "border border-danger/40 text-danger hover:bg-danger/10",
  }[variant];
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        sizeCls,
        variantCls,
        className,
      )}
      {...props}
    />
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warn" | "danger";
  className?: string;
}) {
  const toneCls = {
    neutral: "border-edge text-muted bg-edge/40",
    accent: "border-accent/40 text-accent bg-accent/10",
    warn: "border-warn/40 text-warn bg-warn/10",
    danger: "border-danger/40 text-danger bg-danger/10",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        toneCls,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  ratio,
  className,
}: {
  ratio: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-edge", className)}>
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
