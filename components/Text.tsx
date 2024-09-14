import { cn } from "@/utils/cn";
import {
  Text as NativeText,
  type TextProps as NativeTextProps,
} from "react-native";

export interface TextProps extends NativeTextProps {
  type?: "title" | "subtitle" | "body";
  size?: "small" | "medium" | "large" | "xlarge";
}

import { cva } from "class-variance-authority";

const text = cva([], {
  variants: {
    type: {
      title: ["py-4", "text-4xl"],
      subtitle: ["text-lg", "py-2", "px-4"],
      body: ["text-base", "py-2", "px-4"],
    },
  },
  defaultVariants: {
    type: "body",
  },
});

export function Text({ type, className, ...props }: TextProps) {
  const textProps = text({ type });
  const merged = cn("dark:text-white text-black", textProps, className);
  return <NativeText {...props} className={merged} />;
}
