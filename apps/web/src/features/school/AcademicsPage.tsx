"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel, CTABanner, PageHero } from "./Shared";

export function AcademicsPage({ school }: { school: SchoolConfig }) {
  const [activeGrade, setActiveGrade] = useState<string>("Grade 10");

  const gradeGroups = [
    { label: "Grade 8",  phase: "Senior Phase",   subjects: ["Mathematics / Mathematical Literacy", "English Home Language", "isiZulu First Additional", "Life Orientation", "Natural Sciences & Technology", "Social Sciences", "Creative Arts", "Economic & Management Sciences"] },
    { label: "Grade 9",  phase: "Senior Phase",   subjects: ["Mathematics / Mathematical Literacy", "English Home Language", "isiZulu First Additional", "Life Orientation", "Natural Sciences & Technology", "Social Sciences", "Creative Arts", "Economic & Management Sciences"] },
    { label: "Grade 10", phase: "FET Phase",       subjects: ["Mathematics or Mathematical Literacy", "English HL", "isiZulu HL or FAL", "Life Orientation", "3 Elective Subjects (from streams below)"] },
    { label: "Grade 11", phase: "FET Phase",       subjects: ["Mathematics or Mathematical Literacy", "English HL", "isiZulu HL or FAL", "Life Orientation", "3 Elective Subjects (from streams below)"] },
    { label: "Grade 12", phase: "NSC (Matric)",   subjects: ["Mathematics or Mathematical Literacy", "English HL", "isiZulu HL or FAL", "Life Orientation", "3 Elective Subjects", "Preliminary Examinations (August)", "National Senior Certificate (November)"] },
  ];

  return (
    <>
      <PageHero title="Academics" subtitle="CAPS-aligned teaching across all phases, with streams designed to open every door." accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 space-y-20">
        {/* Streams */}
        <div>
          <SectionLabel>Subject Streams</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-10">FET Phase Streams (Grades 10–12)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {school.academicStreams.map(({ name, desc, subjects }) => (
              <div key={name} className="border border-border bg-card rounded-2xl p-7">
                <div className="w-2 h-8 rounded-full mb-5" style={{ backgroundColor: school.accentColor }} />
                <h3 className="font-display font-bold text-xl mb-2">{name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-1.5">
                  {subjects.map(s => <li key={s} className="text-sm text-foreground flex items-center gap-2"><span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: school.accentColor }} />{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Grade breakdown */}
        <div>
          <SectionLabel>Grade by Grade</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Subject Breakdown</h2>
          <div className="flex gap-2 flex-wrap mb-8">
            {gradeGroups.map(g => (
              <button key={g.label} onClick={() => setActiveGrade(g.label)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${activeGrade === g.label ? "text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`} style={activeGrade === g.label ? { backgroundColor: school.accentColor, borderColor: school.accentColor } : {}}>
                {g.label}
              </button>
            ))}
          </div>
          {gradeGroups.filter(g => g.label === activeGrade).map(g => (
            <div key={g.label} className="bg-card border border-border rounded-2xl p-8">
              <div className="font-display font-black text-2xl mb-1">{g.label}</div>
              <div className="text-sm text-muted-foreground mb-6">{g.phase}</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {g.subjects.map(s => (
                  <li key={s} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: school.accentColor + "20" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: school.accentColor }} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Term Dates */}
        {school.termDates.length > 0 && (
          <div>
            <SectionLabel>Academic Calendar</SectionLabel>
            <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Term Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {school.termDates.map(({ term, start, end }) => (
                <div key={term} className="bg-card border border-border rounded-2xl p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: school.accentColor }}>{term}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Calendar size={13} /> <span>{start}</span></div>
                  <div className="text-xs text-muted-foreground">to</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1"><Calendar size={13} /> <span>{end}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic support */}
        <div className="bg-muted rounded-2xl p-10">
          <SectionLabel>Extra Support</SectionLabel>
          <h2 className="font-display font-black text-3xl mb-6">Academic Support Programmes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            {school.academicSupport.map(({ title, body }) => (
              <div key={title}><strong className="text-foreground block mb-1">{title}</strong>{body}</div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner school={school} />
    </>
  );
}
