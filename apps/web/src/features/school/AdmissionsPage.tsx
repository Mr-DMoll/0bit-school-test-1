"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel, PageHero, CTABanner } from "./Shared";

export function AdmissionsPage({ school }: { school: SchoolConfig }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    { n: "01", title: "Download the Form",    desc: "Download the official application form from the Resources page, or collect a printed copy from the school office." },
    { n: "02", title: "Gather Documents",     desc: "Compile all required documents (see checklist below). Incomplete applications cannot be processed." },
    { n: "03", title: "Submit Application",   desc: `Submit the completed form and documents in person at the school office, or via email to ${school.email}.` },
    { n: "04", title: "Assessment Interview", desc: "Applicants are invited to an assessment and interview session, typically held in October." },
    { n: "05", title: "Receive Outcome",      desc: "Outcomes are communicated by 30 November. Successful applicants receive an acceptance pack with fee and uniform details." },
    { n: "06", title: "Confirm Placement",    desc: "Confirm your acceptance by paying the registration fee and returning the signed placement confirmation form by 15 January." },
  ];

  return (
    <>
      <PageHero title="Admissions" subtitle="Enrolling learners for the upcoming academic year." accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20 space-y-20">
        {/* Steps */}
        <div>
          <SectionLabel>How to Apply</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-10">Application Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="bg-card border border-border rounded-2xl p-7">
                <div className="font-display font-black text-4xl mb-4 opacity-20" style={{ color: school.accentColor }}>{n}</div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist + Fees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionLabel>Required Documents</SectionLabel>
            <h2 className="font-display font-black text-3xl mb-6">Document Checklist</h2>
            <ul className="space-y-3">
              {school.admissionsDocs.map(doc => (
                <li key={doc} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: school.accentColor }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: school.accentColor }} />
                  </span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>School Fees</SectionLabel>
            <h2 className="font-display font-black text-3xl mb-6">Fee Schedule</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {school.admissionsFees.map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-center px-6 py-4 text-sm ${i < arr.length - 1 ? "border-b border-border" : "font-semibold text-foreground bg-muted"}`}>
                  <span className={i === arr.length - 1 ? "font-semibold" : "text-muted-foreground"}>{label}</span>
                  <span style={i === arr.length - 1 ? { color: school.accentColor } : {}}>{value}</span>
                </div>
              ))}
            </div>
            {school.admissionsFeeNote && (
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{school.admissionsFeeNote}</p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <SectionLabel>FAQs</SectionLabel>
          <h2 className="font-display font-black text-3xl sm:text-4xl mb-8">Common Questions</h2>
          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card">
            {school.admissionsFAQ.map(({ q, a }, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between text-left px-6 py-5 gap-4 hover:bg-muted transition-colors">
                  <span className="font-medium text-foreground text-sm sm:text-base">{q}</span>
                  <ChevronDown size={16} className={`shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Key dates */}
        <div className="p-8 rounded-2xl" style={{ backgroundColor: school.accentSoft }}>
          <SectionLabel>Key Dates</SectionLabel>
          <h2 className="font-display font-black text-3xl mb-6">Admission Timeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {school.admissionsKeyDates.map(({ date, event }) => (
              <div key={event} className="bg-white rounded-xl p-5">
                <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: school.accentColor }}>{date}</div>
                <div className="font-display font-bold text-base text-foreground">{event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CTABanner school={school} />
    </>
  );
}
