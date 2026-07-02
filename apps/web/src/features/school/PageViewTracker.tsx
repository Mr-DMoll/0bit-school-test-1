"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${BASE_URL}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer: document.referrer || null }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
