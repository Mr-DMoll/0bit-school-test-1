"use client";

import type { SchoolConfig } from "./data";
import { SectionLabel, StaffCard, CTABanner, PageHero } from "./Shared";

export function AboutPage({ school }: { school: SchoolConfig }) {
  return (
    <>
      <PageHero title="About Us" subtitle={school.aboutSubtitle} accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 space-y-20">
        {/* History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-[1.05] mb-6" style={{ color: school.accentColor }}>Est. {school.stats.yearEstablished}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {school.aboutHistory.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
            {school.aboutHistoryImage ? (
              <img src={school.aboutHistoryImage} alt="School history" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&auto=format" alt="School classroom" className="w-full h-full object-cover" loading="lazy" />
            )}
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Our Mission", text: school.mission },
            { label: "Our Vision",  text: school.vision  },
          ].map(({ label, text }) => (
            <div key={label} className="p-8 rounded-2xl" style={{ backgroundColor: school.accentSoft }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: school.accentColor }}>{label}</p>
              <p className="text-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Principal & SGB */}
        <div>
          <SectionLabel>Leadership</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-10">Principal &amp; Governing Body</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                {school.principalPhoto && (
                  <img src={school.principalPhoto} alt={school.principalName} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="p-6">
                <div className="font-display font-bold text-xl">{school.principalName}</div>
                <div className="text-sm text-muted-foreground mt-1">Principal</div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-4 text-muted-foreground leading-relaxed">
              <p>{school.principalMessage}</p>
              {school.sgbBody.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
        </div>

        {/* Staff Directory */}
        {school.staffList.length > 0 && (
          <div>
            <SectionLabel>Our Educators</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl mb-10">Meet the Staff</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {school.staffList.map(m => <StaffCard key={m.name} member={m} />)}
            </div>
          </div>
        )}

        {/* Awards */}
        <div className="bg-muted rounded-2xl p-10">
          <SectionLabel>Recognition</SectionLabel>
          <h2 className="font-display font-black text-3xl mb-8">Awards &amp; Accreditations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {school.awards.map(({ year, title }) => (
              <div key={`${year}-${title}`} className="flex gap-4 bg-card border border-border rounded-xl p-4">
                <span className="font-display font-black text-sm mt-0.5 shrink-0" style={{ color: school.accentColor }}>{year}</span>
                <span className="text-sm text-foreground">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner school={school} />
    </>
  );
}
