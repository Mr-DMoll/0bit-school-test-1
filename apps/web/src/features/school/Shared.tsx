"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, MapPin, ChevronRight, ExternalLink } from "lucide-react";
import type { SchoolConfig, NewsItem, StaffMember } from "./data";

// ─── Social icons (lucide-react v1 dropped brand/logo icons) ─────────────────
function FacebookIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" /></svg>;
}
function TwitterIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.5l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65z" /></svg>;
}
function YoutubeIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.28-1.04-1.1-1.86-2.14-2.14C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.36.56C1.6 4.34.78 5.16.5 6.2.0 8.16.0 12 .0 12s0 3.84.5 5.8c.28 1.04 1.1 1.86 2.14 2.14 1.96.56 9.36.56 9.36.56s7.4 0 9.36-.56c1.04-.28 1.86-1.1 2.14-2.14C24 15.84 24 12 24 12s0-3.84-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" /></svg>;
}

// ─── Small shared bits ─────────────────────────────────────────────────────────

export function CategoryChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide" style={{ backgroundColor: `${color}22`, color }}>
      {label}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">{children}</p>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const BASE_NAV_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Student Life", href: "/student-life" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Resources", href: "/resources" },
];

export function Nav({ school, showBlog }: { school: SchoolConfig; showBlog?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = showBlog
    ? [...BASE_NAV_LINKS.slice(0, 5), { label: "Blog", href: "/blog" }, ...BASE_NAV_LINKS.slice(5)]
    : BASE_NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-background transition-shadow ${scrolled ? "shadow-sm" : ""}`} style={{ borderBottom: `1px solid var(--border)` }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 shrink-0" aria-label="Home">
          {school.logoUrl ? (
            <img src={school.logoUrl} alt={school.schoolName} className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0" style={{ backgroundColor: school.accentColor }}>
              {school.schoolName[0]}
            </div>
          )}
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-sm font-semibold text-foreground font-display">{school.schoolName}</div>
            <div className="text-[11px] text-muted-foreground">{school.motto}</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === href ? "font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              style={pathname === href ? { color: school.accentColor } : {}}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-4 px-4 py-2 text-sm font-semibold rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
          >
            Login
          </Link>
          <Link
            href="/admissions"
            className="ml-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: school.accentColor, ["--tw-ring-color" as string]: school.accentColor }}
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-foreground rounded-md hover:bg-muted transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background px-5 pb-5 pt-2" style={{ borderTop: `1px solid var(--border)` }}>
          <div className="flex flex-col gap-0.5">
            <Link href="/" onClick={() => setOpen(false)} className={`text-left px-3 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted ${pathname === "/" ? "font-semibold" : "text-muted-foreground"}`} style={pathname === "/" ? { color: school.accentColor } : {}}>Home</Link>
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`text-left px-3 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted ${pathname === href ? "font-semibold" : "text-muted-foreground"}`} style={pathname === href ? { color: school.accentColor } : {}}>{label}</Link>
            ))}
            <Link href="/admissions" onClick={() => setOpen(false)} className="mt-2 px-4 py-3 text-sm font-semibold text-white rounded-lg text-center" style={{ backgroundColor: school.accentColor }}>
              Apply for Admission
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-semibold rounded-lg text-center border border-border text-foreground">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer({ school }: { school: SchoolConfig }) {
  const socials = [
    { Icon: FacebookIcon, href: school.socialFacebook, label: "Facebook" },
    { Icon: TwitterIcon,  href: school.socialTwitter,  label: "X (Twitter)" },
    { Icon: YoutubeIcon,  href: school.socialYoutube,  label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            {school.logoUrl ? (
              <img src={school.logoUrl} alt={school.schoolName} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: school.accentColor }}>
                {school.schoolName[0]}
              </div>
            )}
            <div>
              <div className="font-display font-bold text-sm leading-tight">{school.schoolName}</div>
              <div className="text-xs opacity-60 leading-tight">{school.motto}</div>
            </div>
          </div>
          {school.footerBio && (
            <p className="text-sm opacity-60 leading-relaxed mb-5">{school.footerBio}</p>
          )}
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }} aria-label={label}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">Quick Links</p>
          <ul className="space-y-2">
            {[["/", "home"], ["/about", "about"], ["/academics", "academics"], ["/admissions", "admissions"], ["/student-life", "student life"], ["/news", "news"]].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm opacity-70 hover:opacity-100 transition-opacity capitalize">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">Contact</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <MapPin size={14} className="shrink-0 opacity-50 mt-0.5" />
              <span className="text-sm opacity-70 leading-snug">{school.address}</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={14} className="shrink-0 opacity-50" />
              <a href={`tel:${school.phone}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{school.phone}</a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={14} className="shrink-0 opacity-50" />
              <a href={`mailto:${school.email}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{school.email}</a>
            </li>
          </ul>
        </div>

        {/* DBE / Compliance */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">Compliance</p>
          <ul className="space-y-2">
            {["DBE National", "Gauteng DoE", "SACE", "UMALUSI", "NEEDU Reports", "Section 21 Status"].map(link => (
              <li key={link}>
                <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1.5">
                  <ExternalLink size={11} className="opacity-50" />{link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-40">
          <span>© {new Date().getFullYear()} {school.schoolName}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Emthonjeni wa Ulwazi — Source of Knowledge</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>Built by <a href="https://0bit.studio" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity underline underline-offset-2">Zero Bit Studio</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Stat Strip ───────────────────────────────────────────────────────────────

export function StatStrip({ stats, accent }: { stats: SchoolConfig["stats"]; accent: string }) {
  const items = [
    { value: `${stats.passRate}%`, label: "Matric Pass Rate" },
    { value: stats.learnerCount.toLocaleString("en-US"), label: "Enrolled Learners" },
    { value: `${new Date().getFullYear() - stats.yearEstablished}`, label: "Years of Excellence" },
    { value: stats.ratio, label: "Learner:Teacher Ratio" },
  ];
  return (
    <div className="bg-secondary">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(({ value, label }, i) => (
          <div key={i} className="text-center">
            <div className="font-display font-black text-5xl sm:text-6xl leading-none mb-2" style={{ color: accent }}>{value}</div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────

export function NewsCard({ item, accent }: { item: NewsItem; accent: string }) {
  return (
    <Link href="/news" className="bg-card rounded-2xl overflow-hidden flex flex-col border border-border hover:shadow-md transition-shadow cursor-pointer group block">
      <div className="aspect-[16/10] bg-muted overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <CategoryChip label={item.category} color={accent} />
          <span className="text-xs text-muted-foreground">{item.date}</span>
        </div>
        <h3 className="font-display font-bold text-lg leading-snug mb-2 text-foreground">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.excerpt}</p>
        <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: accent }}>
          Read more <ChevronRight size={14} />
        </div>
      </div>
    </Link>
  );
}

// ─── Staff Card ───────────────────────────────────────────────────────────────

export function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border text-center group">
      <div className="aspect-square bg-muted overflow-hidden">
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="font-display font-bold text-base text-foreground">{member.name}</div>
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-0.5">{member.role}</div>
        <div className="text-sm text-muted-foreground mt-1">{member.subject}</div>
      </div>
    </div>
  );
}

// ─── CTABanner ────────────────────────────────────────────────────────────────

export function CTABanner({ school }: { school: SchoolConfig }) {
  return (
    <section className="py-20 px-5 sm:px-8 text-white" style={{ backgroundColor: school.accentColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
          {school.ctaTitle}
        </h2>
        <p className="text-lg opacity-80 max-w-xl mx-auto mb-10 leading-relaxed">
          {school.ctaBody}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admissions"
            className="px-8 py-4 bg-white font-semibold text-base rounded-xl hover:bg-secondary transition-colors"
            style={{ color: school.accentColor }}
          >
            Apply for Admission
          </Link>
          <Link href="/contact" className="px-8 py-4 border-2 border-white/40 text-white font-semibold text-base rounded-xl hover:bg-white/10 transition-colors">
            Contact Us
          </Link>
        </div>
        {school.ctaBullets.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center text-sm opacity-70">
            {school.ctaBullets.map((b, i) => <span key={i}>✓ {b}</span>)}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Page Hero (shared inner-page hero) ──────────────────────────────────────

export function PageHero({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <div className="py-16 sm:py-24 border-b border-border" style={{ backgroundColor: "var(--muted)" }}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.0] mb-5 text-foreground">
          {title.split(" ").map((word, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? <em className="not-italic" style={{ color: accent }}>{word}</em> : word}{" "}
            </span>
          ))}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}
