"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/shared/context/AuthContext";
import { teamService, type TeamMember } from "@/shared/services/team.service";
import { Spinner } from "@/shared/components/ui/Spinner";

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--color-text-muted)", display: "block", marginBottom: "6px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: "13px", color: "var(--color-text-primary)",
  background: "var(--color-bg)", border: "1px solid var(--color-border)",
  borderRadius: "8px", outline: "none", boxSizing: "border-box",
};
const fieldGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "14px" };

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "var(--color-success)", PENDING: "var(--color-warning)",
  SUSPENDED: "var(--color-danger)", DELETED: "var(--color-danger)",
};

function memberName(m: TeamMember) {
  return m.displayName || [m.firstName, m.lastName].filter(Boolean).join(" ") || m.email;
}

// ─── Invite modal ───────────────────────────────────────────────────────────────
function InviteModal({ onClose, onInvited }: { onClose: () => void; onInvited: () => void }) {
  const [email,     setEmail]     = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [role,      setRole]      = useState<"ADMIN" | "MANAGER">("MANAGER");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handleInvite = async () => {
    if (!email.trim()) { setError("Email is required."); return; }
    setSaving(true); setError(null);
    try {
      await teamService.invite({ email: email.trim(), firstName: firstName.trim() || undefined, lastName: lastName.trim() || undefined, role });
      onInvited();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to send invite.");
    } finally { setSaving(false); }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "14px", width: "100%", maxWidth: "420px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)" }}>Invite Team Member</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Email *</label>
            <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={fieldGroup}>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "MANAGER")}>
              <option value="MANAGER">Manager — day-to-day content (News, Blog, Site Content)</option>
              <option value="ADMIN">Admin — full access, including Branding and Team</option>
            </select>
          </div>
          {error && <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px" }}>{error}</div>}
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px 14px", background: "none", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleInvite} disabled={saving} style={{ flex: 1, padding: "9px 14px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Confirm remove ─────────────────────────────────────────────────────────────
function ConfirmRemove({ name, onConfirm, onCancel }: { name: string; onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onCancel}>
      <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "12px", width: "100%", maxWidth: "360px", padding: "24px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px" }}>Remove {name}?</div>
        <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>They'll lose access immediately. This can't be undone.</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "9px", background: "none", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px", color: "var(--color-text-muted)", cursor: "pointer" }}>Cancel</button>
          <button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }} disabled={loading} style={{ flex: 1, padding: "9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function TeamPage() {
  const { user } = useAuth();
  const [members,   setMembers]   = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [removing,  setRemoving]  = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = () => {
    setIsLoading(true);
    teamService.list().then((res) => setMembers(res.data.data.members)).catch(() => setError("Failed to load team.")).finally(() => setIsLoading(false));
  };
  useEffect(fetchMembers, []);

  if (user && user.role !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>Team management is visible to Admins only.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>Team</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>Who has access to this dashboard.</p>
        </div>
        <button onClick={() => setShowInvite(true)} style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          + Invite
        </button>
      </div>

      {error && <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "16px" }}>{error}</div>}

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px", color: "var(--color-text-muted)" }}>
          <Spinner size={16} />
          <span style={{ fontSize: "13px" }}>Loading...</span>
        </div>
      ) : (
        <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", overflow: "hidden" }}>
          {members.map((m, i) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: i < members.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>{memberName(m)}</div>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{m.email}</div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-secondary)", background: "var(--color-bg-subtle)", padding: "3px 8px", borderRadius: "6px", textTransform: "uppercase" }}>{m.role}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: STATUS_COLOR[m.accountStatus] ?? "var(--color-text-muted)" }}>{m.accountStatus}</span>
              {m.id !== user?.id && (
                <button onClick={() => setRemoving(m)} style={{ padding: "6px 10px", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", cursor: "pointer", color: "#ef4444" }}>Remove</button>
              )}
            </div>
          ))}
        </div>
      )}

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={fetchMembers} />}
      {removing && (
        <ConfirmRemove name={memberName(removing)} onConfirm={async () => { await teamService.remove(removing.id); fetchMembers(); setRemoving(null); }} onCancel={() => setRemoving(null)} />
      )}
    </div>
  );
}
