"use client";

import {useI18nZodErrors} from "@/app/lib/hooks/useI18nZodErrors";

export function ZodErrorMapProvider({ children }: { children: React.ReactNode }) {
  useI18nZodErrors()
  return <>{children}</>;
}