"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { auditService, type AuditLogEntry } from "@/shared/services/audit.service";
import { Spinner } from "@/shared/components/ui/Spinner";

const METHOD_COLORS: Record<string, string> = {
  POST:   "var(--color-success)",
  PATCH:  "var(--color-accent)",
  PUT:    "var(--color-accent)",
  DELETE: "var(--color-danger)",
};

function actionLabel(action: string) {
  // "PATCH_SCHOOL" -> "Patch School", "LOGIN" -> "Login"
  return action
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function userLabel(u: AuditLogEntry["user"]) {
  return u.displayName || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
}

export function ActivityLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    auditService.list()
      .then((res) => setLogs(res.data.data.logs))
      .catch(() => setError("Failed to load activity log."))
      .finally(() => setIsLoading(false));
  }, []);

  if (user && user.role !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          The Activity Log is visible to Admins only.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>Activity Log</h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          A record of who changed what, and when.
        </p>
      </div>

      {error && (
        <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px", color: "var(--color-text-muted)" }}>
          <Spinner size={16} />
          <span style={{ fontSize: "13px" }}>Loading...</span>
        </div>
      ) : logs.length === 0 ? (
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", textAlign: "center", padding: "60px 0" }}>No activity recorded yet.</p>
      ) : (
        <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", overflow: "hidden" }}>
          {logs.map((log, i) => (
            <div
              key={log.id}
              style={{
                display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px",
                borderBottom: i < logs.length - 1 ? "1px solid var(--color-border)" : "none",
              }}
            >
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                background: log.meta?.method ? METHOD_COLORS[log.meta.method] ?? "var(--color-text-muted)" : "var(--color-text-muted)",
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>{actionLabel(log.action)}</span>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", marginLeft: "8px" }}>by {userLabel(log.user)}</span>
              </div>
              {log.meta?.path && (
                <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{log.meta.path}</span>
              )}
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                {new Date(log.createdAt).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
