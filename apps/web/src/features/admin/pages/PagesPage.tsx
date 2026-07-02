"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { schoolService, type SchoolSettings } from "@/shared/services/school.service";
import { Spinner } from "@/shared/components/ui/Spinner";
import { ImageInput } from "@/shared/components/ui/ImageInput";

// ── Shared style tokens ──────────────────────────────────────────────────────
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

// ── Reusable sub-editors ────────────────────────────────────────────────────

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: subtitle ? "2px" : "16px" }}>{title}</h3>
      {subtitle && <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "16px" }}>{subtitle}</p>}
      {children}
    </div>
  );
}

/** Edits a string[] where each entry is one item. Shows numbered rows with add/remove. */
function ListEditor({
  label, value, onChange, placeholder,
}: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const items = value.length > 0 ? value : [""];
  return (
    <div style={fg}>
      <label style={labelStyle}>{label}</label>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
          <input
            style={{ ...inputStyle, marginBottom: 0 }}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "4px" }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}

/** Edits { a: string; b: string }[] pairs with custom labels */
function PairListEditor<T extends Record<string, string>>({
  label, value, onChange, keyA, keyB, labelA, labelB, placeholderA, placeholderB,
}: {
  label: string; value: T[]; onChange: (v: T[]) => void;
  keyA: keyof T; keyB: keyof T; labelA: string; labelB: string;
  placeholderA?: string; placeholderB?: string;
}) {
  const items = value.length > 0 ? value : [{ [keyA]: "", [keyB]: "" } as T];
  return (
    <div style={fg}>
      <label style={labelStyle}>{label}</label>
      {items.map((item, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "6px", marginBottom: "6px", alignItems: "center" }}>
          <input style={{ ...inputStyle, marginBottom: 0 }} value={item[keyA] as string} placeholder={placeholderA ?? String(labelA)}
            onChange={(e) => { const next = [...items]; next[i] = { ...next[i], [keyA]: e.target.value }; onChange(next); }} />
          <input style={{ ...inputStyle, marginBottom: 0 }} value={item[keyB] as string} placeholder={placeholderB ?? String(labelB)}
            onChange={(e) => { const next = [...items]; next[i] = { ...next[i], [keyB]: e.target.value }; onChange(next); }} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "4px", flexShrink: 0 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "var(--color-text-muted)", marginBottom: "4px", paddingLeft: "2px" }}>
        <span style={{ flex: 1 }}>{labelA}</span><span style={{ flex: 1 }}>{labelB}</span><span style={{ width: "26px" }} />
      </div>
      <button type="button" onClick={() => onChange([...items, { [keyA]: "", [keyB]: "" } as T])} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
        <Plus size={13} /> Add row
      </button>
    </div>
  );
}

// ── TABS ────────────────────────────────────────────────────────────────────

const TABS = ["About", "Academics", "Admissions", "Student Life", "Resources", "Contact", "News"] as const;
type Tab = typeof TABS[number];

// ── Main component ──────────────────────────────────────────────────────────

export function PagesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("About");
  const [form, setForm] = useState<Partial<SchoolSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    schoolService.get()
      .then((res) => setForm(res.data.data.school))
      .catch(() => setError("Failed to load page content."))
      .finally(() => setIsLoading(false));
  }, []);

  const set = <K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const { data } = await schoolService.update({
        // About
        aboutSubtitle: form.aboutSubtitle, aboutHistory: form.aboutHistory,
        aboutHistoryImage: form.aboutHistoryImage, mission: form.mission, vision: form.vision,
        sgbBody: form.sgbBody, awards: form.awards,
        // Academics
        academicStreams: form.academicStreams, academicSupport: form.academicSupport,
        // Admissions
        admissionsDocs: form.admissionsDocs, admissionsFees: form.admissionsFees,
        admissionsFeeNote: form.admissionsFeeNote, admissionsFAQ: form.admissionsFAQ,
        admissionsKeyDates: form.admissionsKeyDates,
        // Student Life
        studentActivities: form.studentActivities, calendarEvents: form.calendarEvents,
        // Resources
        resourceLinks: form.resourceLinks, parentPortalUrl: form.parentPortalUrl,
        // Contact
        officeHours: form.officeHours, contactSubjects: form.contactSubjects,
        // News
        newsletters: form.newsletters,
      } as Partial<SchoolSettings>);
      setForm((f) => ({ ...f, ...data.data.school }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--color-text-muted)" }}>
      <Spinner size={16} /><span style={{ fontSize: "13px" }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>Pages</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>Edit content shown on each public page of your school site.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ padding: "9px 20px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1, whiteSpace: "nowrap" }}>
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "16px" }}>{error}</div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid var(--color-border)", marginBottom: "24px", overflowX: "auto" }}>
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "9px 16px", fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "var(--color-accent)" : "var(--color-text-muted)", background: "none", border: "none", borderBottom: active ? "2px solid var(--color-accent)" : "2px solid transparent", marginBottom: "-1px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s" }}>
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── About tab ──────────────────────────────────────────────────────── */}
      {activeTab === "About" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "860px" }}>
          <Card title="Page Hero" subtitle="The subtitle shown under 'About Us' at the top of the page.">
            <div style={fg}>
              <label style={labelStyle}>Hero Subtitle</label>
              <input style={inputStyle} value={form.aboutSubtitle ?? ""} onChange={(e) => set("aboutSubtitle", e.target.value)} placeholder="Years of community, learning, and growth." />
            </div>
          </Card>

          <Card title="Our Story" subtitle="History text and the history section image.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>
              <div>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={fg}>
                    <label style={labelStyle}>Paragraph {i + 1}</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                      value={(form.aboutHistory ?? [])[i] ?? ""}
                      onChange={(e) => {
                        const next = [...(form.aboutHistory ?? ["", "", ""])];
                        next[i] = e.target.value;
                        set("aboutHistory", next as any);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <ImageInput
                  label="History Image"
                  value={form.aboutHistoryImage ?? ""}
                  onChange={(url) => set("aboutHistoryImage", url)}
                  onSave={async (url) => { await schoolService.update({ aboutHistoryImage: url }); }}
                  aspect="landscape"
                />
              </div>
            </div>
          </Card>

          <Card title="Mission & Vision">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={fg}>
                <label style={labelStyle}>Mission</label>
                <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} value={form.mission ?? ""} onChange={(e) => set("mission", e.target.value)} />
              </div>
              <div style={fg}>
                <label style={labelStyle}>Vision</label>
                <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }} value={form.vision ?? ""} onChange={(e) => set("vision", e.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="School Governing Body" subtitle="Shown alongside the principal's message on the About page.">
            {[0, 1].map((i) => (
              <div key={i} style={fg}>
                <label style={labelStyle}>Paragraph {i + 1}</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                  value={(form.sgbBody ?? [])[i] ?? ""}
                  onChange={(e) => {
                    const next = [...(form.sgbBody ?? ["", ""])];
                    next[i] = e.target.value;
                    set("sgbBody", next as any);
                  }}
                />
              </div>
            ))}
          </Card>

          <Card title="Awards & Accreditations" subtitle="Enter year and award name. These appear in the recognition grid.">
            <PairListEditor
              label="Awards"
              value={(form.awards ?? []) as { year: string; title: string }[]}
              onChange={(v) => set("awards", v as any)}
              keyA="year" keyB="title"
              labelA="Year" labelB="Award / Accreditation"
              placeholderA="2024" placeholderB="Top 10 Public Schools — Gauteng DoE"
            />
          </Card>
        </div>
      )}

      {/* ── Academics tab ──────────────────────────────────────────────────── */}
      {activeTab === "Academics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <Card title="FET Phase Streams" subtitle="The three subject streams shown on the Academics page (Grades 10–12).">
            {(() => {
              const streams = (form.academicStreams ?? [{ name: "", desc: "", subjects: [] }, { name: "", desc: "", subjects: [] }, { name: "", desc: "", subjects: [] }]) as { name: string; desc: string; subjects: string[] }[];
              const setStream = (i: number, key: "name" | "desc" | "subjects", value: string | string[]) => {
                const next = streams.map((s, idx) => idx === i ? { ...s, [key]: value } : s);
                set("academicStreams", next as any);
              };
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {streams.map((stream, i) => (
                    <div key={i} style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stream {i + 1}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={fg}>
                          <label style={labelStyle}>Stream Name</label>
                          <input style={inputStyle} value={stream.name} onChange={(e) => setStream(i, "name", e.target.value)} placeholder="e.g. Science Stream" />
                        </div>
                        <div style={fg}>
                          <label style={labelStyle}>Description</label>
                          <input style={inputStyle} value={stream.desc} onChange={(e) => setStream(i, "desc", e.target.value)} placeholder="Short pathway description..." />
                        </div>
                      </div>
                      <div style={fg}>
                        <label style={labelStyle}>Subjects (one per line)</label>
                        <textarea
                          style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                          value={stream.subjects.join("\n")}
                          onChange={(e) => setStream(i, "subjects", e.target.value.split("\n"))}
                          placeholder={"Physical Sciences\nLife Sciences\nMathematics"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </Card>

          <Card title="Academic Support Programmes" subtitle="Cards in the bottom section of the Academics page.">
            {(() => {
              const support = (form.academicSupport ?? []) as { title: string; body: string }[];
              const setItem = (i: number, key: "title" | "body", value: string) => {
                const next = support.map((s, idx) => idx === i ? { ...s, [key]: value } : s);
                set("academicSupport", next as any);
              };
              return (
                <div>
                  {support.map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "8px", marginBottom: "8px", alignItems: "start" }}>
                      <input style={{ ...inputStyle, marginBottom: 0 }} value={item.title} placeholder="Programme name" onChange={(e) => setItem(i, "title", e.target.value)} />
                      <textarea style={{ ...inputStyle, minHeight: "64px", resize: "vertical" }} value={item.body} placeholder="Description..." onChange={(e) => setItem(i, "body", e.target.value)} />
                      <button type="button" onClick={() => set("academicSupport", support.filter((_, j) => j !== i) as any)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "10px 4px" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => set("academicSupport", [...support, { title: "", body: "" }] as any)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginTop: "4px" }}>
                    <Plus size={13} /> Add programme
                  </button>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* ── Admissions tab ─────────────────────────────────────────────────── */}
      {activeTab === "Admissions" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Card title="Document Checklist" subtitle="Required documents list on the Admissions page.">
              <ListEditor
                label="Required Documents"
                value={(form.admissionsDocs ?? []) as string[]}
                onChange={(v) => set("admissionsDocs", v as any)}
                placeholder="e.g. Certified copy of birth certificate"
              />
            </Card>

            <Card title="FAQ" subtitle="Questions and answers shown in the accordion.">
              {(() => {
                const faqs = (form.admissionsFAQ ?? []) as { q: string; a: string }[];
                const setFaq = (i: number, key: "q" | "a", value: string) => {
                  const next = faqs.map((f, idx) => idx === i ? { ...f, [key]: value } : f);
                  set("admissionsFAQ", next as any);
                };
                return (
                  <div>
                    {faqs.map((item, i) => (
                      <div key={i} style={{ padding: "12px", border: "1px solid var(--color-border)", borderRadius: "8px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>FAQ {i + 1}</span>
                          <button type="button" onClick={() => set("admissionsFAQ", faqs.filter((_, j) => j !== i) as any)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}><Trash2 size={13} /></button>
                        </div>
                        <div style={fg}><label style={labelStyle}>Question</label><input style={inputStyle} value={item.q} onChange={(e) => setFaq(i, "q", e.target.value)} placeholder="When do applications open?" /></div>
                        <div style={{ ...fg, marginBottom: 0 }}><label style={labelStyle}>Answer</label><textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={item.a} onChange={(e) => setFaq(i, "a", e.target.value)} /></div>
                      </div>
                    ))}
                    <button type="button" onClick={() => set("admissionsFAQ", [...faqs, { q: "", a: "" }] as any)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginTop: "4px" }}>
                      <Plus size={13} /> Add question
                    </button>
                  </div>
                );
              })()}
            </Card>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Card title="Fee Schedule" subtitle="Label + value rows in the fee table. The last row is styled as the total.">
              <PairListEditor
                label="Fee rows"
                value={(form.admissionsFees ?? []) as { label: string; value: string }[]}
                onChange={(v) => set("admissionsFees", v as any)}
                keyA="label" keyB="value"
                labelA="Description" labelB="Amount"
                placeholderA="Annual School Fee" placeholderB="R 2,800"
              />
              <div style={fg}>
                <label style={labelStyle}>Fee Note (shown below table)</label>
                <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.admissionsFeeNote ?? ""} onChange={(e) => set("admissionsFeeNote", e.target.value)} placeholder="Fee exemption applications are available..." />
              </div>
            </Card>

            <Card title="Key Admission Dates">
              <PairListEditor
                label="Timeline entries"
                value={(form.admissionsKeyDates ?? []) as { date: string; event: string }[]}
                onChange={(v) => set("admissionsKeyDates", v as any)}
                keyA="date" keyB="event"
                labelA="Date" labelB="Event"
                placeholderA="1 July 2025" placeholderB="Applications Open"
              />
            </Card>
          </div>
        </div>
      )}

      {/* ── Student Life tab ───────────────────────────────────────────────── */}
      {activeTab === "Student Life" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <Card title="Sport, Culture & Clubs" subtitle="Activity cards on the Student Life page. Each card has a category name and a list of activities.">
            {(() => {
              const groups = (form.studentActivities ?? []) as { cat: string; items: string[] }[];
              const setGroup = (i: number, key: "cat" | "items", value: string | string[]) => {
                const next = groups.map((g, idx) => idx === i ? { ...g, [key]: value } : g);
                set("studentActivities", next as any);
              };
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {groups.map((group, i) => (
                    <div key={i} style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Group {i + 1}</span>
                        <button type="button" onClick={() => set("studentActivities", groups.filter((_, j) => j !== i) as any)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}><Trash2 size={13} /></button>
                      </div>
                      <div style={fg}>
                        <label style={labelStyle}>Category Name</label>
                        <input style={inputStyle} value={group.cat} placeholder="e.g. Sport" onChange={(e) => setGroup(i, "cat", e.target.value)} />
                      </div>
                      <div style={{ ...fg, marginBottom: 0 }}>
                        <label style={labelStyle}>Activities (one per line)</label>
                        <textarea
                          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                          value={group.items.join("\n")}
                          onChange={(e) => setGroup(i, "items", e.target.value.split("\n"))}
                          placeholder={"Soccer (Boys & Girls)\nNetball\nAthletics"}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => set("studentActivities", [...groups, { cat: "", items: [] }] as any)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                    <Plus size={13} /> Add group
                  </button>
                </div>
              );
            })()}
          </Card>

          <Card title="School Calendar" subtitle="Events shown in the calendar grid on the Student Life page.">
            <PairListEditor
              label="Calendar events"
              value={(form.calendarEvents ?? []) as { date: string; title: string }[]}
              onChange={(v) => set("calendarEvents", v as any)}
              keyA="date" keyB="title"
              labelA="Date" labelB="Event Title"
              placeholderA="15 Mar" placeholderB="Annual Prize-Giving Ceremony"
            />
          </Card>
        </div>
      )}

      {/* ── Resources tab ──────────────────────────────────────────────────── */}
      {activeTab === "Resources" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <Card title="Parent Portal" subtitle="The URL and call-to-action shown at the top of the Resources page.">
            <div style={fg}>
              <label style={labelStyle}>Parent Portal URL</label>
              <input type="url" style={inputStyle} value={form.parentPortalUrl ?? ""} onChange={(e) => set("parentPortalUrl", e.target.value)} placeholder="https://portal.yourlms.co.za" />
            </div>
          </Card>

          <Card title="Resource Categories" subtitle="Each card on the Resources page has a category name and a list of downloadable items.">
            {(() => {
              const cats = (form.resourceLinks ?? []) as { cat: string; items: string[] }[];
              const setCat = (i: number, key: "cat" | "items", value: string | string[]) => {
                const next = cats.map((c, idx) => idx === i ? { ...c, [key]: value } : c);
                set("resourceLinks", next as any);
              };
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cats.map((cat, i) => (
                    <div key={i} style={{ padding: "16px", border: "1px solid var(--color-border)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category {i + 1}</span>
                        <button type="button" onClick={() => set("resourceLinks", cats.filter((_, j) => j !== i) as any)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}><Trash2 size={13} /></button>
                      </div>
                      <div style={fg}>
                        <label style={labelStyle}>Category Name</label>
                        <input style={inputStyle} value={cat.cat} placeholder="e.g. Forms & Applications" onChange={(e) => setCat(i, "cat", e.target.value)} />
                      </div>
                      <div style={{ ...fg, marginBottom: 0 }}>
                        <label style={labelStyle}>Items (one per line)</label>
                        <textarea
                          style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
                          value={cat.items.join("\n")}
                          onChange={(e) => setCat(i, "items", e.target.value.split("\n"))}
                          placeholder={"Grade 8 Application Form\nFee Exemption Application Form"}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => set("resourceLinks", [...cats, { cat: "", items: [] }] as any)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                    <Plus size={13} /> Add category
                  </button>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* ── Contact tab ────────────────────────────────────────────────────── */}
      {activeTab === "Contact" && (
        <div style={{ maxWidth: "680px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card title="Office Hours" subtitle="Shown under the clock icon on the Contact page.">
            <div style={fg}>
              <label style={labelStyle}>Office Hours Text</label>
              <textarea
                style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                value={form.officeHours ?? ""}
                onChange={(e) => set("officeHours", e.target.value)}
                placeholder={"Mon–Fri: 07h30 – 15h30\nClosed school holidays"}
              />
              <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>Each line will appear as a separate paragraph.</p>
            </div>
          </Card>

          <Card title="Contact Form Subjects" subtitle="The dropdown options in the Contact form's Subject field.">
            <ListEditor
              label="Subject Options"
              value={(form.contactSubjects ?? []) as string[]}
              onChange={(v) => set("contactSubjects", v as any)}
              placeholder="e.g. General Enquiry"
            />
          </Card>
        </div>
      )}

      {/* ── News tab ───────────────────────────────────────────────────────── */}
      {activeTab === "News" && (
        <div style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card title="Newsletter Archive" subtitle="Files shown in the newsletter archive section on the News page.">
            {(() => {
              const items = (form.newsletters ?? []) as { title: string; date: string }[];
              const setItem = (i: number, key: "title" | "date", value: string) => {
                const next = items.map((n, idx) => idx === i ? { ...n, [key]: value } : n);
                set("newsletters", next as any);
              };
              return (
                <div>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                      <input style={{ ...inputStyle, marginBottom: 0 }} value={item.title} placeholder="Term 1 Newsletter 2025" onChange={(e) => setItem(i, "title", e.target.value)} />
                      <input style={{ ...inputStyle, marginBottom: 0 }} value={item.date} placeholder="March 2025" onChange={(e) => setItem(i, "date", e.target.value)} />
                      <button type="button" onClick={() => set("newsletters", items.filter((_, j) => j !== i) as any)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: "4px" }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "var(--color-text-muted)", paddingLeft: "2px", marginBottom: "6px" }}>
                    <span style={{ flex: 2 }}>Title</span><span style={{ flex: 1 }}>Date</span><span style={{ width: "26px" }} />
                  </div>
                  <button type="button" onClick={() => set("newsletters", [...items, { title: "", date: "" }] as any)} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--color-accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                    <Plus size={13} /> Add newsletter
                  </button>
                </div>
              );
            })()}
          </Card>

          <div style={{ padding: "12px 16px", background: "color-mix(in srgb, var(--color-accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)", borderRadius: "8px", fontSize: "12px", color: "var(--color-text-muted)" }}>
            News articles (posts) are managed under <strong>Work</strong> in the sidebar — create, edit, and publish individual news posts there.
          </div>
        </div>
      )}

    </div>
  );
}
