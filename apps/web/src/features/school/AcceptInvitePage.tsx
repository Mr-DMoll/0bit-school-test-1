"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { useSchoolBrand } from "@/shared/context/SchoolBrandContext";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "#fff",
  border: "1px solid var(--border)",
  borderRadius: "8px", fontSize: "14px", color: "var(--foreground)",
  outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600,
  color: "var(--muted-foreground)", marginBottom: "6px",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

export function AcceptInvitePage() {
  const router = useRouter();
  const { accentColor, logoUrl, schoolName } = useSchoolBrand();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token || !email) { setError("This invite link is missing required info."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setLoading(true);
    try {
      await authService.setPassword({ token, email, password });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "This invite link is invalid or has expired.");
      setLoading(false);
    }
  };

  return (
    <div className="school-site" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", background: "var(--background)",
    }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          {logoUrl ? (
            <img src={logoUrl} alt={schoolName} style={{
              width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover",
              margin: "0 auto 16px",
            }} />
          ) : (
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: accentColor, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", fontWeight: 800, fontSize: "18px",
            }}>
              {schoolName[0]}
            </div>
          )}
          <h1 className="font-display" style={{ fontSize: "26px", fontWeight: 700, color: "var(--foreground)", marginBottom: "4px" }}>
            Welcome
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Set a password to activate your account</p>
        </div>

        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" }}>
          {done ? (
            <p style={{ fontSize: "14px", color: "var(--foreground)", textAlign: "center" }}>
              Password set — redirecting you to sign in...
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.6 }} />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(193,52,46,0.08)", border: "1px solid rgba(193,52,46,0.25)", borderRadius: "8px", fontSize: "13px", color: "#b3261e" }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "12px",
                  background: accentColor, border: "none", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 700, color: "#fff",
                  cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Setting password…" : "Activate Account"}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px" }}>
          <a href="/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>← Back to the website</a>
        </p>
      </div>
    </div>
  );
}
