"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { SchoolConfig } from "./data";
import { SectionLabel, PageHero } from "./Shared";

export function ContactPage({ school }: { school: SchoolConfig }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", subject: school.contactSubjects[0] ?? "General Enquiry" });

  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Reach out via phone, email, or the form below." accent={school.accentColor} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <SectionLabel>Get in Touch</SectionLabel>
              <h2 className="font-display font-black text-3xl mb-6">School Office</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: school.accentColor + "18" }}>
                    <Phone size={16} style={{ color: school.accentColor }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Phone</div>
                    <a href={`tel:${school.phone}`} className="text-sm font-medium hover:underline">{school.phone}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: school.accentColor + "18" }}>
                    <Mail size={16} style={{ color: school.accentColor }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Email</div>
                    <a href={`mailto:${school.email}`} className="text-sm font-medium hover:underline">{school.email}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: school.accentColor + "18" }}>
                    <MapPin size={16} style={{ color: school.accentColor }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Address</div>
                    <p className="text-sm font-medium">{school.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: school.accentColor + "18" }}>
                    <Clock size={16} style={{ color: school.accentColor }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Office Hours</div>
                    {school.officeHours.split("\n").map((line, i) => (
                      <p key={i} className={`text-sm ${i > 0 ? "text-muted-foreground" : ""}`}>{line}</p>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden bg-muted aspect-video flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <MapPin size={32} className="mx-auto opacity-30" />
                <p>Map — {school.address}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <SectionLabel>Send a Message</SectionLabel>
            <h2 className="font-display font-black text-3xl mb-8">Contact Form</h2>

            {sent ? (
              <div className="p-10 bg-card border border-border rounded-2xl text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#4A6B4D20" }}>
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Message Sent</h3>
                <p className="text-muted-foreground text-sm">Thank you! We will respond within 2 working days.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold" style={{ color: school.accentColor }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2" placeholder="+27 ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2">
                      {school.contactSubjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none" placeholder="How can we help you?" />
                </div>
                <button type="submit" className="w-full py-4 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: school.accentColor }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
