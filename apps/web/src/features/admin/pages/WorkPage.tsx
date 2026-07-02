"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { postService, type Post } from "@/shared/services/post.service";
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

// ─── Add/Edit modal ─────────────────────────────────────────────────────────────
function PostModal({ initial, defaultType, onClose, onSave }: {
  initial?: Partial<Post>;
  defaultType: "NEWS" | "BLOG";
  onClose: () => void;
  onSave: (data: Partial<Post>) => Promise<void>;
}) {
  const isEdit = !!initial?.id;
  const [type,     setType]     = useState<"NEWS" | "BLOG">(initial?.type ?? defaultType);
  const [title,    setTitle]    = useState(initial?.title    ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [excerpt,  setExcerpt]  = useState(initial?.excerpt  ?? "");
  const [body,     setBody]     = useState(initial?.body     ?? "");
  const [image,    setImage]    = useState(initial?.image    ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !excerpt.trim()) { setError("Title and excerpt are required."); return; }
    setSaving(true); setError(null);
    try {
      await onSave({
        type,
        title: title.trim(), excerpt: excerpt.trim(),
        category: category.trim() || null,
        body: body.trim() || null,
        image: image.trim() || null,
        published,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save.");
    } finally { setSaving(false); }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onClose}>
      <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "14px", width: "100%", maxWidth: "480px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)" }}>{isEdit ? "Edit Post" : "Add Post"}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value as "NEWS" | "BLOG")}>
              <option value="NEWS">News</option>
              <option value="BLOG">Blog</option>
            </select>
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Class of 2025 Matric Results" />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Category</label>
            <input style={inputStyle} value={category ?? ""} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Academics, Sport, Facilities" />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Excerpt *</label>
            <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Body</label>
            <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={body ?? ""} onChange={(e) => setBody(e.target.value)} placeholder="Full post content (optional)" />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={image ?? ""} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)", cursor: "pointer" }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published (visible on the public site)
          </label>
          {error && <div style={{ marginTop: "12px", fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px" }}>{error}</div>}
        </div>
        <div style={{ display: "flex", gap: "10px", padding: "16px 24px", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px 14px", background: "none", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "9px 14px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Post"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Confirm delete ───────────────────────────────────────────────────────────
function ConfirmDelete({ title, onConfirm, onCancel }: { title: string; onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onCancel}>
      <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "12px", width: "100%", maxWidth: "360px", padding: "24px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px" }}>Delete "{title}"?</div>
        <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>This can't be undone.</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "9px", background: "none", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px", color: "var(--color-text-muted)", cursor: "pointer" }}>Cancel</button>
          <button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }} disabled={loading} style={{ flex: 1, padding: "9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function WorkPage() {
  const [tab,       setTab]       = useState<"NEWS" | "BLOG">("NEWS");
  const [items,     setItems]     = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd,   setShowAdd]   = useState(false);
  const [editing,   setEditing]   = useState<Post | null>(null);
  const [deleting,  setDeleting]  = useState<Post | null>(null);

  const fetchItems = () => {
    setIsLoading(true);
    postService.list().then((res) => setItems(res.data.data.posts)).finally(() => setIsLoading(false));
  };
  useEffect(fetchItems, []);

  const filtered = items.filter((p) => p.type === tab);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>News &amp; Blog</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            News is always visible. Blog only appears on the public site once you publish at least one blog post.
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          + Add Post
        </button>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "1px solid var(--color-border)" }}>
        {(["NEWS", "BLOG"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px", fontSize: "13px", fontWeight: 600, background: "none", border: "none",
              borderBottom: tab === t ? "2px solid var(--color-accent)" : "2px solid transparent",
              color: tab === t ? "var(--color-text-primary)" : "var(--color-text-muted)",
              cursor: "pointer", marginBottom: "-1px",
            }}
          >
            {t === "NEWS" ? "News" : "Blog"} ({items.filter((p) => p.type === t).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px", color: "var(--color-text-muted)" }}>
          <Spinner size={16} />
          <span style={{ fontSize: "13px" }}>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "16px" }}>No {tab === "NEWS" ? "news" : "blog"} posts yet.</p>
          <button onClick={() => setShowAdd(true)} style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            Add your first post
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", overflow: "hidden" }}>
              {p.image && (
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
              )}
              <div style={{ padding: "14px 16px" }}>
                {!p.published && (
                  <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)", padding: "2px 6px", borderRadius: "4px", marginBottom: "6px", textTransform: "uppercase" }}>Draft</span>
                )}
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>{p.title}</p>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{p.excerpt}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditing(p)} style={{ flex: 1, padding: "6px 10px", fontSize: "12px", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: "pointer", color: "var(--color-text-secondary)" }}>Edit</button>
                  <button onClick={() => setDeleting(p)} style={{ padding: "6px 10px", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <PostModal defaultType={tab} onClose={() => setShowAdd(false)} onSave={async (d) => { await postService.create(d); fetchItems(); }} />
      )}
      {editing && (
        <PostModal initial={editing} defaultType={tab} onClose={() => setEditing(null)} onSave={async (d) => { await postService.update(editing.id, d); fetchItems(); setEditing(null); }} />
      )}
      {deleting && (
        <ConfirmDelete title={deleting.title} onConfirm={async () => { await postService.delete(deleting.id); fetchItems(); setDeleting(null); }} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
