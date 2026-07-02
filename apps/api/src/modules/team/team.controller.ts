import { Request, Response } from "express";
import { randomBytes } from "crypto";
import { prisma } from "@repo/database";
import { HttpStatus, Role } from "@repo/types";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";
import { sendInviteEmail } from "../../services/mail.service.js";

const TEAM_SELECT = {
  id: true, email: true, role: true, accountStatus: true,
  firstName: true, lastName: true, displayName: true,
  lastActiveAt: true, createdAt: true,
} as const;

// ── GET /team — ADMIN only ────────────────────────────────────────────────────

export const listTeam = catchAsync(async (_req: Request, res: Response) => {
  const members = await prisma.user.findMany({
    select: TEAM_SELECT,
    orderBy: { createdAt: "asc" },
  });
  res.json({ status: "success", data: { members } });
});

// ── POST /team/invite — ADMIN only ────────────────────────────────────────────

export const inviteTeamMember = catchAsync(async (req: Request, res: Response) => {
  const { email, firstName, lastName, role } = req.body;
  if (!email) throw new AppError("Email is required.", HttpStatus.BAD_REQUEST);

  const normalized = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) throw new AppError("That email is already on the team.", HttpStatus.CONFLICT);

  const targetRole = role === "ADMIN" ? Role.ADMIN : Role.MANAGER;
  const token   = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const member = await prisma.user.create({
    data: {
      email:               normalized,
      password:            randomBytes(32).toString("hex"), // unusable placeholder until set-password
      role:                targetRole,
      accountStatus:       "PENDING",
      firstName:           firstName ?? null,
      lastName:            lastName  ?? null,
      verificationCode:    token,
      verificationExpires: expires,
      invitedById:         req.user!.userId,
    },
    select: TEAM_SELECT,
  });

  const inviteLink = `${process.env.FRONTEND_URL}/login/accept-invite?token=${token}&email=${encodeURIComponent(normalized)}`;
  const school = await prisma.school.findUnique({ where: { id: "singleton" } });
  await sendInviteEmail(normalized, inviteLink, firstName || normalized, school?.schoolName);

  await prisma.auditLog.create({
    data: { userId: req.user!.userId, action: "TEAM_INVITED", meta: { email: normalized, role: targetRole } },
  });
  req.auditLogged = true;

  res.status(HttpStatus.CREATED).json({ status: "success", data: { member } });
});

// ── DELETE /team/:id — ADMIN only ─────────────────────────────────────────────

export const removeTeamMember = catchAsync(async (req: Request, res: Response) => {
  if (req.params.id === req.user!.userId) {
    throw new AppError("You can't remove your own account.", HttpStatus.BAD_REQUEST);
  }

  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) throw new AppError("Team member not found.", HttpStatus.NOT_FOUND);

  if (target.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      throw new AppError("Can't remove the only Admin account.", HttpStatus.BAD_REQUEST);
    }
  }

  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ status: "success", message: "Team member removed." });
});
