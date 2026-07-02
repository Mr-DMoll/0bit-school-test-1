"use client";

import { ArrowRight } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel, StatStrip, NewsCard, CTABanner } from "./Shared";

export function HomePage({ school }: { school: SchoolConfig }) {

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-foreground">
        <img
          src={school.heroPhoto}
          alt={`${school.schoolName} campus`}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,26,23,0.95) 0%, rgba(28,26,23,0.4) 60%, transparent 100%)" }} />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white/30" style={{ backgroundColor: school.accentColor }}>
                {school.schoolName[0]}
              </div>
              <p className="text-white/60 text-sm font-medium">{school.province} · Est. {school.stats.yearEstablished}</p>
            </div>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white leading-[1.0] mb-5">
              {school.schoolName.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <em className="not-italic" style={{ color: school.accentColor }}>{word}</em> : word}{" "}
                </span>
              ))}
            </h1>
            <p className="text-white/70 text-xl sm:text-2xl italic font-display mb-10">{school.motto}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/admissions"
                className="px-7 py-4 text-white font-semibold text-base rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                style={{ backgroundColor: school.accentColor }}
              >
                Apply for Admission <ArrowRight size={16} />
              </a>
              <a href="/about" className="px-7 py-4 border border-white/25 text-white font-semibold text-base rounded-xl hover:bg-white/10 transition-colors">
                Learn About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatStrip stats={school.stats} accent={school.accentColor} />

      {/* Principal's Welcome */}
      <section className="py-20 max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/5]">
              <img src={school.principalPhoto} alt={school.principalName} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(28,26,23,0.9) 0%, transparent 100%)" }}>
                <div className="text-white font-display font-bold text-lg leading-tight">{school.principalName}</div>
                <div className="text-white/60 text-sm">Principal</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <SectionLabel>Principal's Welcome</SectionLabel>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-[1.05] text-foreground mb-6">
              A message from<br /><em className="not-italic" style={{ color: school.accentColor }}>our principal</em>
            </h2>
            <p className="text-lg text-muted-foreground leading-[1.75] mb-8">{school.principalMessage}</p>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border max-w-16" />
              <span className="font-display font-bold text-foreground">{school.principalName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <SectionLabel>Why {school.schoolName.split(" ")[0]}</SectionLabel>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-[1.05] text-foreground">
              Built for every learner.<br /><em className="not-italic" style={{ color: school.accentColor }}>Not just the top few.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {school.features.map(({ title, body }, i) => (
              <div key={i} className="bg-card p-7 rounded-2xl border border-border">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 font-display font-black text-lg" style={{ backgroundColor: school.accentColor + "18", color: school.accentColor }}>
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-20 max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Latest News</SectionLabel>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-[1.05] text-foreground">
              From the<br /><em className="not-italic" style={{ color: school.accentColor }}>community</em>
            </h2>
          </div>
          <a href="/news" className="hidden sm:flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all" style={{ color: school.accentColor }}>
            View all news <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {school.newsItems.slice(0, 3).map(item => (
            <NewsCard key={item.id} item={item} accent={school.accentColor} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <a href="/news" className="flex items-center gap-2 text-sm font-semibold" style={{ color: school.accentColor }}>
            View all news <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-20 bg-foreground overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 mb-10">
          <SectionLabel><span className="text-white/50">Life at School</span></SectionLabel>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-[1.05]">
            <em className="not-italic" style={{ color: school.accentColor }}>Moments</em> that matter
          </h2>
        </div>
        <div className="flex gap-4 pl-5 sm:pl-8 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {school.photos.map((src, i) => (
            <div key={i} className="shrink-0 w-72 sm:w-96 aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img src={src} alt={`School life ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
          ))}
          <div className="shrink-0 w-5 sm:w-8" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <SectionLabel>Voices</SectionLabel>
          <h2 className="font-display font-black text-4xl sm:text-5xl leading-[1.05] text-foreground">
            What our community<br /><em className="not-italic" style={{ color: school.accentColor }}>has to say</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {school.testimonials.map(({ quote, author, role }) => (
            <div key={author} className="bg-card border border-border rounded-2xl p-8 flex flex-col">
              <p className="text-base text-foreground leading-relaxed flex-1 italic">&ldquo;{quote}&rdquo;</p>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="font-display font-bold text-sm text-foreground">{author}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTABanner school={school} />
    </>
  );
}
