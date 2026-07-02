"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/context/AuthContext";
import { schoolService, type SchoolSettings } from "@/shared/services/school.service";
import { postService, type Post } from "@/shared/services/post.service";
import { Spinner } from "@/shared/components/ui/Spinner";

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h3>
        {action}
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

export function AdminOverviewPage() {
  const { user } = useAuth();
  const [school, setSchool] = useState<SchoolSettings | null>(null);
  const [posts,  setPosts]  = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolService.get(), postService.list()])
      .then(([s, p]) => {
        setSchool(s.data.data.school);
        setPosts(p.data.data.posts);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--color-text-muted)" }}>
      <Spinner size={16} />
      <span style={{ fontSize: "13px" }}>Loading...</span>
    </div>
  );

  const news = posts.filter(p => p.type === "NEWS");
  const blog = posts.filter(p => p.type === "BLOG");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>
          Welcome, {user?.firstName ?? "there"}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          Here's how {school?.schoolName ?? "your school's site"} looks right now.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
        <div style={{ padding: "16px 20px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>News Posts</p>
          <p style={{ fontSize: "30px", fontWeight: 300, color: "var(--color-accent)", lineHeight: 1 }}>{news.length}</p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>Shown on your site</p>
        </div>
        <div style={{ padding: "16px 20px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Blog Posts</p>
          <p style={{ fontSize: "30px", fontWeight: 300, color: "var(--color-accent)", lineHeight: 1 }}>{blog.length}</p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>{blog.length === 0 ? "Hidden until you add one" : "Visible on your site"}</p>
        </div>
        <div style={{ padding: "16px 20px", background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)" }}>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Last Updated</p>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>
            {school ? new Date(school.updatedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>Site content</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Card title="Your Site" action={<Link href="/" target="_blank" style={{ fontSize: "12px", color: "var(--color-accent)", textDecoration: "none" }}>View live →</Link>}>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            <strong>{school?.schoolName}</strong> — {school?.motto}
          </p>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "8px", lineHeight: 1.6 }}>{school?.principalMessage}</p>
          <Link href="/admin/site" style={{ display: "inline-block", marginTop: "12px", fontSize: "12px", fontWeight: 600, color: "var(--color-accent)", textDecoration: "none" }}>
            Edit site →
          </Link>
        </Card>

        <Card title="News" action={<Link href="/admin/work" style={{ fontSize: "12px", color: "var(--color-accent)", textDecoration: "none" }}>Manage →</Link>}>
          {news.length === 0
            ? <p style={{ fontSize: "13px", color: "var(--color-text-muted)", textAlign: "center", padding: "20px 0" }}>No news added yet</p>
            : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {news.slice(0, 4).map((n, i) => (
                  <div key={n.id} style={{ padding: "9px 0", borderBottom: i < Math.min(news.length, 4) - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-primary)" }}>{n.title}</p>
                  </div>
                ))}
              </div>
            )
          }
        </Card>
      </div>
    </div>
  );
}
