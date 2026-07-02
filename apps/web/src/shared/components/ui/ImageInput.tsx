"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, Link2, X, RefreshCw } from "lucide-react";
import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

interface Props {
  value:    string;
  onChange: (url: string) => void;
  onSave?:  (url: string) => Promise<void>;
  label?:   string;
  aspect?:  "square" | "landscape" | "portrait";
}

export function ImageInput({ value, onChange, onSave, label, aspect = "landscape" }: Props) {
  const [mode, setMode]         = useState<"drop" | "url">("drop");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [imgError, setImgError] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const inputRef                = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); return; }
    if (file.size > 8 * 1024 * 1024)    { setError("File too large (max 8 MB)."); return; }
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.post<{ data: { url: string } }>(endpoints.upload, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data.url;
      setImgError(false);
      onChange(url);
      if (onSave) {
        setSaving(true);
        try { await onSave(url); } finally { setSaving(false); }
      }
    } catch {
      setError("Upload failed. Try pasting a URL instead.");
    } finally {
      setUploading(false);
    }
  }, [onChange, onSave]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const busy = uploading || saving;

  const labelEl = label && (
    <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
      {label}
    </div>
  );

  // ── Has a value: show preview with change/remove overlay ─────────────────
  if (value && !imgError) {
    return (
      <div>
        {labelEl}
        <div style={{
          position: "relative",
          display: "inline-block",
          width:  aspect === "portrait" ? "160px" : aspect === "square" ? "160px" : "100%",
          maxWidth: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          aspectRatio: aspect === "portrait" ? "3/4" : aspect === "square" ? "1/1" : undefined,
        }}>
          <img
            src={value}
            alt={label ?? "Preview"}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: aspect === "landscape" ? "180px" : "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay on hover — icon buttons that fit any container size */}
          <div className="img-input-overlay" style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            opacity: 0, transition: "opacity 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              title="Change image"
              style={{ width: "34px", height: "34px", background: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <RefreshCw size={14} style={{ color: "#1C1A17" }} />
            </button>
            <button
              type="button"
              onClick={() => { onChange(""); setImgError(false); }}
              title="Remove image"
              style={{ width: "34px", height: "34px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <X size={14} style={{ color: "#fff" }} />
            </button>
          </div>
          {busy && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>{uploading ? "Uploading…" : "Saving…"}</span>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>{error}</p>}
      </div>
    );
  }

  // ── No value (or broken URL): show upload UI ─────────────────────────────
  return (
    <div>
      {labelEl}

      {/* If the stored URL is broken, show a warning */}
      {imgError && value && (
        <div style={{ fontSize: "12px", color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "7px", padding: "8px 12px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Stored image could not load. Upload a new one.</span>
          <button type="button" onClick={() => { onChange(""); setImgError(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: "#92400e", fontWeight: 600 }}>Clear</button>
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
        {(["drop", "url"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} style={{
            padding: "5px 12px", fontSize: "12px", fontWeight: mode === m ? 600 : 400,
            color: mode === m ? "var(--color-accent)" : "var(--color-text-muted)",
            background: "none", border: "none",
            borderBottom: mode === m ? "2px solid var(--color-accent)" : "2px solid transparent",
            cursor: "pointer",
          }}>
            {m === "drop"
              ? <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Upload size={11} /> Upload file</span>
              : <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Link2 size={11} /> Paste URL</span>}
          </button>
        ))}
      </div>

      {mode === "drop" && (
        <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
          {/* Thumbnail drop target */}
          <div
            onClick={() => !busy && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{
              width: aspect === "landscape" ? "140px" : "100px",
              flexShrink: 0,
              aspectRatio: aspect === "square" ? "1/1" : aspect === "portrait" ? "3/4" : "16/9",
              border: `2px dashed ${dragging ? "var(--color-accent)" : "var(--color-border)"}`,
              borderRadius: "10px",
              cursor: busy ? "default" : "pointer",
              background: dragging ? "color-mix(in srgb, var(--color-accent) 6%, transparent)" : "var(--color-bg)",
              transition: "border-color 0.15s, background 0.15s",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
            {busy
              ? <span style={{ fontSize: "11px", color: "var(--color-text-muted)", textAlign: "center", padding: "4px" }}>{uploading ? "Uploading…" : "Saving…"}</span>
              : <Upload size={18} style={{ color: "var(--color-text-muted)", opacity: 0.4 }} />
            }
          </div>
          {/* Instruction text beside the thumbnail */}
          {!busy && (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
              <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Drag & drop or{" "}
                <span
                  style={{ color: "var(--color-accent)", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => inputRef.current?.click()}
                >
                  click to browse
                </span>
              </span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)", opacity: 0.6 }}>JPEG, PNG, WebP, GIF · Max 8 MB</span>
            </div>
          )}
        </div>
      )}

      {mode === "url" && (
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => { setImgError(false); onChange(e.target.value); }}
          style={{
            width: "100%", padding: "9px 12px", fontSize: "13px",
            color: "var(--color-text-primary)", background: "var(--color-bg)",
            border: "1px solid var(--color-border)", borderRadius: "8px",
            outline: "none", boxSizing: "border-box",
          }}
        />
      )}

      {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>{error}</p>}
    </div>
  );
}
