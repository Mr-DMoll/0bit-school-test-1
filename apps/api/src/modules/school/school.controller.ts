import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { Role, HttpStatus } from "@repo/types";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

// Identity/brand — changing these is a brand decision, kept Admin-only.
const BRANDING_FIELDS = [
  "schoolName", "type", "motto", "accentColor", "accentSoft", "logoUrl",
] as const;

// Day-to-day content — Manager can edit these too.
const CONTENT_FIELDS = [
  "heroPhoto", "address", "phone", "email",
  "principalName", "principalPhoto", "principalMessage",
  "province", "passRate", "learnerCount", "yearEstablished", "ratio",
  "features",
  "socialFacebook", "socialTwitter", "socialYoutube",
  "footerBio", "ctaTitle", "ctaBody", "ctaBullets",
  // About page
  "aboutSubtitle", "aboutHistory", "aboutHistoryImage",
  "mission", "vision", "sgbBody", "awards",
  // Academics page
  "academicStreams", "academicSupport",
  // Admissions page
  "admissionsDocs", "admissionsFees", "admissionsFeeNote", "admissionsFAQ", "admissionsKeyDates",
  // Student Life page
  "studentActivities", "calendarEvents",
  // Resources page
  "resourceLinks", "parentPortalUrl",
  // Contact page
  "officeHours", "contactSubjects",
  // News page
  "newsletters",
] as const;

// ── GET /school — public, the public site + dashboard branding both read this ─

export const getSchool = catchAsync(async (_req: Request, res: Response) => {
  const school = await prisma.school.upsert({
    where:  { id: "singleton" },
    update: {},
    create: { id: "singleton" },
    include: { staff: { orderBy: { sortOrder: "asc" } }, testimonials: { orderBy: { sortOrder: "asc" } }, termDates: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { sortOrder: "asc" } } },
  });
  res.json({ status: "success", data: { school } });
});

// ── PATCH /school — ADMIN or MANAGER, but Branding fields are Admin-only ─────

export const updateSchool = catchAsync(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === Role.ADMIN;

  const attemptedBrandingField = BRANDING_FIELDS.find((f) => req.body[f] !== undefined);
  if (attemptedBrandingField && !isAdmin) {
    throw new AppError("Branding can only be changed by an Admin.", HttpStatus.FORBIDDEN);
  }

  const allowedFields = isAdmin ? [...BRANDING_FIELDS, ...CONTENT_FIELDS] : CONTENT_FIELDS;
  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }

  const school = await prisma.school.upsert({
    where:  { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  res.json({ status: "success", data: { school } });
});
