import { cn } from "@/lib/utils";
import React from "react";

interface TextProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  type?: "title" | "subTitle" | "heading" | "description" | "p" | "caption";
  children: React.ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "accent" | "text-base" | "text-muted";
  size?: "sm" | "md" | "lg";
}

const Text = ({
  type = "p",
  children,
  className = "",
  color = "text-base",
  size,
  ...rest
}: TextProps) => {
  switch (type) {
    case "title":
      return (
        <h1 className={cn(`text-2xl font-bold text-[#303338]`, className)}>
          {children}
        </h1>
      );
    case "subTitle":
      return (
        <h2 className={cn(`text-xl font-semibold text-[#303338]`, className) }{...rest}>
          {children}
        </h2>
      );
    case "heading":
      return (
        <h3 className={cn(`text-lg font-medium text-[#444]`, className)}>
          {children}
        </h3>
      );
    case "description":
      return (
        <p className={cn(`text-base text-[#777]`, className)}>{children}</p>
      );
    default:
      return (
        <p className={cn(`text-base text-[#303338]`, className)}>{children}</p>
      );
  }
};

export default Text;
