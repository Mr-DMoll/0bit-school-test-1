"use client";

import { useEffect, useState } from "react";
import { analyticsService, type AnalyticsSummary } from "@/shared/services/analytics.service";
import { Spinner } from "@/shared/components/ui/Spinner";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", padding: "20px 24px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "16px" }}>{title}</h3>
      {children}
    </div>
  );
}

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsService.summary()
      .then((res) => setData(res.data.data))
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--color-text-muted)" }}>
      <Spinner size={16} />
      <span style={{ fontSize: "13px" }}>Loading...</span>
    </div>
  );

  if (error || !data) return (
    <div style={{ fontSize: "13px", color: "#ef4444", padding: "40px 0", textAlign: "center" }}>{error}</div>
  );

  const max = Math.max(1, ...data.last14Days.map((d) => d.count));
  const last7Total = data.last14Days.slice(-7).reduce((sum, d) => sum + d.count, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>Analytics</h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          Pageviews on the public site. Counts raw visits — no unique-visitor or device breakdown.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
        <div style={{ padding: "16px 20px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>All-Time Views</p>
          <p style={{ fontSize: "30px", fontWeight: 300, color: "var(--color-accent)", lineHeight: 1 }}>{data.totalViews}</p>
        </div>
        <div style={{ padding: "16px 20px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Last 7 Days</p>
          <p style={{ fontSize: "30px", fontWeight: 300, color: "var(--color-accent)", lineHeight: 1 }}>{last7Total}</p>
        </div>
      </div>

      <Card title="Views — Last 14 Days">
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
          {data.last14Days.map((d) => (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
              <div
                title={`${d.date}: ${d.count}`}
                style={{
                  width: "100%", maxWidth: "28px",
                  height: `${Math.max(2, (d.count / max) * 90)}px`,
                  background: "var(--color-accent)", borderRadius: "4px 4px 0 0",
                }}
              />
              <span style={{ fontSize: "9px", color: "var(--color-text-muted)" }}>{d.date.slice(8, 10)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Top Pages">
        {data.topPages.length === 0 ? (
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>No pageviews recorded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.topPages.map((p) => (
              <div key={p.path} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--color-text-primary)", fontFamily: "monospace", flex: 1 }}>{p.path || "/"}</span>
                <div style={{ flex: 2, height: "6px", background: "var(--color-bg-subtle)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(p.count / data.topPages[0].count) * 100}%`, background: "var(--color-accent)" }} />
                </div>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)", width: "32px", textAlign: "right" }}>{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
