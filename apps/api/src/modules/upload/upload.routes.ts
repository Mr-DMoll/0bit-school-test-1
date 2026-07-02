import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../../middleware/auth.middleware.js";
import { uploadFile } from "./upload.controller.js";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();
router.post("/", protect, upload.single("file"), uploadFile);
export default router;
