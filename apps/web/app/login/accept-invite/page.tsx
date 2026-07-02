import { Suspense } from "react";
import { AcceptInvitePage } from "@/features/school/AcceptInvitePage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FAF8F4" }} />}>
      <AcceptInvitePage />
    </Suspense>
  );
}
