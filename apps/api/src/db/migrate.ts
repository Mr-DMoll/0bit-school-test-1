/**
 * Self-contained database migration + seed runner.
 *
 * Runs automatically on every API startup (called from server.ts).
 * Uses raw pg — NOT Prisma — so it works with the transaction-mode pooler
 * (pgbouncer=true) without needing a direct database connection.
 *
 * Every statement is idempotent:
 *   CREATE TABLE IF NOT EXISTS
 *   ALTER TABLE ... ADD COLUMN IF NOT EXISTS
 *   CREATE INDEX IF NOT EXISTS
 *   INSERT ... ON CONFLICT DO NOTHING
 *
 * This means it is safe to run on every restart — existing data is never touched.
 */

import { randomBytes } from "crypto";
import pg from "pg";
import bcrypt from "bcryptjs";
export async function runMigrationsAndSeed(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.warn("⚠️  [MIGRATE] DATABASE_URL not set — skipping migrations");
    return;
  }

  const pool   = new pg.Pool({ connectionString, max: 1, idleTimeoutMillis: 10_000 });
  const client = await pool.connect();

  try {
    console.log("🔄 [MIGRATE] Running startup migrations...");

    // ── Enums ────────────────────────────────────────────────────────────────
    // Role used to have 4 values (SUPER_ADMIN/ADMIN/MANAGER/USER) from the
    // original SaaS template. This is now a 2-role model (ADMIN/MANAGER) —
    // Postgres can't drop enum values in place, so existing databases get
    // migrated via recreate-and-cast. Only runs once: after it succeeds the
    // legacy values no longer exist, so the IF EXISTS guard skips on rerun.
    await client.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
          WHERE t.typname = 'Role' AND e.enumlabel = 'USER'
        ) THEN
          ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
          ALTER TABLE "User" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;
          UPDATE "User" SET "role" = 'MANAGER' WHERE "role" NOT IN ('ADMIN', 'MANAGER');
          DROP TYPE "Role";
          CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER');
          ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
          ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MANAGER';
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "SchoolType" AS ENUM ('PRIMARY', 'HIGH');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "PostType" AS ENUM ('NEWS', 'BLOG');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "RegistrationMode" AS ENUM ('INVITE_ONLY', 'SELF_REGISTER', 'SELF_REGISTER_AUTO');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // ── Tables ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id"                   TEXT          NOT NULL,
        "email"                TEXT          NOT NULL,
        "password"             TEXT          NOT NULL,
        "role"                 "Role"        NOT NULL DEFAULT 'MANAGER',
        "accountStatus"        "AccountStatus" NOT NULL DEFAULT 'PENDING',
        "firstName"            TEXT,
        "lastName"             TEXT,
        "displayName"          TEXT,
        "avatarUrl"            TEXT,
        "phone"                TEXT,
        "verificationCode"     TEXT,
        "verificationExpires"  TIMESTAMP(3),
        "passwordResetToken"   TEXT,
        "passwordResetExpires" TIMESTAMP(3),
        "lastActiveAt"         TIMESTAMP(3),
        "city"                 TEXT,
        "country"              TEXT,
        "language"             TEXT,
        "dateOfBirth"          TIMESTAMP(3),
        "googleId"             TEXT,
        "googleRefreshToken"   TEXT,
        "invitedById"          TEXT,
        "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "AuditLog" (
        "id"        TEXT NOT NULL,
        "userId"    TEXT NOT NULL,
        "action"    TEXT NOT NULL,
        "meta"      JSONB,
        "ip"        TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Notification" (
        "id"        TEXT    NOT NULL,
        "userId"    TEXT    NOT NULL,
        "title"     TEXT    NOT NULL,
        "body"      TEXT    NOT NULL,
        "read"      BOOLEAN NOT NULL DEFAULT false,
        "link"      TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "id"        TEXT NOT NULL,
        "key"       TEXT NOT NULL,
        "value"     TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
      );
    `);

    // ── School content (single-tenant: one school, one site) ─────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS "School" (
        "id"               TEXT NOT NULL DEFAULT 'singleton',
        "schoolName"       TEXT NOT NULL DEFAULT 'Your School Name',
        "type"             "SchoolType" NOT NULL DEFAULT 'HIGH',
        "motto"            TEXT NOT NULL DEFAULT 'Your school motto here',
        "accentColor"      TEXT NOT NULL DEFAULT '#C2542E',
        "accentSoft"       TEXT NOT NULL DEFAULT '#E8D9C3',
        "logoUrl"          TEXT,
        "heroPhoto"        TEXT,
        "address"          TEXT NOT NULL DEFAULT '',
        "phone"            TEXT NOT NULL DEFAULT '',
        "email"            TEXT NOT NULL DEFAULT '',
        "principalName"    TEXT NOT NULL DEFAULT '',
        "principalPhoto"   TEXT,
        "principalMessage" TEXT NOT NULL DEFAULT '',
        "province"         TEXT NOT NULL DEFAULT '',
        "passRate"         INTEGER NOT NULL DEFAULT 0,
        "learnerCount"     INTEGER NOT NULL DEFAULT 0,
        "yearEstablished"  INTEGER NOT NULL DEFAULT 2000,
        "ratio"            TEXT NOT NULL DEFAULT '1:30',
        "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "School_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "StaffMember" (
        "id"        TEXT NOT NULL,
        "schoolId"  TEXT NOT NULL DEFAULT 'singleton',
        "name"      TEXT NOT NULL,
        "role"      TEXT NOT NULL,
        "subject"   TEXT,
        "photo"     TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS "StaffMember_schoolId_sortOrder_idx" ON "StaffMember"("schoolId", "sortOrder");`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Post" (
        "id"        TEXT NOT NULL,
        "schoolId"  TEXT NOT NULL DEFAULT 'singleton',
        "type"      "PostType" NOT NULL DEFAULT 'NEWS',
        "title"     TEXT NOT NULL,
        "slug"      TEXT NOT NULL,
        "date"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "category"  TEXT,
        "excerpt"   TEXT NOT NULL,
        "body"      TEXT,
        "image"     TEXT,
        "published" BOOLEAN NOT NULL DEFAULT true,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Post_schoolId_type_published_idx" ON "Post"("schoolId", "type", "published");`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Testimonial" (
        "id"        TEXT NOT NULL,
        "schoolId"  TEXT NOT NULL DEFAULT 'singleton',
        "quote"     TEXT NOT NULL,
        "author"    TEXT NOT NULL,
        "role"      TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "TermDate" (
        "id"        TEXT NOT NULL,
        "schoolId"  TEXT NOT NULL DEFAULT 'singleton',
        "term"      TEXT NOT NULL,
        "start"     TIMESTAMP(3) NOT NULL,
        "end"       TIMESTAMP(3) NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "TermDate_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
        "id"        TEXT NOT NULL,
        "schoolId"  TEXT NOT NULL DEFAULT 'singleton',
        "url"       TEXT NOT NULL,
        "caption"   TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "PageView" (
        "id"        TEXT NOT NULL,
        "path"      TEXT NOT NULL,
        "referrer"  TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");`);
    await client.query(`CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");`);

    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "StaffMember" ADD CONSTRAINT "StaffMember_schoolId_fkey"
          FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_schoolId_fkey"
          FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_schoolId_fkey"
          FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "TermDate" ADD CONSTRAINT "TermDate_schoolId_fkey"
          FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_schoolId_fkey"
          FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // Ensure the one School row always exists.
    await client.query(`
      INSERT INTO "School" ("id", "updatedAt")
      VALUES ('singleton', NOW())
      ON CONFLICT ("id") DO NOTHING;
    `);

    // Seed real demo content (ported from the Figma design) so the site isn't
    // blank on first run. Only runs once — never touches a school that's
    // already been edited (any Post/StaffMember row existing skips this).
    const postCount = await client.query(`SELECT COUNT(*)::int AS count FROM "Post"`);
    if (postCount.rows[0].count === 0) {
      await client.query(`
        UPDATE "School" SET
          "schoolName" = 'Thandeka Secondary School',
          "type" = 'HIGH',
          "motto" = 'Knowledge. Character. Ubuntu.',
          "accentColor" = '#C2542E',
          "accentSoft" = '#E8D9C3',
          "heroPhoto" = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=900&fit=crop&auto=format',
          "address" = '14 Mthembu Street, Soweto, Gauteng, 1804',
          "phone" = '+27 11 938 4421',
          "email" = 'admin@thandeka.edu.za',
          "principalName" = 'Mrs. Nomsa Dlamini',
          "principalPhoto" = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=560&fit=crop&auto=format',
          "principalMessage" = 'At Thandeka Secondary School, we believe every learner carries within them the potential for greatness. Our commitment is to nurture that potential through rigorous academics, strong values, and a community grounded in ubuntu — the understanding that we rise together. I invite you to explore what our school offers and to join our family.',
          "province" = 'Gauteng',
          "passRate" = 94,
          "learnerCount" = 1240,
          "yearEstablished" = 1978,
          "ratio" = '1:28',
          "updatedAt" = NOW()
        WHERE "id" = 'singleton';
      `);

      const staff = [
        { name: "Mrs. Nomsa Dlamini", role: "Principal", subject: "Mathematics", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format" },
        { name: "Mr. Sipho Nkosi", role: "Deputy Principal", subject: "Life Sciences", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format" },
        { name: "Ms. Lerato Mokoena", role: "Head of Department", subject: "English", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&auto=format" },
        { name: "Mr. Tebogo Sithole", role: "Teacher", subject: "Physical Sciences", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format" },
        { name: "Ms. Zanele Khumalo", role: "Teacher", subject: "History", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&auto=format" },
        { name: "Mr. Kabelo Mosia", role: "Teacher", subject: "Accounting", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format" },
        { name: "Ms. Thandi Radebe", role: "Teacher", subject: "Geography", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format" },
        { name: "Mr. Bongani Cele", role: "Teacher", subject: "isiZulu", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format" },
      ];
      for (let i = 0; i < staff.length; i++) {
        const s = staff[i];
        await client.query(
          `INSERT INTO "StaffMember" ("id", "name", "role", "subject", "photo", "sortOrder") VALUES ($1, $2, $3, $4, $5, $6)`,
          [randomBytes(12).toString("hex"), s.name, s.role, s.subject, s.photo, i],
        );
      }

      const news = [
        { title: "Class of 2024 Achieves 94% Matric Pass Rate", date: "2025-01-14", category: "Academics", excerpt: "We are proud to announce that our Grade 12 class of 2024 achieved an outstanding 94% pass rate, with 67 distinctions across all subjects.", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&h=460&fit=crop&auto=format" },
        { title: "New Science Laboratory Opens for Term 2", date: "2025-02-03", category: "Facilities", excerpt: "Thanks to a partnership with the Gauteng Department of Education, Thandeka now has a fully equipped science laboratory for 35 learners.", image: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=700&h=460&fit=crop&auto=format" },
        { title: "Debate Team Wins Gauteng Regional Championship", date: "2025-03-22", category: "Achievements", excerpt: "Our Grade 10 and 11 debate teams swept both the junior and senior categories at the 2025 Gauteng Regional Schools Debate Championship.", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&h=460&fit=crop&auto=format" },
        { title: "Annual Sports Day: A Celebration of School Spirit", date: "2025-04-08", category: "Sport", excerpt: "Learners from all grades came together for our annual Sports Day, with track, field, and team events held across the full campus grounds.", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&h=460&fit=crop&auto=format" },
        { title: "Bursary Applications Now Open for 2026", date: "2025-05-01", category: "Admissions", excerpt: "The Thandeka Bursary Fund is now accepting applications for the 2026 academic year. Financial need and academic merit are both considered.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=460&fit=crop&auto=format" },
        { title: "Grade 9s Complete Career Guidance Programme", date: "2025-05-19", category: "Academics", excerpt: "All Grade 9 learners participated in a two-day career guidance workshop to help them choose their subject streams for Grade 10.", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=460&fit=crop&auto=format" },
      ];
      for (let i = 0; i < news.length; i++) {
        const n = news[i];
        const slug = n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await client.query(
          `INSERT INTO "Post" ("id", "type", "title", "slug", "date", "category", "excerpt", "image", "sortOrder", "createdAt", "updatedAt")
           VALUES ($1, 'NEWS', $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [randomBytes(12).toString("hex"), n.title, slug, n.date, n.category, n.excerpt, n.image, i],
        );
      }

      const termDates = [
        { term: "Term 1", start: "2025-01-15", end: "2025-03-28" },
        { term: "Term 2", start: "2025-04-22", end: "2025-06-27" },
        { term: "Term 3", start: "2025-07-22", end: "2025-09-26" },
        { term: "Term 4", start: "2025-10-07", end: "2025-12-10" },
      ];
      for (let i = 0; i < termDates.length; i++) {
        const t = termDates[i];
        await client.query(
          `INSERT INTO "TermDate" ("id", "term", "start", "end", "sortOrder") VALUES ($1, $2, $3, $4, $5)`,
          [randomBytes(12).toString("hex"), t.term, t.start, t.end, i],
        );
      }

      const testimonials = [
        { quote: "Thandeka gave my daughter the confidence and academic foundation to earn a full bursary to study medicine. The teachers here truly care about each learner.", author: "Mrs. Precious Mahlangu", role: "Parent, Grade 12" },
        { quote: "I came to Thandeka struggling with mathematics. By Grade 11, I was topping my class. The extra support sessions and dedicated teachers made all the difference.", author: "Lungelo Zulu", role: "Former Learner, Class of 2023" },
        { quote: "As a member of the SGB, I have seen first-hand how committed this school is to every single learner — regardless of background or circumstances.", author: "Mr. Patrick Tau", role: "SGB Member" },
      ];
      for (let i = 0; i < testimonials.length; i++) {
        const t = testimonials[i];
        await client.query(
          `INSERT INTO "Testimonial" ("id", "quote", "author", "role", "sortOrder") VALUES ($1, $2, $3, $4, $5)`,
          [randomBytes(12).toString("hex"), t.quote, t.author, t.role, i],
        );
      }

      const photos = [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=700&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&h=500&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=700&h=500&fit=crop&auto=format",
      ];
      for (let i = 0; i < photos.length; i++) {
        await client.query(
          `INSERT INTO "GalleryPhoto" ("id", "url", "sortOrder") VALUES ($1, $2, $3)`,
          [randomBytes(12).toString("hex"), photos[i], i],
        );
      }

      console.log("🌱 [MIGRATE] Seeded School demo content (Thandeka Secondary School)");
    }

    // ── Idempotent column additions (for databases created before these fields) ─
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "city"        TEXT;`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "country"     TEXT;`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language"    TEXT;`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone"       TEXT;`);

    // ── Indexes ──────────────────────────────────────────────────────────────
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"    ON "User"("email");`);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "User_email_idx"    ON "User"("email");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "User_role_idx"     ON "User"("role");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "User_googleId_idx" ON "User"("googleId");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "AuditLog_userId_idx"   ON "AuditLog"("userId");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");`);
    await client.query(`CREATE INDEX        IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");`);
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "SystemSetting_key_key" ON "SystemSetting"("key");`);

    // ── Foreign keys (safe to re-run — DO block catches duplicate) ───────────
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "User" ADD CONSTRAINT "User_invitedById_fkey"
          FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    console.log("✅ [MIGRATE] Schema ready");

    // ── Seed system settings ─────────────────────────────────────────────────
    await client.query(`
      INSERT INTO "SystemSetting" ("id", "key", "value", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, 'registration_mode', 'INVITE_ONLY', NOW(), NOW())
      ON CONFLICT ("key") DO NOTHING;
    `);
    await client.query(`
      INSERT INTO "SystemSetting" ("id", "key", "value", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, 'app_name', 'My App', NOW(), NOW())
      ON CONFLICT ("key") DO NOTHING;
    `);

    // ── Seed the single admin account (this is a single-tenant site — one ──────
    // admin, no super admin tier). Reuses the SUPER_ADMIN_EMAIL/PASSWORD env
    // var names so the platform's bootstrap flow needs no changes — only the
    // role actually created here differs (ADMIN, not SUPER_ADMIN).
    const existing = await client.query(
      `SELECT id FROM "User" WHERE role = 'ADMIN' LIMIT 1`
    );
    if (existing.rowCount === 0) {
      const adminEmail    = process.env.SUPER_ADMIN_EMAIL;
      const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? randomBytes(16).toString("hex");

      if (!adminEmail) {
        throw new Error("SUPER_ADMIN_EMAIL is required in .env to seed the admin account.");
      }

      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const id = randomBytes(12).toString("hex");
      await client.query(`
        INSERT INTO "User" (
          "id", "email", "password", "role", "accountStatus",
          "firstName", "lastName", "displayName", "createdAt", "updatedAt"
        ) VALUES ($1, $2, $3, 'ADMIN', 'ACTIVE', 'Site', 'Admin', 'Admin', NOW(), NOW())
        ON CONFLICT ("email") DO NOTHING;
      `, [id, adminEmail, passwordHash]);

      console.log(`🌱 [MIGRATE] Admin account created → ${adminEmail}`);
      if (!process.env.SUPER_ADMIN_PASSWORD) {
        console.log(`   Generated password: ${adminPassword}`);
        console.log(`   ⚠️  Save this now — it will NOT be shown again.`);
      }
      console.log(`   👉 Log in and change the password immediately.`);
      console.log(`   ℹ️  Re-seeding will NOT update an existing account — use the app.`);
    } else {
      console.log("🌱 [MIGRATE] Admin account already exists — skipping seed");
    }

  } catch (err: any) {
    console.error("❌ [MIGRATE] Migration failed:", err.message);
    throw err; // re-throw so server startup aborts — don't run a broken app
  } finally {
    client.release();
    await pool.end();
  }
}
