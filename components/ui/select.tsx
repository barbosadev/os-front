import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

import { inputBaseClassName } from "@/components/ui/field-utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: Readonly<SelectProps>) {
  return <select className={clsx(inputBaseClassName, className)} {...props} />;
}