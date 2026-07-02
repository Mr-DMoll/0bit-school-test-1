"use client";

import { useEffect } from "react";
import { applyAccentColor } from "@/shared/utils/accentColor";

export function AccentProvider({ accentColor }: { accentColor: string }) {
  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  return null;
}
