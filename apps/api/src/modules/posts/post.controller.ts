import { Request, Response } from "express";
import { prisma } from "@repo/database";
import { HttpStatus } from "@repo/types";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

const slugify = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── GET /posts — public. ?type=NEWS|BLOG filters; published-only unless authed ─

export const listPosts = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.query;
  const isAuthed = Boolean((req as any).user);

  const posts = await prisma.post.findMany({
    where: {
      ...(type === "NEWS" || type === "BLOG" ? { type } : {}),
      ...(isAuthed ? {} : { published: true }),
    },
    orderBy: [{ sortOrder: "asc" }, { date: "desc" }],
  });
  res.json({ status: "success", data: { posts } });
});

// ── POST /posts — ADMIN or MANAGER ────────────────────────────────────────────

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const { type, title, date, category, excerpt, body, image, published, sortOrder } = req.body;
  if (!title || !excerpt) {
    throw new AppError("title and excerpt are required.", HttpStatus.BAD_REQUEST);
  }

  let slug = slugify(title);
  const clash = await prisma.post.findUnique({ where: { slug } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.post.create({
    data: {
      type: type === "BLOG" ? "BLOG" : "NEWS",
      title, slug, excerpt,
      date:      date ?? new Date(),
      category:  category ?? null,
      body:      body ?? null,
      image:     image ?? null,
      published: published ?? true,
      sortOrder: sortOrder ?? 0,
    },
  });

  res.status(HttpStatus.CREATED).json({ status: "success", data: { post } });
});

// ── PATCH /posts/:id — ADMIN or MANAGER ───────────────────────────────────────

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { type, title, date, category, excerpt, body, image, published, sortOrder } = req.body;

  const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Post not found.", HttpStatus.NOT_FOUND);

  const post = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      ...(type      !== undefined && { type: type === "BLOG" ? "BLOG" : "NEWS" }),
      ...(title     !== undefined && { title }),
      ...(date      !== undefined && { date }),
      ...(category  !== undefined && { category }),
      ...(excerpt   !== undefined && { excerpt }),
      ...(body      !== undefined && { body }),
      ...(image     !== undefined && { image }),
      ...(published !== undefined && { published }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  res.json({ status: "success", data: { post } });
});

// ── DELETE /posts/:id — ADMIN or MANAGER ──────────────────────────────────────

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("Post not found.", HttpStatus.NOT_FOUND);

  await prisma.post.delete({ where: { id: req.params.id } });
  res.json({ status: "success", message: "Post deleted." });
});
