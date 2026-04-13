import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

const baseButtonClassName =
  "inline-flex items-center justify-center rounded-full text-sm tracking-[0.01em] transition disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary: "bg-slate-950 px-4 py-2 font-semibold text-white hover:bg-slate-800",
  secondary:
    "border border-slate-300 px-4 py-2 font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  ghost: "px-4 py-2 font-medium text-slate-800 hover:bg-slate-100",
} as const;

const buttonSizes = {
  default: "",
  md: "px-5 py-3 font-semibold",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "secondary",
  size = "default",
  className,
  type = "button",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={clsx(
        baseButtonClassName,
        buttonVariants[variant],
        size !== "default" ? buttonSizes[size] : undefined,
        className,
      )}
      {...props}
    />
  );
}