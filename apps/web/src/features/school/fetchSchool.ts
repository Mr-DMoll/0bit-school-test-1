import type {
  SchoolConfig, NewsItem, SchoolFeature,
  Award, AcademicStream, AcademicSupport, FeeItem, FAQItem, KeyDate,
  ActivityGroup, CalendarEvent, ResourceGroup, Newsletter,
} from "./data";

const DEFAULT_ABOUT_HISTORY = [
  "This school was founded in the heart of our community, born out of a determination to provide quality education for all. Every learner who walks through our gates is welcomed as family.",
  "Over the decades, we have grown from a modest facility into a thriving school — producing doctors, engineers, artists, community leaders, and entrepreneurs across South Africa and the world.",
  "We are registered with and inspected by the Department of Education, and our results are certified by Umalusi, South Africa's quality council for general and further education.",
];
const DEFAULT_AWARDS: Award[] = [
  { year: "2024", title: "Top 10 Public Schools — Provincial DoE" },
  { year: "2023", title: "National Schools Excellence Award — DBE" },
  { year: "2022", title: "Best Matric Results — Regional" },
  { year: "2021", title: "Commendation for School Management" },
  { year: "2019", title: "Sector Education Award — SACE" },
  { year: "2018", title: "40 Years of Excellence Commemorative Recognition" },
];
const DEFAULT_SGB_BODY = [
  "The School Governing Body (SGB) is constituted in accordance with the South African Schools Act (SASA) and comprises elected representatives of parents, educators, non-teaching staff, and learners.",
  "The SGB meets quarterly and is responsible for overseeing school policy, budgets, and the overall governance of the institution. Parent involvement is actively encouraged at all levels.",
];
const DEFAULT_STREAMS: AcademicStream[] = [
  { name: "Science Stream", desc: "Mathematics, Physical Sciences, Life Sciences. Pathway to medicine, engineering, and the sciences.", subjects: ["Physical Sciences", "Life Sciences", "Mathematics", "Geography (opt.)"] },
  { name: "Commerce Stream", desc: "Accounting, Business Studies, Economics. Pathway to finance, law, management, and entrepreneurship.", subjects: ["Accounting", "Business Studies", "Economics", "Mathematics / ML"] },
  { name: "Humanities Stream", desc: "History, Geography, Consumer Studies. Pathway to social sciences, education, arts, and civil service.", subjects: ["History", "Geography", "Consumer Studies", "Tourism (opt.)"] },
];
const DEFAULT_ACADEMIC_SUPPORT: AcademicSupport[] = [
  { title: "Extra Lessons", body: "After-school extra lessons are offered Monday–Thursday for Grade 10–12 in core subjects at no additional charge." },
  { title: "Saturday School", body: "Grade 12 learners attend Saturday morning sessions from Term 2 to prepare for the National Senior Certificate examination." },
  { title: "Peer Tutoring", body: "Top-performing Grade 11 and 12 learners mentor their peers in a structured programme that benefits both tutor and tutee." },
  { title: "University Preparation", body: "Grade 12 learners receive guidance on NSFAS applications, university procedures, and bursary opportunities from Term 1." },
];
const DEFAULT_ADMISSIONS_DOCS = [
  "Completed application form (original)",
  "Certified copy of learner's birth certificate",
  "Certified copy of parent/guardian ID",
  "Proof of residence (not older than 3 months)",
  "Most recent school report",
  "Transfer letter from previous school",
  "Immunisation card",
  "2 recent passport-size photographs",
];
const DEFAULT_ADMISSIONS_FEES: FeeItem[] = [
  { label: "Annual School Fee", value: "R 2,800" },
  { label: "Registration Fee (new learners)", value: "R 350" },
  { label: "Stationery Pack (optional)", value: "R 280" },
  { label: "Sport Levy", value: "R 200" },
  { label: "Annual Total (approx.)", value: "R 3,630" },
];
const DEFAULT_FAQ: FAQItem[] = [
  { q: "When do applications open and close?", a: "Applications open 1 July and close 30 September. Late applications are considered only if space remains." },
  { q: "Is there a school fee?", a: "Yes. Fee exemption applications are available for qualifying families — please contact the school office." },
  { q: "What is the school's catchment area?", a: "We give first preference to learners residing within our designated feeder area. Learners outside this zone are accepted where space allows." },
  { q: "Are bursaries or financial assistance available?", a: "Full and partial fee exemptions are available. Our Bursary Fund offers merit-based bursaries for new entrants. Contact the office for forms." },
  { q: "Do you offer late applications?", a: "Late applications are accepted from October onwards and processed in order of receipt if space remains." },
  { q: "What uniform is required?", a: "The school has a formal uniform. Full policy and supplier details are provided in the acceptance pack after placement is confirmed." },
];
const DEFAULT_KEY_DATES: KeyDate[] = [
  { date: "1 July 2025", event: "Applications Open" },
  { date: "30 Sep 2025", event: "Applications Close" },
  { date: "October 2025", event: "Assessment Interviews" },
  { date: "30 Nov 2025", event: "Outcomes Communicated" },
];
const DEFAULT_ACTIVITIES: ActivityGroup[] = [
  { cat: "Sport", items: ["Soccer (Boys & Girls)", "Netball", "Athletics", "Cricket", "Chess", "Table Tennis", "Volleyball", "Cross Country"] },
  { cat: "Culture & Arts", items: ["School Choir", "Drama & Theatre", "Dance Ensemble", "Visual Arts Club", "Creative Writing", "School Orchestra"] },
  { cat: "Clubs & Societies", items: ["Debate Society", "Science Club", "Robotics Club", "Environmental Club", "Entrepreneurship Society", "Community Service Club"] },
];
const DEFAULT_CALENDAR: CalendarEvent[] = [
  { date: "15 Mar", title: "Annual Prize-Giving Ceremony" },
  { date: "10 Apr", title: "Sports Day" },
  { date: "2 May", title: "Heritage Language Festival" },
  { date: "27 Jun", title: "Arts & Culture Evening" },
  { date: "14 Aug", title: "Science Expo — Interschool" },
  { date: "20 Sep", title: "Graduation Day (Grade 12)" },
  { date: "10 Oct", title: "Matric Farewell" },
  { date: "5 Dec", title: "End-of-Year Concert" },
];
const DEFAULT_RESOURCES: ResourceGroup[] = [
  { cat: "Forms & Applications", items: ["Grade 8 Application Form", "Fee Exemption Application Form", "Transfer Letter Request Form", "Indemnity Form — School Tours", "After-School Activity Consent Form", "Bursary Application Form"] },
  { cat: "Policies", items: ["Code of Conduct (Learner)", "Uniform Policy", "Bullying & Harassment Policy", "Substance Abuse Policy", "Cell Phone Policy", "Assessment Policy (CAPS Aligned)"] },
  { cat: "Academic Results", items: ["NSC Results 2024 (Matric)", "NSC Results 2023 (Matric)", "NSC Results 2022 (Matric)", "Annual Report 2024", "Annual Report 2023", "NEEDU Inspection Report 2022"] },
  { cat: "DBE Notices & Links", items: ["National Curriculum Statement (CAPS)", "NSFAS Application Portal", "Umalusi Certification", "SA Schools Act (SASA)", "Gauteng Education Online Portal", "SACE Professional Standards"] },
];
const DEFAULT_CONTACT_SUBJECTS = ["General Enquiry", "Admissions", "Academic Query", "Finance / Fees", "SGB Related"];
const DEFAULT_NEWSLETTERS: Newsletter[] = [
  { title: "Term 1 Newsletter 2025", date: "March 2025" },
  { title: "Term 4 Newsletter 2024", date: "December 2024" },
  { title: "Term 3 Newsletter 2024", date: "September 2024" },
  { title: "Term 2 Newsletter 2024", date: "June 2024" },
];

const DEFAULT_FEATURES: SchoolFeature[] = [
  { title: "Academic Excellence", body: "CAPS-aligned curriculum with dedicated science, commerce, and humanities streams. Extra lessons and academic support built into the school week." },
  { title: "Sport & Extracurriculars", body: "Over 20 codes of sport, a full cultural programme, and societies ranging from robotics to drama. Every learner finds their edge." },
  { title: "Modern Facilities", body: "Computer lab, science laboratory, library, and sports grounds — all maintained to give learners the environment they deserve." },
  { title: "Ubuntu Values", body: "We develop the whole person. Our values — integrity, respect, perseverance, and community — shape learners long after they leave." },
];

// Server-only: called from page.tsx/layout.tsx (Server Components), never
// from "use client" files. Adapts the API's normalized shape (separate
// School/Post/StaffMember/etc rows) back into the SchoolConfig shape every
// page component already expects, so no page component needs to change.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// A slow/unreachable API must never hang a page forever — cap every request
// here so a down backend fails fast (throws) instead of stalling the render.
const FETCH_TIMEOUT_MS = 8000;

function apiFetch(path: string) {
  return fetch(`${BASE_URL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function fetchSchool(): Promise<SchoolConfig> {
  const [schoolRes, newsRes] = await Promise.all([
    apiFetch("/school"),
    apiFetch("/posts?type=NEWS"),
  ]);
  const schoolJson = await schoolRes.json();
  const newsJson = await newsRes.json();
  const s = schoolJson.data.school;
  const newsPosts = newsJson.data.posts as any[];

  const newsItems: NewsItem[] = newsPosts.map((p, i) => ({
    id: i + 1,
    title: p.title,
    date: formatDate(p.date),
    category: p.category ?? "",
    excerpt: p.excerpt,
    image: p.image ?? "",
  }));

  return {
    schoolName: s.schoolName,
    motto: s.motto,
    accentColor: s.accentColor,
    accentSoft: s.accentSoft,
    logoUrl: s.logoUrl ?? "",
    address: s.address,
    phone: s.phone,
    email: s.email,
    principalName: s.principalName,
    principalPhoto: s.principalPhoto ?? "",
    principalMessage: s.principalMessage,
    stats: {
      passRate: s.passRate,
      learnerCount: s.learnerCount,
      yearEstablished: s.yearEstablished,
      ratio: s.ratio,
    },
    type: s.type === "PRIMARY" ? "primary" : "high",
    province: s.province,
    heroPhoto: s.heroPhoto ?? "",
    photos: (s.photos ?? []).map((p: any) => p.url),
    staffList: (s.staff ?? []).map((m: any) => ({
      name: m.name, role: m.role, subject: m.subject ?? "", photo: m.photo ?? "",
    })),
    newsItems,
    termDates: (s.termDates ?? []).map((t: any) => ({
      term: t.term,
      start: formatDate(t.start),
      end: formatDate(t.end),
    })),
    testimonials: (s.testimonials ?? []).map((t: any) => ({
      quote: t.quote, author: t.author, role: t.role,
    })),
    features: Array.isArray(s.features) && s.features.length > 0
      ? (s.features as SchoolFeature[])
      : DEFAULT_FEATURES,
    socialFacebook: s.socialFacebook ?? "",
    socialTwitter:  s.socialTwitter  ?? "",
    socialYoutube:  s.socialYoutube  ?? "",
    footerBio: s.footerBio ?? "",
    ctaTitle:   s.ctaTitle   ?? "Be part of something extraordinary.",
    ctaBody:    s.ctaBody    ?? "Applications are open. Join a community that believes in every learner's potential.",
    ctaBullets: Array.isArray(s.ctaBullets) && s.ctaBullets.length > 0
      ? s.ctaBullets
      : ["Applications close 30 September", "Grade 8 & Grade 1 intake", "No application fee"],
    // About
    aboutSubtitle:    s.aboutSubtitle    ?? "Years of community, learning, and growth.",
    aboutHistory:     Array.isArray(s.aboutHistory)    && s.aboutHistory.length    > 0 ? s.aboutHistory    : DEFAULT_ABOUT_HISTORY,
    aboutHistoryImage: s.aboutHistoryImage ?? "",
    mission:          s.mission           ?? "To provide a safe, inclusive, and academically rigorous environment where every learner achieves their full potential, develops strong character, and embraces the values of ubuntu.",
    vision:           s.vision            ?? "To be recognised as the leading community school in our province — producing confident, compassionate, and capable citizens who contribute meaningfully to a democratic South Africa.",
    sgbBody:          Array.isArray(s.sgbBody)          && s.sgbBody.length          > 0 ? s.sgbBody          : DEFAULT_SGB_BODY,
    awards:           Array.isArray(s.awards)           && s.awards.length           > 0 ? (s.awards as Award[])           : DEFAULT_AWARDS,
    // Academics
    academicStreams:  Array.isArray(s.academicStreams)  && s.academicStreams.length  > 0 ? (s.academicStreams as AcademicStream[])  : DEFAULT_STREAMS,
    academicSupport:  Array.isArray(s.academicSupport) && s.academicSupport.length  > 0 ? (s.academicSupport as AcademicSupport[]) : DEFAULT_ACADEMIC_SUPPORT,
    // Admissions
    admissionsDocs:     Array.isArray(s.admissionsDocs)     && s.admissionsDocs.length     > 0 ? s.admissionsDocs     : DEFAULT_ADMISSIONS_DOCS,
    admissionsFees:     Array.isArray(s.admissionsFees)     && s.admissionsFees.length     > 0 ? (s.admissionsFees as FeeItem[])  : DEFAULT_ADMISSIONS_FEES,
    admissionsFeeNote:  s.admissionsFeeNote  ?? "Fee exemption applications are available. Families earning below the threshold (3x annual fee) may qualify for partial or full exemption. Visit the office for an application form.",
    admissionsFAQ:      Array.isArray(s.admissionsFAQ)      && s.admissionsFAQ.length      > 0 ? (s.admissionsFAQ as FAQItem[])   : DEFAULT_FAQ,
    admissionsKeyDates: Array.isArray(s.admissionsKeyDates) && s.admissionsKeyDates.length > 0 ? (s.admissionsKeyDates as KeyDate[]) : DEFAULT_KEY_DATES,
    // Student Life
    studentActivities: Array.isArray(s.studentActivities) && s.studentActivities.length > 0 ? (s.studentActivities as ActivityGroup[]) : DEFAULT_ACTIVITIES,
    calendarEvents:    Array.isArray(s.calendarEvents)    && s.calendarEvents.length    > 0 ? (s.calendarEvents as CalendarEvent[])    : DEFAULT_CALENDAR,
    // Resources
    resourceLinks:   Array.isArray(s.resourceLinks) && s.resourceLinks.length > 0 ? (s.resourceLinks as ResourceGroup[]) : DEFAULT_RESOURCES,
    parentPortalUrl: s.parentPortalUrl ?? "#",
    // Contact
    officeHours:     s.officeHours     ?? "Mon–Fri: 07h30 – 15h30",
    contactSubjects: Array.isArray(s.contactSubjects) && s.contactSubjects.length > 0 ? s.contactSubjects : DEFAULT_CONTACT_SUBJECTS,
    // News
    newsletters: Array.isArray(s.newsletters) && s.newsletters.length > 0 ? (s.newsletters as Newsletter[]) : DEFAULT_NEWSLETTERS,
  };
}

// Blog only shows up in the public nav once at least one Blog post exists.
export async function fetchHasBlog(): Promise<boolean> {
  const res = await apiFetch("/posts?type=BLOG");
  const json = await res.json();
  return (json.data?.posts?.length ?? 0) > 0;
}

export async function fetchBlogPosts(): Promise<NewsItem[]> {
  const res = await apiFetch("/posts?type=BLOG");
  const json = await res.json();
  return (json.data?.posts ?? []).map((p: any, i: number) => ({
    id: i + 1,
    title: p.title,
    date: formatDate(p.date),
    category: p.category ?? "",
    excerpt: p.excerpt,
    image: p.image ?? "",
  }));
}
