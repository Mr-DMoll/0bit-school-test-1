export type PageName = "home" | "about" | "academics" | "admissions" | "student-life" | "news" | "contact" | "resources";

export interface SchoolStats { passRate: number; learnerCount: number; yearEstablished: number; ratio: string; }
export interface NewsItem { id: number; title: string; date: string; category: string; excerpt: string; image: string; }
export interface StaffMember { name: string; role: string; subject: string; photo: string; }
export interface Testimonial { quote: string; author: string; role: string; }

export interface SchoolFeature  { title: string; body: string; }
export interface Award           { year: string; title: string; }
export interface AcademicStream  { name: string; desc: string; subjects: string[]; }
export interface AcademicSupport { title: string; body: string; }
export interface FeeItem         { label: string; value: string; }
export interface FAQItem         { q: string; a: string; }
export interface KeyDate         { date: string; event: string; }
export interface ActivityGroup   { cat: string; items: string[]; }
export interface CalendarEvent   { date: string; title: string; }
export interface ResourceGroup   { cat: string; items: string[]; }
export interface Newsletter      { title: string; date: string; }

export interface SchoolConfig {
  schoolName: string; motto: string; accentColor: string; accentSoft: string; logoUrl: string;
  address: string; phone: string; email: string;
  principalName: string; principalPhoto: string; principalMessage: string;
  stats: SchoolStats; type: "primary" | "high"; province: string;
  heroPhoto: string; photos: string[];
  staffList: StaffMember[]; newsItems: NewsItem[];
  termDates: { term: string; start: string; end: string }[];
  testimonials: Testimonial[];
  features: SchoolFeature[];
  socialFacebook: string; socialTwitter: string; socialYoutube: string;
  footerBio: string;
  ctaTitle: string; ctaBody: string; ctaBullets: string[];
  // About page
  aboutSubtitle: string;
  aboutHistory: string[];
  aboutHistoryImage: string;
  mission: string;
  vision: string;
  sgbBody: string[];
  awards: Award[];
  // Academics page
  academicStreams: AcademicStream[];
  academicSupport: AcademicSupport[];
  // Admissions page
  admissionsDocs: string[];
  admissionsFees: FeeItem[];
  admissionsFeeNote: string;
  admissionsFAQ: FAQItem[];
  admissionsKeyDates: KeyDate[];
  // Student Life page
  studentActivities: ActivityGroup[];
  calendarEvents: CalendarEvent[];
  // Resources page
  resourceLinks: ResourceGroup[];
  parentPortalUrl: string;
  // Contact page
  officeHours: string;
  contactSubjects: string[];
  // News page
  newsletters: Newsletter[];
}

// Demo content — ported as-is from the Figma export. This becomes the
// admin-editable data model in the next pass; for now it's hardcoded so the
// design itself can be reviewed in place.
export const SCHOOL: SchoolConfig = {
  schoolName: "Thandeka Secondary School",
  motto: "Knowledge. Character. Ubuntu.",
  accentColor: "#C2542E",
  accentSoft: "#E8D9C3",
  logoUrl: "",
  address: "14 Mthembu Street, Soweto, Gauteng, 1804",
  phone: "+27 11 938 4421",
  email: "admin@thandeka.edu.za",
  principalName: "Mrs. Nomsa Dlamini",
  principalPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=560&fit=crop&auto=format",
  principalMessage: "At Thandeka Secondary School, we believe every learner carries within them the potential for greatness. Our commitment is to nurture that potential through rigorous academics, strong values, and a community grounded in ubuntu — the understanding that we rise together. I invite you to explore what our school offers and to join our family.",
  stats: { passRate: 94, learnerCount: 1240, yearEstablished: 1978, ratio: "1:28" },
  type: "high",
  province: "Gauteng",
  heroPhoto: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=900&fit=crop&auto=format",
  photos: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&h=500&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&h=500&fit=crop&auto=format",
  ],
  staffList: [
    { name: "Mrs. Nomsa Dlamini", role: "Principal", subject: "Mathematics", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format" },
    { name: "Mr. Sipho Nkosi", role: "Deputy Principal", subject: "Life Sciences", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format" },
    { name: "Ms. Lerato Mokoena", role: "Head of Department", subject: "English", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&auto=format" },
    { name: "Mr. Tebogo Sithole", role: "Teacher", subject: "Physical Sciences", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format" },
    { name: "Ms. Zanele Khumalo", role: "Teacher", subject: "History", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&auto=format" },
    { name: "Mr. Kabelo Mosia", role: "Teacher", subject: "Accounting", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format" },
    { name: "Ms. Thandi Radebe", role: "Teacher", subject: "Geography", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format" },
    { name: "Mr. Bongani Cele", role: "Teacher", subject: "isiZulu", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format" },
  ],
  newsItems: [
    { id: 1, title: "Class of 2024 Achieves 94% Matric Pass Rate", date: "14 January 2025", category: "Academics", excerpt: "We are proud to announce that our Grade 12 class of 2024 achieved an outstanding 94% pass rate, with 67 distinctions across all subjects.", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&h=460&fit=crop&auto=format" },
    { id: 2, title: "New Science Laboratory Opens for Term 2", date: "3 February 2025", category: "Facilities", excerpt: "Thanks to a partnership with the Gauteng Department of Education, Thandeka now has a fully equipped science laboratory for 35 learners.", image: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=700&h=460&fit=crop&auto=format" },
    { id: 3, title: "Debate Team Wins Gauteng Regional Championship", date: "22 March 2025", category: "Achievements", excerpt: "Our Grade 10 and 11 debate teams swept both the junior and senior categories at the 2025 Gauteng Regional Schools Debate Championship.", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&h=460&fit=crop&auto=format" },
    { id: 4, title: "Annual Sports Day: A Celebration of School Spirit", date: "8 April 2025", category: "Sport", excerpt: "Learners from all grades came together for our annual Sports Day, with track, field, and team events held across the full campus grounds.", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&h=460&fit=crop&auto=format" },
    { id: 5, title: "Bursary Applications Now Open for 2026", date: "1 May 2025", category: "Admissions", excerpt: "The Thandeka Bursary Fund is now accepting applications for the 2026 academic year. Financial need and academic merit are both considered.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=460&fit=crop&auto=format" },
    { id: 6, title: "Grade 9s Complete Career Guidance Programme", date: "19 May 2025", category: "Academics", excerpt: "All Grade 9 learners participated in a two-day career guidance workshop to help them choose their subject streams for Grade 10.", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=460&fit=crop&auto=format" },
  ],
  termDates: [
    { term: "Term 1", start: "15 Jan 2025", end: "28 Mar 2025" },
    { term: "Term 2", start: "22 Apr 2025", end: "27 Jun 2025" },
    { term: "Term 3", start: "22 Jul 2025", end: "26 Sep 2025" },
    { term: "Term 4", start: "07 Oct 2025", end: "10 Dec 2025" },
  ],
  testimonials: [
    { quote: "Thandeka gave my daughter the confidence and academic foundation to earn a full bursary to study medicine. The teachers here truly care about each learner.", author: "Mrs. Precious Mahlangu", role: "Parent, Grade 12" },
    { quote: "I came to Thandeka struggling with mathematics. By Grade 11, I was topping my class. The extra support sessions and dedicated teachers made all the difference.", author: "Lungelo Zulu", role: "Former Learner, Class of 2023" },
    { quote: "As a member of the SGB, I have seen first-hand how committed this school is to every single learner — regardless of background or circumstances.", author: "Mr. Patrick Tau", role: "SGB Member" },
  ],
  socialFacebook: "", socialTwitter: "", socialYoutube: "",
  footerBio: "A proud public school serving the community. Registered with the Department of Education.",
  ctaTitle: "Be part of something extraordinary.",
  ctaBody: "Applications are open. Join a community that believes in every learner's potential.",
  ctaBullets: ["Applications close 30 September", "Grade 8 & Grade 1 intake", "No application fee"],
  // About page
  aboutSubtitle: "Forty-seven years of community, learning, and growth in Soweto.",
  aboutHistory: [
    "Thandeka Secondary School was founded in 1978 in the heart of Soweto, born out of a community's determination to provide quality education despite the constraints of the apartheid era. The name \"Thandeka\" — meaning \"beloved\" in isiZulu — reflects the school's identity as a place where every learner is valued.",
    "Over nearly five decades, we have grown from a modest facility with fewer than 200 learners into a thriving school of over 1,200 — producing doctors, engineers, artists, community leaders, and entrepreneurs across South Africa and the world.",
    "We are registered with and inspected by the Gauteng Department of Education, and our results are certified by Umalusi, South Africa's quality council for general and further education.",
  ],
  aboutHistoryImage: "",
  mission: "To provide a safe, inclusive, and academically rigorous environment where every learner achieves their full potential, develops strong character, and embraces the values of ubuntu.",
  vision: "To be recognised as the leading community school in Gauteng — a school that produces confident, compassionate, and capable citizens who contribute meaningfully to a democratic South Africa.",
  sgbBody: [
    "The School Governing Body (SGB) of Thandeka Secondary School is constituted in accordance with the South African Schools Act (SASA) and comprises elected representatives of parents, educators, non-teaching staff, and learners.",
    "The SGB meets quarterly and is responsible for overseeing school policy, budgets, and the overall governance of the institution. Parent involvement is actively encouraged at all levels.",
  ],
  awards: [
    { year: "2024", title: "Top 10 Public Schools — Gauteng DoE" },
    { year: "2023", title: "National Schools Excellence Award — DBE" },
    { year: "2022", title: "Best Matric Results — Soweto Region" },
    { year: "2021", title: "NEEDU Commendation for School Management" },
    { year: "2019", title: "Sector Education Award — SACE" },
    { year: "2018", title: "40 Years of Excellence Commemorative Recognition" },
  ],
  // Academics page
  academicStreams: [
    { name: "Science Stream", desc: "Mathematics, Physical Sciences, Life Sciences. Pathway to medicine, engineering, and the sciences.", subjects: ["Physical Sciences", "Life Sciences", "Mathematics", "Geography (opt.)"] },
    { name: "Commerce Stream", desc: "Accounting, Business Studies, Economics. Pathway to finance, law, management, and entrepreneurship.", subjects: ["Accounting", "Business Studies", "Economics", "Mathematics / ML"] },
    { name: "Humanities Stream", desc: "History, Geography, Consumer Studies. Pathway to social sciences, education, arts, and civil service.", subjects: ["History", "Geography", "Consumer Studies", "Tourism (opt.)"] },
  ],
  academicSupport: [
    { title: "Extra Lessons", body: "After-school extra lessons are offered Monday–Thursday for Grade 10–12 in Mathematics, Physical Sciences, English, and Accounting. No additional charge." },
    { title: "Saturday School", body: "Grade 12 learners attend Saturday morning sessions (8h00–11h00) from Term 2 to prepare for the National Senior Certificate examination." },
    { title: "Peer Tutoring", body: "Top-performing Grade 11 and 12 learners mentor their peers in a structured programme that benefits both tutor and tutee." },
    { title: "University Preparation", body: "Grade 12 learners receive guidance on NSFAS applications, university application procedures, and bursary opportunities from Term 1." },
  ],
  // Admissions page
  admissionsDocs: [
    "Completed application form (original)", "Certified copy of learner's birth certificate",
    "Certified copy of parent/guardian ID", "Proof of residence (not older than 3 months)",
    "Most recent school report (Grade 7)", "Transfer letter from previous school",
    "Immunisation card", "2 recent passport-size photographs",
  ],
  admissionsFees: [
    { label: "Annual School Fee", value: "R 2,800" },
    { label: "Registration Fee (new learners)", value: "R 350" },
    { label: "Stationery Pack (optional)", value: "R 280" },
    { label: "Sport Levy", value: "R 200" },
    { label: "Annual Total (approx.)", value: "R 3,630" },
  ],
  admissionsFeeNote: "Fee exemption applications are available. Families earning below the threshold (3x annual fee) may qualify for partial or full exemption. Visit the office for an application form.",
  admissionsFAQ: [
    { q: "When do applications open and close?", a: "Applications for 2026 admissions open 1 July 2025 and close 30 September 2025. Late applications are considered only if space remains." },
    { q: "Is there a school fee?", a: "Yes. Thandeka is a Section 21 school. The 2025 school fee is R2,800 per year. Fee exemption applications are available for qualifying families — please contact the school office." },
    { q: "What is the school's catchment area?", a: "As a Gauteng public school, we give first preference to learners residing within our designated feeder area. Learners outside this zone are accepted where space allows." },
    { q: "Are bursaries or financial assistance available?", a: "Full and partial fee exemptions are available. Additionally, the Thandeka Bursary Fund offers merit-based bursaries for Grade 8 entrants. Contact the office for application forms." },
    { q: "Do you offer late applications?", a: "Late applications are accepted from October onwards and processed in order of receipt if space remains. We advise applying before the deadline to secure placement." },
    { q: "What uniform is required?", a: "The school has a formal uniform. Full uniform policy and supplier details are provided in the acceptance pack after placement is confirmed." },
  ],
  admissionsKeyDates: [
    { date: "1 July 2025", event: "Applications Open" },
    { date: "30 Sep 2025", event: "Applications Close" },
    { date: "October 2025", event: "Assessment Interviews" },
    { date: "30 Nov 2025", event: "Outcomes Communicated" },
  ],
  // Student Life page
  studentActivities: [
    { cat: "Sport", items: ["Soccer (Boys & Girls)", "Netball", "Athletics", "Cricket", "Chess", "Table Tennis", "Volleyball", "Cross Country"] },
    { cat: "Culture & Arts", items: ["School Choir", "Drama & Theatre", "Dance Ensemble", "Visual Arts Club", "Creative Writing", "School Orchestra"] },
    { cat: "Clubs & Societies", items: ["Debate Society", "Science Club", "Robotics Club", "Environmental Club", "Entrepreneurship Society", "Community Service Club"] },
  ],
  calendarEvents: [
    { date: "15 Mar", title: "Annual Prize-Giving Ceremony" },
    { date: "10 Apr", title: "Sports Day" },
    { date: "2 May", title: "Heritage Language Festival" },
    { date: "27 Jun", title: "Arts & Culture Evening" },
    { date: "14 Aug", title: "Science Expo — Interschool" },
    { date: "20 Sep", title: "Graduation Day (Grade 12)" },
    { date: "10 Oct", title: "Matric Farewell" },
    { date: "5 Dec", title: "End-of-Year Concert" },
  ],
  // Resources page
  resourceLinks: [
    { cat: "Forms & Applications", items: ["Grade 8 Application Form 2026", "Fee Exemption Application Form", "Transfer Letter Request Form", "Indemnity Form — School Tours", "After-School Activity Consent Form", "Bursary Application Form"] },
    { cat: "Policies", items: ["Code of Conduct (Learner)", "Uniform Policy", "Bullying & Harassment Policy", "Substance Abuse Policy", "Cell Phone Policy", "Assessment Policy (CAPS Aligned)"] },
    { cat: "Academic Results", items: ["NSC Results 2024 (Matric)", "NSC Results 2023 (Matric)", "NSC Results 2022 (Matric)", "Annual Report 2024", "Annual Report 2023", "NEEDU Inspection Report 2022"] },
    { cat: "DBE Notices & Links", items: ["National Curriculum Statement (CAPS)", "NSFAS Application Portal", "Umalusi Certification", "SA Schools Act (SASA)", "Gauteng Education Online Portal", "SACE Professional Standards"] },
  ],
  parentPortalUrl: "#",
  // Contact page
  officeHours: "Mon–Fri: 07h30 – 15h30\nClosed school holidays",
  contactSubjects: ["General Enquiry", "Admissions", "Academic Query", "Finance / Fees", "SGB Related"],
  // News page
  newsletters: [
    { title: "Term 1 Newsletter 2025", date: "March 2025" },
    { title: "Term 4 Newsletter 2024", date: "December 2024" },
    { title: "Term 3 Newsletter 2024", date: "September 2024" },
    { title: "Term 2 Newsletter 2024", date: "June 2024" },
  ],
  features: [
    { title: "Academic Excellence", body: "CAPS-aligned curriculum with dedicated science, commerce, and humanities streams. Extra lessons and academic support built into the school week." },
    { title: "Sport & Extracurriculars", body: "Over 20 codes of sport, a full cultural programme, and societies ranging from robotics to drama. Every learner finds their edge." },
    { title: "Modern Facilities", body: "Computer lab, science laboratory, library, and sports grounds — all maintained to give learners the environment they deserve." },
    { title: "Ubuntu Values", body: "We develop the whole person. Our values — integrity, respect, perseverance, and community — shape learners long after they leave." },
  ],
};
