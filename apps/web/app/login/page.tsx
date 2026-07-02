"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/AuthContext";
import { AdminLoginPage } from "@/features/school/AdminLoginPage";

// /login is the single, role-neutral entry point — not inside the
// (dashboard) route group, so it isn't wrapped by AuthGuard (which would
// otherwise redirect straight back here, hiding the login form entirely).
// Once authenticated, it hands off based on role (today: ADMIN only, to
// /admin/dashboard — see AuthContext's ROLE_ROUTES).
export default function LoginEntryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return <div style={{ minHeight: "100vh", background: "#FAF8F4" }} />;
  }

  return <AdminLoginPage />;
}
