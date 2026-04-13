import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

import { inputBaseClassName } from "@/components/ui/field-utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Readonly<InputProps>) {
  return (
    <input
      className={clsx(inputBaseClassName, "placeholder:text-slate-400", className)}
      {...props}
    />
  );
}