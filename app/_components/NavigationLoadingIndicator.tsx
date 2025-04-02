'use client';

import { Spinner } from "@heroui/react";
import {useOnNavigate} from "@/app/lib/hooks/useOnNavigate";

export function NavigationLoadingIndicator() {
  const loading = useOnNavigate();

  if (!loading) return null;

  return (
    <div className="fixed w-screen h-screen z-[999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
