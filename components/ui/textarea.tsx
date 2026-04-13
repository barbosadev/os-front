import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

import { inputBaseClassName } from "@/components/ui/field-utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: Readonly<TextareaProps>) {
  return (
    <textarea
      className={clsx(inputBaseClassName, "placeholder:text-slate-400", className)}
      {...props}
    />
  );
}