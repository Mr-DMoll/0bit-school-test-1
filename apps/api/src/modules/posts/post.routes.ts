import { Router } from "express";
import { listPosts, createPost, updatePost, deletePost } from "./post.controller.js";
import { protect }   from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role }      from "@repo/types";

const router = Router();

// Public — News/Blog sections read this without auth (published-only)
router.get("/", listPosts);

// Content management — both Admin and Manager
router.use(protect, authorize([Role.ADMIN, Role.MANAGER]));
router.post("/",        createPost);
router.patch("/:id",    updatePost);
router.delete("/:id",   deletePost);

export default router;
