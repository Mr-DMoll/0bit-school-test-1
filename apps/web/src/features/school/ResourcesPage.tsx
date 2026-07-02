"use client";

import { FileText, Shield, Trophy, ExternalLink, Download } from "lucide-react";
import type { SchoolConfig } from "./data";
import { PageHero } from "./Shared";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  "Forms & Applications": FileText,
  "Policies": Shield,
  "Academic Results": Trophy,
  "DBE Notices & Links": ExternalLink,
};

function getIcon(cat: string) {
  return CATEGORY_ICONS[cat] ?? FileText;
}

export function ResourcesPage({ school }: { school: SchoolConfig }) {
  return (
    <>
      <PageHero title="Resources" subtitle="Forms, policies, results, and official links — all in one place." accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 space-y-12">
        {/* Parent Portal CTA */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-8 rounded-2xl" style={{ backgroundColor: school.accentSoft }}>
          <div>
            <div className="font-display font-bold text-xl mb-1">Parent Portal</div>
            <p className="text-sm text-muted-foreground">Access your child's marks, attendance, and communication history online.</p>
          </div>
          <a href={school.parentPortalUrl || "#"} className="shrink-0 flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: school.accentColor }}>
            Access Portal <ExternalLink size={14} />
          </a>
        </div>

        {/* Resource grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {school.resourceLinks.map(({ cat, items }) => {
            const Icon = getIcon(cat);
            return (
              <div key={cat} className="bg-card border border-border rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: school.accentColor + "18" }}>
                    <Icon size={16} style={{ color: school.accentColor }} />
                  </div>
                  <h3 className="font-display font-bold text-lg">{cat}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                      <span className="text-sm text-foreground">{item}</span>
                      <button className="flex items-center gap-1 text-xs font-semibold shrink-0 ml-4" style={{ color: school.accentColor }}>
                        <Download size={12} /> Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
