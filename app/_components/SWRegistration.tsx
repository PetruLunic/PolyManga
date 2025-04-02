"use client";

import { useEffect } from "react";

export function SWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err: Error) => {
        console.error('Service worker registration failed:', err);
      });
    }
  }, []);

  return null;
}
