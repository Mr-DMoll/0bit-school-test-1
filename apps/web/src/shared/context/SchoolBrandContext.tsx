"use client";

import { createContext, useContext } from "react";

export interface SchoolBrand {
  schoolName:  string;
  accentColor: string;
  logoUrl:     string;
}

const SchoolBrandContext = createContext<SchoolBrand | null>(null);

// Populated server-side (see app/login/layout.tsx) so pages that need the
// school's live name/colour/logo never fall back to a hardcoded value first
// and re-render — that flash is exactly what a client-side fetch produces.
export function SchoolBrandProvider({ brand, children }: { brand: SchoolBrand; children: React.ReactNode }) {
  return <SchoolBrandContext.Provider value={brand}>{children}</SchoolBrandContext.Provider>;
}

export function useSchoolBrand(): SchoolBrand {
  const ctx = useContext(SchoolBrandContext);
  if (!ctx) throw new Error("useSchoolBrand must be used within a SchoolBrandProvider");
  return ctx;
}
