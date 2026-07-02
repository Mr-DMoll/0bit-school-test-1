process.on("unhandledRejection", (reason: unknown) => {
  console.error("🔴 [UnhandledRejection]", reason);
  process.exit(1);
});
process.on("uncaughtException", (err: Error) => {
  console.error("🔴 [UncaughtException]", err.message, err.stack);
  process.exit(1);
});

import "./config/env.config.js";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { runMigrationsAndSeed } from "./db/migrate.js";
import { globalErrorHandler }  from "./middleware/error.middleware.js";
import { authRateLimiter, globalRateLimiter } from "./middleware/security.middleware.js";
import { auditLog }            from "./middleware/audit.middleware.js";
import { maintenanceMode }     from "./middleware/maintenance.middleware.js";
import systemRoutes       from "./modules/system/system.routes.js";
import authRoutes         from "./modules/auth/auth.routes.js";
import userRoutes         from "./modules/users/user.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import schoolRoutes       from "./modules/school/school.routes.js";
import postRoutes         from "./modules/posts/post.routes.js";
import auditRoutes        from "./modules/audit/audit.routes.js";
import teamRoutes         from "./modules/team/team.routes.js";
import analyticsRoutes    from "./modules/analytics/analytics.routes.js";
import uploadRoutes       from "./modules/upload/upload.routes.js";
import path from "path";
import fs from "fs";

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";

// ── 1. SECURITY & LOGGING ─────────────────────────────────────────────────────
app.use(helmet());
app.use(globalRateLimiter);
app.use(morgan(isProduction ? "combined" : "dev"));

// ── 2. CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL ?? "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowed) =>
        origin.startsWith(allowed)
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`🔴 CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── 3a. STATIC FILES ─────────────────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
// cross-origin: "cross-origin" lets the Next.js app (port 3000) load images
// served by the API (port 3001) — Helmet's default "same-origin" blocks this.
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(uploadsDir));

// ── 3. PARSERS ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── 4. CROSS-CUTTING MIDDLEWARE ───────────────────────────────────────────────
app.use(maintenanceMode);
app.use(auditLog);

// ── 5. ROUTES ─────────────────────────────────────────────────────────────────
const API = "/api/v1";

app.use(`${API}/system`,        systemRoutes);
app.use(`${API}/auth`,          authRateLimiter, authRoutes);
app.use(`${API}/users`,         userRoutes);
app.use(`${API}/notifications`, notificationRoutes);
app.use(`${API}/school`,        schoolRoutes);
app.use(`${API}/posts`,         postRoutes);
app.use(`${API}/audit`,         auditRoutes);
app.use(`${API}/team`,          teamRoutes);
app.use(`${API}/analytics`,     analyticsRoutes);
app.use(`${API}/upload`,        uploadRoutes);

// ── 6. 404 ────────────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status:  "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── 7. ERROR HANDLER ──────────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── 8. START ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

(async () => {
  await runMigrationsAndSeed();

  app.listen(PORT, () => {
    console.log(`\n─────────────────────────────────────────`);
    console.log(`🚀  API RUNNING`);
    console.log(`🌍  MODE:   ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗  URL:    http://localhost:${PORT}${API}`);
    console.log(`─────────────────────────────────────────\n`);
  });
})().catch((err: unknown) => {
  console.error("🔴 [Fatal] Server failed to start:", err);
  process.exit(1);
});

export default app;
