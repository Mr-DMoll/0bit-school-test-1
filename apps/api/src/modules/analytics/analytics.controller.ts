import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { catchAsync } from "../../utils/catchAsync.js";

// ── POST /analytics/track — public, fired from the public site on page load ──

export const trackPageView = catchAsync(async (req: Request, res: Response) => {
  const { path } = req.body;
  if (!path || typeof path !== "string") {
    return res.status(204).end(); // don't error the visitor's page over a bad beacon
  }

  await prisma.pageView.create({
    data: {
      path:     path.slice(0, 500),
      referrer: typeof req.body.referrer === "string" ? req.body.referrer.slice(0, 500) : null,
    },
  });

  res.status(204).end();
});

// ── GET /analytics/summary — Admin or Manager ─────────────────────────────────

export const getSummary = catchAsync(async (_req: Request, res: Response) => {
  const since14d = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [totalViews, recentViews, topPages] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since14d } },
      select: { path: true, createdAt: true },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
  ]);

  // Bucket recent views into per-day counts (last 14 days, oldest first)
  const days: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: 0 });
  }
  const dayIndex = new Map(days.map((d, i) => [d.date, i]));
  for (const v of recentViews) {
    const key = v.createdAt.toISOString().slice(0, 10);
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].count++;
  }

  res.json({
    status: "success",
    data: {
      totalViews,
      last14Days: days,
      topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
    },
  });
});
