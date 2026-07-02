import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { catchAsync } from "../../utils/catchAsync.js";

// ── GET /audit — ADMIN only ───────────────────────────────────────────────────

export const listAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const take = Math.min(Number(req.query.limit) || 50, 200);

  const logs = await prisma.auditLog.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, firstName: true, lastName: true, displayName: true } } },
  });

  res.json({ status: "success", data: { logs } });
});
