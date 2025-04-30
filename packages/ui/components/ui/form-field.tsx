import type { ReactNode } from "react";

import { Label } from "./label";

type Props = {
  children?: ReactNode;
  error?: string;
  label?: string;
};
export const FormField: React.FC<Props> = ({ children, error, label }) => {
  return (
    <Label className="flex flex-col gap-y-1">
      {label}
      {children}
      {error && (
        <p aria-live="polite" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </Label>
  );
};
