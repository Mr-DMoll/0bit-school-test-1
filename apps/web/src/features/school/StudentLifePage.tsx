"use client";

import type { SchoolConfig } from "./data";
import { SectionLabel, CTABanner, PageHero } from "./Shared";

export function StudentLifePage({ school }: { school: SchoolConfig }) {
  return (
    <>
      <PageHero title="Student Life" subtitle="Sport, culture, leadership, and community — life here is never just about the classroom." accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 space-y-20">
        <div>
          <SectionLabel>Activities</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-10">Sport, Culture &amp; Clubs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {school.studentActivities.map(({ cat, items }) => (
              <div key={cat} className="bg-card border border-border rounded-2xl p-7">
                <h3 className="font-display font-bold text-xl mb-5" style={{ color: school.accentColor }}>{cat}</h3>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: school.accentColor }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {school.photos.length > 0 && (
          <div>
            <SectionLabel>Photo Gallery</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Life in Pictures</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {school.photos.map((src, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden bg-muted ${i === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2" : ""} aspect-[4/3]`}>
                  <img src={src} alt={`School activity ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div>
          <SectionLabel>School Calendar</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {school.calendarEvents.map(({ date, title }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <div className="text-xs font-semibold uppercase tracking-wide shrink-0 text-center pt-0.5" style={{ color: school.accentColor, minWidth: "3.5rem" }}>{date}</div>
                <div className="h-full w-px bg-border" />
                <div className="text-sm text-foreground font-medium leading-snug">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner school={school} />
    </>
  );
}
