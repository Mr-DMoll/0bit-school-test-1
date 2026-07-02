"use client";

import { useEffect, useState } from "react";
import { schoolService, type SchoolSettings } from "@/shared/services/school.service";
import { Spinner } from "@/shared/components/ui/Spinner";
import { ImageInput } from "@/shared/components/ui/ImageInput";
import { useAuth } from "@/shared/context/AuthContext";
import { applyAccentColor } from "@/shared/utils/accentColor";

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--color-text-muted)", display: "block", marginBottom: "6px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", fontSize: "13px", color: "var(--color-text-primary)",
  background: "var(--color-bg)", border: "1px solid var(--color-border)",
  borderRadius: "8px", outline: "none", boxSizing: "border-box",
};
const fg: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "16px" };
const card: React.CSSProperties = {
  background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)",
  borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", padding: "20px 24px",
};

// ── Colour presets ────────────────────────────────────────────────────────────
// Four ready-made school colour combinations. Choosing one fills both pickers.

const PRESETS = [
  {
    name: "Terracotta",
    tagline: "Warm & earthy — the classic school feel",
    accent: "#C2542E",
    soft:   "#E8D9C3",
    swatch: ["#C2542E", "#E8D9C3"],
  },
  {
    name: "Forest Green",
    tagline: "Growth, community, and fresh energy",
    accent: "#1B6B45",
    soft:   "#CBE8DA",
    swatch: ["#1B6B45", "#CBE8DA"],
  },
  {
    name: "Ocean Blue",
    tagline: "Trust, excellence, and professionalism",
    accent: "#1A4A7A",
    soft:   "#C8DCF0",
    swatch: ["#1A4A7A", "#C8DCF0"],
  },
  {
    name: "Royal Purple",
    tagline: "Prestige, achievement, and ambition",
    accent: "#5C2D91",
    soft:   "#E2D0F5",
    swatch: ["#5C2D91", "#E2D0F5"],
  },
] as const;

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: subtitle ? "2px" : "16px" }}>{title}</h3>
      {subtitle && <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "16px" }}>{subtitle}</p>}
      {children}
    </div>
  );
}

export function BrandingPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<Partial<SchoolSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    schoolService.get()
      .then((res) => setForm(res.data.data.school))
      .catch(() => setError("Failed to load branding."))
      .finally(() => setIsLoading(false));
  }, []);

  const set = <K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setForm((f) => ({ ...f, accentColor: preset.accent, accentSoft: preset.soft }));
    // Preview immediately in the dashboard
    applyAccentColor(preset.accent);
  };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const { data } = await schoolService.update({
        schoolName: form.schoolName, type: form.type, motto: form.motto,
        accentColor: form.accentColor, accentSoft: form.accentSoft, logoUrl: form.logoUrl,
      });
      setForm((f) => ({ ...f, ...data.data.school }));
      // Apply the saved accent to the live dashboard immediately
      if (data.data.school.accentColor) {
        applyAccentColor(data.data.school.accentColor);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (user && user.role !== "ADMIN") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          Branding is managed by an Admin. Ask your Admin if you need a change made here.
        </p>
      </div>
    );
  }

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--color-text-muted)" }}>
      <Spinner size={16} />
      <span style={{ fontSize: "13px" }}>Loading...</span>
    </div>
  );

  const currentAccent = form.accentColor ?? "#C2542E";
  const currentSoft   = form.accentSoft  ?? "#E8D9C3";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>Branding</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            Name, logo, and colours — used across the public site and this dashboard.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1, whiteSpace: "nowrap" }}
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "20px" }}>{error}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* Left column — Identity + Logo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Section title="Identity">
            <div style={fg}>
              <label style={labelStyle}>School Name</label>
              <input style={inputStyle} value={form.schoolName ?? ""} onChange={(e) => set("schoolName", e.target.value)} />
            </div>
            <div style={fg}>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={form.type ?? "HIGH"} onChange={(e) => set("type", e.target.value as SchoolSettings["type"])}>
                <option value="PRIMARY">Primary School</option>
                <option value="HIGH">Secondary School</option>
              </select>
            </div>
            <div style={{ ...fg, marginBottom: 0 }}>
              <label style={labelStyle}>Motto</label>
              <input style={inputStyle} value={form.motto ?? ""} onChange={(e) => set("motto", e.target.value)} />
            </div>
          </Section>

          <Section title="Logo">
            <ImageInput
              label="Logo Image"
              value={form.logoUrl ?? ""}
              onChange={(url) => set("logoUrl", url)}
              onSave={async (url) => { await schoolService.update({ logoUrl: url }); }}
              aspect="square"
            />
          </Section>
        </div>

        {/* Right column — Colour presets + custom pickers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Section title="Colour Scheme" subtitle="Pick a ready-made combination or fine-tune with the custom pickers below.">
            {/* Preset swatches */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
              {PRESETS.map((preset) => {
                const isActive = currentAccent.toLowerCase() === preset.accent.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                      border: isActive ? `2px solid ${preset.accent}` : "2px solid var(--color-border)",
                      background: isActive ? `${preset.accent}08` : "var(--color-bg)",
                      textAlign: "left", transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {/* Mini swatch pair */}
                    <div style={{ display: "flex", flexShrink: 0 }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "6px 0 0 6px", background: preset.accent }} />
                      <div style={{ width: "22px", height: "22px", borderRadius: "0 6px 6px 0", background: preset.soft }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{preset.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.3, marginTop: "2px" }}>{preset.tagline}</div>
                    </div>
                    {isActive && (
                      <div style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: preset.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live preview strip */}
            <div style={{ borderRadius: "8px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--color-border)" }}>
              <div style={{ height: "8px", background: currentAccent }} />
              <div style={{ padding: "12px 14px", background: currentSoft, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: currentAccent }}>Preview</span>
                <button style={{ fontSize: "11px", padding: "4px 10px", background: currentAccent, color: "#fff", border: "none", borderRadius: "5px", cursor: "default" }}>Button</button>
              </div>
            </div>

            {/* Custom pickers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {([["accentColor", "Accent Colour"], ["accentSoft", "Accent (Soft)"]] as const).map(([key, label]) => (
                <div key={key} style={fg}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={form[key] ?? "#000000"}
                      onChange={(e) => {
                        set(key, e.target.value);
                        if (key === "accentColor") applyAccentColor(e.target.value);
                      }}
                      style={{ width: "36px", height: "36px", padding: "2px", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: "pointer", flexShrink: 0 }}
                    />
                    <input
                      style={{ ...inputStyle, marginBottom: 0 }}
                      value={form[key] ?? ""}
                      onChange={(e) => {
                        set(key, e.target.value);
                        if (key === "accentColor" && e.target.value.match(/^#[0-9a-fA-F]{6}$/)) {
                          applyAccentColor(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

      </div>
    </div>
  );
}
