import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/database";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function deriveAction(method: string, path: string): string {
  const segments = path
    .replace(/^\/api\/v1/, "")
    .replace(/-/g, "_")
    .split("/")
    .filter((s) =>
      s.length > 0 &&
      !/^c[a-z0-9]{20,}$/.test(s) &&               // cuid
      !/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(s) &&      // uuid
      !/^\d+$/.test(s)                              // numeric id
    );
  return `${method}_${segments.join("_")}`.toUpperCase();
}

export function auditLog(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATING.has(req.method)) { next(); return; }

  // Captured now, not inside the "finish" callback — req.path reflects
  // whichever sub-router is currently dispatching, which by the time
  // "finish" fires has been stripped down to "/" (the mount-relative
  // path), losing the route segment entirely (e.g. "PATCH_" instead of
  // "PATCH_SCHOOL"). req.originalUrl is stable for the request's lifetime.
  const method = req.method;
  const path   = req.originalUrl.split("?")[0];

  res.on("finish", () => {
    if (!req.user?.userId)  return;
    if (req.auditLogged)    return;
    if (res.statusCode >= 400) return;

    const action = deriveAction(method, path);

    prisma.auditLog
      .create({
        data: {
          userId:    req.user.userId,
          action,
          meta:      { path, method, status: res.statusCode },
          ip:        req.ip ?? req.socket?.remoteAddress ?? null,
          userAgent: req.headers["user-agent"] ?? null,
        },
      })
      .catch(() => {});
  });

  next();
}
