"use client";

import type { NewsItem, SchoolConfig } from "./data";
import { CategoryChip, PageHero } from "./Shared";
import { ChevronRight } from "lucide-react";

function BlogCard({ item, accent }: { item: NewsItem; accent: string }) {
  return (
    <div className="bg-card rounded-2xl overflow-hidden flex flex-col border border-border hover:shadow-md transition-shadow">
      <div className="aspect-[16/10] bg-muted overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          {item.category && <CategoryChip label={item.category} color={accent} />}
          <span className="text-xs text-muted-foreground">{item.date}</span>
        </div>
        <h3 className="font-display font-bold text-lg leading-snug mb-2 text-foreground">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{item.excerpt}</p>
        <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: accent }}>
          Read more <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

export function BlogPage({ school, posts }: { school: SchoolConfig; posts: NewsItem[] }) {
  return (
    <>
      <PageHero title="Blog" subtitle="Stories, reflections, and updates written by our school community." accent={school.accentColor} />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(item => (
            <BlogCard key={item.id} item={item} accent={school.accentColor} />
          ))}
        </div>
      </div>
    </>
  );
}
