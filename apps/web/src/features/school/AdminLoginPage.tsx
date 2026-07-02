"use client";

import { useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
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

export function AdminLoginPage() {
  const { login } = useAuth();
  const { schoolName, accentColor, logoUrl } = useSchoolBrand();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message ?? "Invalid email or password.");
      } else if (err.code === "ECONNABORTED") {
        setError("The server took too long to respond. Please try again in a moment.");
      } else {
        setError("Couldn't reach the server. Check your connection and try again.");
      }
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
            {schoolName}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Admin sign in</p>
        </div>

        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "28px",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com" required style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password" required style={inputStyle}
              />
            </div>

            {error && (
              <div style={{
                padding: "10px 14px", background: "rgba(193,52,46,0.08)",
                border: "1px solid rgba(193,52,46,0.25)", borderRadius: "8px",
                fontSize: "13px", color: "#b3261e",
              }}>
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
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px" }}>
          <a href="/" style={{ color: "var(--muted-foreground)", textDecoration: "none" }}>← Back to the website</a>
        </p>
      </div>
    </div>
  );
}
