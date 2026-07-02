"use client";

import { FileText, Download } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel, NewsCard, PageHero } from "./Shared";

export function NewsPage({ school }: { school: SchoolConfig }) {
  return (
    <>
      <PageHero title="News & Events" subtitle="Announcements, achievements, and stories from our community." accent={school.accentColor} />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20">
        {school.newsItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {school.newsItems.map(item => (
              <NewsCard key={item.id} item={item} accent={school.accentColor} />
            ))}
          </div>
        )}

        {/* Newsletter Archive */}
        {school.newsletters.length > 0 && (
          <div className="mt-20">
            <SectionLabel>Newsletters</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Newsletter Archive</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {school.newsletters.map(({ title, date }) => (
                <div key={title} className="flex items-center justify-between bg-card border border-border rounded-xl px-6 py-4">
                  <div className="flex items-center gap-4">
                    <FileText size={18} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">{title}</div>
                      <div className="text-xs text-muted-foreground">{date}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: school.accentColor }}>
                    <Download size={13} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
