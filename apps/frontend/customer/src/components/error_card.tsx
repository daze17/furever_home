"use client";

import { cn } from "utils";

type Props = {
  title: string;
  text: string;
  className?: string;
};

export const ErrorCard: React.FCC<Props> = ({
  title,
  text,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-sm border p-6",
        "lg:px-9 lg:py-10",
        className,
      )}
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="whitespace-pre-wrap text-base">{text}</p>
      {children}
    </div>
  );
};
