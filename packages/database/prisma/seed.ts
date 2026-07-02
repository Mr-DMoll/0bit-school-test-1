import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import pkg from "bcryptjs";
const { hash } = pkg;
import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env"), override: true });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("❌ DATABASE_URL missing from .env");

  const pool    = new pg.Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma  = new PrismaClient({ adapter } as any);

  try {
    console.log("🌱 Seeding database...");

    await prisma.systemSetting.upsert({
      where:  { key: "registration_mode" },
      update: {},
      create: { key: "registration_mode", value: "INVITE_ONLY" },
    });

    await prisma.systemSetting.upsert({
      where:  { key: "app_name" },
      update: {},
      create: { key: "app_name", value: "My App" },
    });

    // Single-tenant site — one ADMIN account, no super admin tier. Reuses the
    // SUPER_ADMIN_EMAIL/PASSWORD env var names so bootstrap needs no changes.
    const adminEmail    = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? randomBytes(16).toString("hex");

    if (!adminEmail) {
      throw new Error("❌ SUPER_ADMIN_EMAIL is required in .env to seed the admin account.");
    }

    const passwordHash = await hash(adminPassword, 12);

    const admin = await prisma.user.upsert({
      where:  { email: adminEmail },
      update: {},
      create: {
        email:         adminEmail,
        password:      passwordHash,
        role:          "ADMIN",
        accountStatus: "ACTIVE",
        firstName:     "Site",
        lastName:      "Admin",
        displayName:   "Admin",
      },
    });

    await prisma.siteSettings.upsert({
      where:  { id: "singleton" },
      update: {},
      create: { id: "singleton" }, // uses the schema defaults — fictitious "Lebo Kola" example content
    });

    // Seed example work items so the Work section isn't empty on a fresh
    // site — only if there are none yet (never touches real data).
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      await prisma.project.createMany({
        data: [
          {
            title: "Budget Tracker",
            description: "A personal finance app to track income, expenses, and savings goals with simple charts.",
            thumbnailUrl: "https://placehold.co/600x400/0a0a0f/e8b339?text=Budget+Tracker",
            tags: ["React", "Node.js", "PostgreSQL"],
            liveUrl: "https://github.com/lebokola/budget-tracker",
            repoUrl: "https://github.com/lebokola/budget-tracker",
            sortOrder: 0,
          },
          {
            title: "Campus Connect",
            description: "A social platform for students to find study groups and share notes within their cohort.",
            thumbnailUrl: "https://placehold.co/600x400/0a0a0f/e8b339?text=Campus+Connect",
            tags: ["Next.js", "TypeScript", "Tailwind"],
            liveUrl: "https://github.com/lebokola/campus-connect",
            repoUrl: "https://github.com/lebokola/campus-connect",
            sortOrder: 1,
          },
          {
            title: "Recipe Finder",
            description: "Search recipes by ingredients you already have, with filters for diet and cook time.",
            thumbnailUrl: "https://placehold.co/600x400/0a0a0f/e8b339?text=Recipe+Finder",
            tags: ["JavaScript", "REST API", "CSS"],
            liveUrl: "https://github.com/lebokola/recipe-finder",
            repoUrl: "https://github.com/lebokola/recipe-finder",
            sortOrder: 2,
          },
        ],
      });
      console.log("🌱 Seeded 3 example work items");
    }

    console.log(`✅ Admin: ${admin.email}`);
    if (!process.env.SUPER_ADMIN_PASSWORD) {
      console.log(`   Generated password: ${adminPassword}`);
      console.log(`   ⚠️  Save this now — it will NOT be shown again.`);
    }
    console.log(`   👉 Log in and change the password immediately.`);
    console.log(`   ℹ️  Re-seeding will NOT update an existing account — use the app.`);
  } catch (error: any) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
